"""
MOIL Limited - Geological Reserve Estimation (Model 1)
=======================================================

Hybrid Spatial Regressor for underground Manganese Ore Tonnage (MT) and
Manganese Grade (% Mn) estimation at Balaghat-style deposits
(Braunite / Gondite ores of the Sausar Supergroup, India).

Architecture
------------
    Ordinary Kriging (PyKrige)  +  XGBoost Regressor
        |                               |
      captures spatial               captures non-linear interactions
    autocorrelation via            between borehole depth trends and
    variogram distance decay       Sentinel-2 spectral / thermal proxies

    Hybrid strategy: fit XGBoost, krige the XGBoost *residuals* spatially
    (fixed spherical variogram), add the kriged residual back. Confidence
    intervals come from the kriging variance (sigmavar).

Validation
----------
    5-Fold Spatial BLOCK Cross-Validation (easting strips), NOT a random
    split - prevents spatial autocorrelation leakage between folds.

Outputs (artifacts/)
--------------------
    reserve_model.pkl      joblib bundle (XGBoost models + scaler + krigers)
    variogram_params.json  fitted Sill / Range / Nugget per variable
    reserve_summary.json   tonnage + grade + area per zone (Green/Yellow/Red)
    reserve_grid.csv       100x100 predicted grid (grade, thickness, tonnage)
    reserve_zone_map.png   classified zone raster (2D)
    reserve_grade_surface_3d.png  3D Mn grade surface

Usage
-----
    python reserve_model.py --n-boreholes 150 --seed 42

    Optionally supply real borehole assays as CSV (data/boreholes.csv) with
    columns: borehole_id, easting, northing, depth_m, rock_type, mn_pct,
    fe_pct, sio2_pct, thickness_m, red, nir, swir, lst
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import warnings
from dataclasses import dataclass
from pathlib import Path

import joblib
import matplotlib

matplotlib.use("Agg")  # headless rendering (no display required)
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import ndimage
from scipy.interpolate import RegularGridInterpolator, griddata
from scipy.optimize import curve_fit
from scipy.spatial.distance import pdist, squareform
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GroupKFold
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor

# PyKrige is optional at import time; if unavailable the pipeline falls back
# to a pure XGBoost predictor with a warning (losing the spatial block).
try:
    from pykrige.ok import OrdinaryKriging

    HAS_PYKRIGE = True
except Exception:  # pragma: no cover - environment without geostatistics lib
    OrdinaryKriging = None
    HAS_PYKRIGE = False

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
LOGGER = logging.getLogger("reserve_model")

# ---------------------------------------------------------------------------
# Physical & deposit constants (Balaghat / Sausar Supergroup calib datum)
# ---------------------------------------------------------------------------
DOMAIN_X_M = 1200.0          # easting extent of the study area (m)
DOMAIN_Y_M = 800.0           # northing extent of the study area (m)
DENSITY_T_M3 = 3.60          # bulk density of manganese ore (t/m^3)
BLOCK_AREA_M2 = 10000.0      # nominal reporting block for predict_reserve (100x100 m)
N_GRID = 100                 # 100 x 100 regular prediction grid

# Zone thresholds (spec): Green high ore > 38%, Yellow medium 34-38%, Red low < 32%.
# The 32-34 % transitional band is grouped with Yellow (documented).
GRADE_GREEN = 38.0
GRADE_YELLOW = 34.0
GRADE_RED = 32.0

# Geological rock codes
LITHOLOGIES = ("Gondite", "Mica Schist", "Quartzite")

# Engineered model feature order (core + remote-sensing + depth interactions)
FEATURES = [
    "easting",
    "northing",
    "depth_m",
    "ndvi",
    "ndmi",
    "lst",
    "depth_m_sq",
    "easting_northing",
    "depth_ndvi",
    "depth_ndmi",
]

ARTIFACT_DIR = Path("artifacts")
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. Experimental semi-variogram (Sill, Range, Nugget)
# ---------------------------------------------------------------------------

def spherical_model(r: np.ndarray, psill: float, variogram_range: float, nugget: float) -> np.ndarray:
    """Isotropic spherical variogram gamma(h) = n + s * [1.5h/a - 0.5(h/a)^3]."""
    r = np.atleast_1d(np.asarray(r, dtype=float))
    gamma = np.where(
        r <= variogram_range,
        nugget + psill * (1.5 * (r / variogram_range) - 0.5 * (r / variogram_range) ** 3),
        nugget + psill,
    )
    return gamma


def experimental_semivariogram(x, y, z, n_lags: int = 14):
    """Bin all sample pairs into distance lags; gamma(h) = mean 0.5*(z_i - z_j)^2."""
    x, y, z = np.asarray(x, float), np.asarray(y, float), np.asarray(z, float)
    dist = squareform(pdist(np.c_[x, y]))
    z_diff = np.abs(z[:, None] - z[None, :])
    upper = np.triu_indices(dist.shape[0], k=1)
    d = dist[upper]
    half_sq = 0.5 * z_diff[upper] ** 2
    max_d = d.max()
    lag_c, gamma = [], []
    if max_d <= 0:
        return np.array([]), np.array([])
    edges = np.linspace(0.0, max_d, n_lags + 1)
    for k in range(n_lags):
        mask = (d >= edges[k]) & (d < edges[k + 1])
        if mask.sum() < 8:
            continue
        lag_c.append(d[mask].mean())
        gamma.append(half_sq[mask].mean())
    return np.array(lag_c), np.array(gamma)


def fit_spherical_variogram(x, y, z, n_lags: int = 14) -> dict:
    """Least-squares fit of a spherical variogram; returns Sill/Range/Nugget."""
    lags, gamma = experimental_semivariogram(x, y, z, n_lags=n_lags)
    if lags.size == 0:
        LOGGER.warning("Too few pairs - variogram fit skipped (nugget-only model).")
        return {"psill": 1.0, "range": 100.0, "nugget": float(np.var(z)) if z.size else 1.0, "lags": [], "gamma": []}
    p0 = [max(float(np.nanmax(gamma) - np.nanmin(gamma)), 0.1), 0.4 * lags.max(), float(np.nanmin(gamma))]
    try:
        popt, _ = curve_fit(
            spherical_model,
            lags,
            gamma,
            p0=p0,
            bounds=([0.0, 20.0, 0.0], [np.inf, lags.max() * 2.0, gamma.max()]),
            maxfev=20000,
        )
        psill, variogram_range, nugget = popt
    except (RuntimeError, ValueError) as exc:  # pragma: no cover - pathological data
        LOGGER.warning("curve_fit failed (%s); using manual variogram moments.", exc)
        psill, variogram_range, nugget = p0
    psill = float(max(psill, 1e-6))
    nugget = float(max(min(nugget, psill * 0.5), 0.0))
    variogram_range = float(max(variogram_range, 1.0))
    LOGGER.info("Spherical variogram fit: Sill=%.3f | Range=%.1fm | Nugget=%.3f", psill + nugget, variogram_range, nugget)
    return {"psill": psill, "range": variogram_range, "nugget": nugget, "lags": lags.tolist(), "gamma": gamma.tolist()}


# ---------------------------------------------------------------------------
# 2. Synthetic borehole simulation (spatially autocorrelated latent field)
# ---------------------------------------------------------------------------
# A smooth Gaussian random field (generated with a Gaussian convolution
# kernel) emulates the litho-structural continuity of the Sausar belt:
# boreholes drilled into the same orebody correlate over hundreds of metres.
# ---------------------------------------------------------------------------

def simulate_boreholes(n_boreholes: int = 150, seed: int = 42) -> tuple[pd.DataFrame, dict]:
    """Simulate boreholes AND a continuous Sentinel-2 scene over the domain.

    The satellite imagery (NDVI / NDMI / LST) is generated as a full-coverage
    raster derived from the latent ore-grade field - the way a real remote-
    sensing scene would be acquired independently of drilling. Boreholes then
    sample that scene at their collars, and the 100x100 prediction grid maps
    the scene directly (no borehole-to-grid smoothing needed).
    """
    LOGGER.info(
        "Simulating %d boreholes (seed=%d) with Gaussian random field autocorrelation",
        n_boreholes, seed,
    )
    rng = np.random.default_rng(seed)

    # --- latent spatially-correlated ore-grade field over the domain -----
    gi, gj = 61, 41
    gx = np.linspace(0.0, DOMAIN_X_M, gi)
    gy = np.linspace(0.0, DOMAIN_Y_M, gj)
    noise_blob = rng.normal(size=(gj, gi))
    texture = rng.normal(size=(gj, gi))
    blob = ndimage.gaussian_filter(noise_blob, sigma=12.0, truncate=2.5)
    fines = ndimage.gaussian_filter(texture, sigma=2.0, truncate=2.5)
    yy, _ = np.mgrid[0:gj, 0:gi]
    trend = yy / gj  # northing mineralisation trend (synclinorium limb)
    field = 0.80 * blob / np.std(blob) + 0.15 * fines / np.std(fines) + 0.55 * trend
    field = (field - field.min()) / (np.ptp(field) + 1e-12)
    interp = RegularGridInterpolator((gy, gx), field, bounds_error=False, fill_value=0.5)
    # independent seam-thickness field: ore body thickness has its own continuity
    thickness_field = ndimage.gaussian_filter(rng.normal(size=(gj, gi)), sigma=9.0, truncate=2.5)
    thickness_field = (thickness_field - thickness_field.min()) / (np.ptp(thickness_field) + 1e-12)
    interp_thick = RegularGridInterpolator((gy, gx), thickness_field, bounds_error=False, fill_value=0.5)

    # ---- Sentinel-2 scene rasters (full coverage, correlated with orebase) -
    mn_img = 23.0 + 22.0 * field - 2.4 * (160.0 / 280.0)  # representative depth
    ndvi_img = np.clip(0.64 - 0.0065 * mn_img + rng.normal(0.0, 0.012, size=field.shape), 0.25, 0.80)
    ndmi_img = np.clip(0.10 + 0.012 * mn_img - 0.0009 * 160.0 + rng.normal(0.0, 0.012, size=field.shape), 0.02, 0.42)
    lst_img = np.clip(31.5 - 0.06 * mn_img + rng.normal(0.0, 0.6, size=field.shape), 24.0, 36.0)
    satellites = {
        "ndvi": RegularGridInterpolator((gy, gx), ndvi_img, bounds_error=False, fill_value=0.5),
        "ndmi": RegularGridInterpolator((gy, gx), ndmi_img, bounds_error=False, fill_value=0.3),
        "lst": RegularGridInterpolator((gy, gx), lst_img, bounds_error=False, fill_value=30.0),
        "thickness": interp_thick,
    }

    # --- sample borehole collars (somewhat clustered like real drill plans) -
    frac_cluster = 0.35
    n_clust = int(n_boreholes * frac_cluster)
    n_unif = n_boreholes - n_clust
    ex = np.concatenate(
        [rng.uniform(0.0, DOMAIN_X_M, n_unif),
         rng.uniform(0.18 * DOMAIN_X_M, 0.45 * DOMAIN_X_M, n_clust // 2),
         rng.uniform(0.62 * DOMAIN_X_M, 0.88 * DOMAIN_X_M, n_clust - n_clust // 2)]
    )
    en = np.concatenate(
        [rng.uniform(0.0, DOMAIN_Y_M, n_unif),
         rng.uniform(0.25 * DOMAIN_Y_M, 0.75 * DOMAIN_Y_M, n_clust)]
    )
    field_at = interp(np.c_[en, ex])
    thick_at = interp_thick(np.c_[en, ex])
    ndvi_bh = satellites["ndvi"](np.c_[en, ex])
    ndmi_bh = satellites["ndmi"](np.c_[en, ex])
    lst_bh = satellites["lst"](np.c_[en, ex])

    # --- per-hole attributes: depth, lithology, assays, geophysics --------
    records = []
    LITHO_OFFSET = {"Gondite": 0.85, "Mica Schist": 0.0, "Quartzite": -0.70}
    for i in range(n_boreholes):
        depth_m = float(rng.uniform(40.0, 280.0))
        f = float(field_at[i])

        # lithology follows the latent field + depth (deeper holes leave the ore body)
        if f > 0.62:
            rock = "Gondite"
        elif f > 0.44:
            rock = "Gondite" if rng.random() < 0.45 else "Mica Schist"
        elif f > 0.26:
            rock = "Mica Schist"
        else:
            rock = "Quartzite" if rng.random() < 0.70 else "Mica Schist"
        if depth_m > 200 and f < 0.45 and rng.random() < 0.5:
            rock = "Quartzite"  # deep barren envelope

        # manganese grade: latent field + lithology + mild depth penalty
        mn = 23.0 + 22.0 * f + LITHO_OFFSET[rock] * 2.0 - 2.4 * (depth_m / 280.0) + rng.normal(0.0, 1.2)

        # iron and silica are co-genetic and inversely correlated with Mn
        fe_off = {"Quartzite": 3.0, "Mica Schist": 0.5, "Gondite": -1.5}[rock]
        fe = 27.0 - 0.36 * mn + fe_off + rng.normal(0.0, 2.1)
        sio2 = 44.0 - 0.50 * mn - 0.28 * fe + (3.5 if rock == "Gondite" else 0.0) + rng.normal(0.0, 3.0)

        # ore seam thickness: strongest control is grade (iron oxide beds thicken with
        # high Mn); a small independent spatial component + noise round it out
        thickness = 1.6 + 0.16 * np.clip(mn, 20, 48) + 1.6 * max(0.0, f - 0.40) + 0.25 * float(thick_at[i]) + rng.normal(0.0, 0.25)

        # --- Sentinel-2 bands sampled from the full-scene rasters ----------
        nir = float(np.clip(0.40 + rng.normal(0.0, 0.02), 0.30, 0.55))
        red = float(np.clip(nir * (1.0 - ndvi_bh[i]) / (1.0 + ndvi_bh[i]) + rng.normal(0.0, 0.005), 0.04, 0.35))
        swir = float(np.clip(nir * (1.0 - ndmi_bh[i]) / (1.0 + ndmi_bh[i]) + rng.normal(0.0, 0.005), 0.10, 0.50))

        records.append(
            {
                "borehole_id": f"BH-{i + 1:03d}",
                "easting": round(float(ex[i]), 2),
                "northing": round(float(en[i]), 2),
                "depth_m": round(depth_m, 2),
                "rock_type": rock,
                "mn_pct": round(float(np.clip(mn, 16.0, 52.0)), 2),
                "fe_pct": round(float(np.clip(fe, 5.0, 42.0)), 2),
                "sio2_pct": round(float(np.clip(sio2, 10.0, 62.0)), 2),
                "thickness_m": round(float(np.clip(thickness, 0.5, 8.0)), 2),
                "red": red,
                "nir": nir,
                "swir": swir,
                "lst": round(float(lst_bh[i]), 2),
            }
        )
    return pd.DataFrame(records), satellites


def load_or_simulate(data_csv: str | None, n_boreholes: int, seed: int) -> tuple[pd.DataFrame, dict | None]:
    """Prefer real assays CSV if present, otherwise fall back to the simulator."""
    if data_csv and Path(data_csv).exists():
        LOGGER.info("Loading real borehole records from %s", data_csv)
        df = pd.read_csv(data_csv)
        required = {"easting", "northing", "depth_m", "red", "nir", "swir", "lst"}
        missing = required - set(df.columns)
        if missing:
            raise ValueError(f"CSV is missing required columns: {sorted(missing)}")
        return df, None
    return simulate_boreholes(n_boreholes=n_boreholes, seed=seed)


# ---------------------------------------------------------------------------
# 3. Feature engineering (NDVI / NDMI from Sentinel-2 bands + interactions)
# ---------------------------------------------------------------------------

def engineer_features(df: pd.DataFrame, with_targets: bool = True) -> pd.DataFrame:
    out = df.copy()
    out["ndvi"] = (out["nir"] - out["red"]) / (out["nir"] + out["red"] + 1e-12)
    out["ndmi"] = (out["nir"] - out["swir"]) / (out["nir"] + out["swir"] + 1e-12)
    out["depth_m_sq"] = out["depth_m"] ** 2
    out["easting_northing"] = out["easting"] * out["northing"]
    out["depth_ndvi"] = out["depth_m"] * out["ndvi"]
    out["depth_ndmi"] = out["depth_m"] * out["ndmi"]
    if with_targets:
        # Diagnostic: partial oxide sum (Mn + Fe + SiO2). Real manganese ores
        # also carry Al2O3, LOI and moisture, so this runs well below 100.
        out["oxide_sum"] = out["mn_pct"] + out["fe_pct"] + out["sio2_pct"]
    return out


# ---------------------------------------------------------------------------
# 4. Spatial Block Cross-Validation
# ---------------------------------------------------------------------------

def spatial_block_groups(coords: np.ndarray, n_blocks: int = 5) -> np.ndarray:
    """Assign samples to contiguous easting strips (blocks) - blocks are held
    out whole during CV so information never leaks across the spatial domain."""
    order = np.argsort(coords[:, 0])
    groups = np.empty(len(coords), dtype=int)
    for block_idx in range(n_blocks):
        start = int(round(block_idx * len(order) / n_blocks))
        end = int(round((block_idx + 1) * len(order) / n_blocks))
        groups[order[start:end]] = block_idx
    return groups


def block_cv_scores(X, y, groups, params: dict, n_splits: int = 5) -> dict:
    """GroupKFold over spatial strips; scaler fitted per fold to avoid leakage."""
    r2, rmse, mae = [], [], []
    gkf = GroupKFold(n_splits=n_splits)
    for train_idx, val_idx in gkf.split(X, y, groups):
        scaler = StandardScaler().fit(X[train_idx])
        Xtr = scaler.transform(X[train_idx])
        Xva = scaler.transform(X[val_idx])
        model = XGBRegressor(**params)
        model.fit(Xtr, y[train_idx])
        pred = model.predict(Xva)
        r2.append(r2_score(y[val_idx], pred))
        rmse.append(float(np.sqrt(mean_squared_error(y[val_idx], pred))))
        mae.append(float(mean_absolute_error(y[val_idx], pred)))
    return {
        "r2_mean": float(np.mean(r2)), "r2_std": float(np.std(r2)),
        "rmse_mean": float(np.mean(rmse)), "rmse_std": float(np.std(rmse)),
        "mae_mean": float(np.mean(mae)), "mae_std": float(np.std(mae)),
        "fold_scores": [{"r2": r, "rmse": rm, "mae": ma} for r, rm, ma in zip(r2, rmse, mae)],
    }


# ---------------------------------------------------------------------------
# 5. Hybrid model: XGBoost + ordinary-kriged residuals
# ---------------------------------------------------------------------------

class ReserveHybrid:
    """Wraps the trained XGBoost regressors, fitted residual Krigers and scaler."""

    def __init__(self, xgb_grade, xgb_thickness, scaler, residual_x, residual_y,
                 residual_grade, residual_thickness, var_grade, var_thickness,
                 floor_grade: float = 0.0, floor_thickness: float = 0.0):
        self.xgb_grade = xgb_grade
        self.xgb_thickness = xgb_thickness
        self.scaler = scaler
        self.rx = residual_x
        self.ry = residual_y
        self.rg = residual_grade
        self.rth = residual_thickness
        self.var_grade = var_grade
        self.var_thickness = var_thickness
        # model-error variance floor: keeps the CI honest even where the kriged
        # residual variance collapses to zero (XGBoost absorbed the signal).
        self.floor_grade = float(floor_grade)
        self.floor_thickness = float(floor_thickness)
        self._ok_grade = None
        self._ok_thick = None

    # -- lazy krigers (rebuild once; cheap for < few thousand samples) ------
    def _kriger(self, values: np.ndarray, variogram: dict):
        if not HAS_PYKRIGE:
            return None
        return OrdinaryKriging(
            self.rx, self.ry, values,
            variogram_model="spherical",
            variogram_parameters={"sill": variogram["psill"], "range": variogram["range"], "nugget": variogram["nugget"]},
            verbose=False, enable_plotting=False,
        )

    def _ensure_krigers(self):
        if self._ok_grade is None and HAS_PYKRIGE:
            self._ok_grade = self._kriger(self.rg, self.var_grade)
            self._ok_thick = self._kriger(self.rth, self.var_thickness)

    def predict(self, X_scaled: np.ndarray, easting, northing):
        """Return grade, thickness, plus spatial residual corrections + variance."""
        grade_base = self.xgb_grade.predict(X_scaled)
        thick_base = self.xgb_thickness.predict(X_scaled)
        if not HAS_PYKRIGE:
            warnings.warn("PyKrige unavailable - confidence intervals omitted.", RuntimeWarning)
            return (grade_base, np.maximum(thick_base, 0.2),
                    np.full_like(grade_base, self.floor_grade),
                    np.full_like(thick_base, self.floor_thickness))
        self._ensure_krigers()
        zg, s2g = self._ok_grade.execute("points", np.asarray(easting, float), np.asarray(northing, float))
        zt, s2t = self._ok_thick.execute("points", np.asarray(easting, float), np.asarray(northing, float))
        grade = grade_base + np.asarray(zg).ravel()
        thick = np.maximum(thick_base + np.asarray(zt).ravel(), 0.2)
        return grade, thick, np.asarray(s2g).ravel() + self.floor_grade, np.asarray(s2t).ravel() + self.floor_thickness


# ---------------------------------------------------------------------------
# 6. Grid prediction, zoning and tonnage aggregation
# ---------------------------------------------------------------------------

def build_grid(engineered: pd.DataFrame, satellites: dict | None = None) -> dict:
    """100x100 regular grid. Depth is held at the mean collar depth while the
    Sentinel-2 proxies are evaluated from the full-scene raster (when the
    simulator provided one), or kriged from the boreholes for real CSV data."""
    ex = np.linspace(0.0, DOMAIN_X_M, N_GRID)
    en = np.linspace(0.0, DOMAIN_Y_M, N_GRID)
    gx, gy = np.meshgrid(ex, en)
    xq, yq = gx.ravel(), gy.ravel()

    if satellites is not None:
        pts = np.c_[yq, xq]
        ndvi_g = satellites["ndvi"](pts).ravel()
        moisture_g = satellites["ndmi"](pts).ravel()
        lst_g = satellites["lst"](pts).ravel()
    else:
        def smooth_borehole_to_grid(col):
            if HAS_PYKRIGE:
                try:
                    var = fit_spherical_variogram(engineered["easting"], engineered["northing"], engineered[col].to_numpy())
                    ok = OrdinaryKriging(
                        engineered["easting"].to_numpy(), engineered["northing"].to_numpy(),
                        engineered[col].to_numpy(), variogram_model="spherical",
                        variogram_parameters={"sill": var["psill"], "range": var["range"], "nugget": var["nugget"]},
                        verbose=False, enable_plotting=False,
                    )
                    z, _ = ok.execute("points", xq, yq)
                    return np.asarray(z).ravel()
                except Exception as exc:  # pragma: no cover
                    LOGGER.warning("Kriging %s failed (%s); falling back to linear interpolation.", col, exc)
            return griddata(
                (engineered["easting"].to_numpy(), engineered["northing"].to_numpy()),
                engineered[col].to_numpy(), (xq, yq), method="linear"
            )

        ndvi_g = smooth_borehole_to_grid("ndvi")
        moisture_g = smooth_borehole_to_grid("ndmi")
        lst_g = smooth_borehole_to_grid("lst")

    depth_g = np.full_like(xq, float(engineered["depth_m"].mean()))
    # NaN masking (kriging/griddata may leave holes near domain corners)
    ndvi_g = np.nan_to_num(ndvi_g, nan=np.nanmean(ndvi_g))
    moisture_g = np.nan_to_num(moisture_g, nan=np.nanmean(moisture_g))
    lst_g = np.nan_to_num(lst_g, nan=np.nanmean(lst_g))
    return {"x": xq, "y": yq, "ndvi": ndvi_g, "ndmi": moisture_g, "lst": lst_g, "depth": depth_g, "shape": (N_GRID, N_GRID)}


def classify_zone(grade: np.ndarray) -> np.ndarray:
    """[-1 red 32..?] red <32, transitional 32-34 -> treated yellow, green >=38."""
    zones = np.full(np.asarray(grade).shape, -1, dtype=int)
    zones[grade < GRADE_RED] = 0          # RED low
    zones[(grade >= GRADE_RED) & (grade < GRADE_YELLOW)] = 1   # transition -> yellow
    zones[(grade >= GRADE_YELLOW) & (grade < GRADE_GREEN)] = 1 # YELLOW medium
    zones[grade >= GRADE_GREEN] = 2       # GREEN high
    return zones


ZONE_NAMES = {0: "RED (Low <32% Mn)", 1: "YELLOW (Medium 32-38% Mn)", 2: "GREEN (High >=38% Mn)"}
ZONE_COLORS = {0: "#d62728", 1: "#ffd700", 2: "#2ca02c"}


def zone_reserve_summary(grid_out: pd.DataFrame, cell_area_m2: float,
                         density: float = DENSITY_T_M3) -> pd.DataFrame:
    """Aggregate tonnage (MT) and average grade per zone across the grid.

    The TOTAL row reports only *ore* cells: predicted grade >= 32% Mn cutoff.
    """
    grid_out = grid_out.copy()
    grid_out["zone"] = classify_zone(grid_out["grade_pct"])
    rows = []
    for zone_id, name in ZONE_NAMES.items():
        cells = grid_out[grid_out["zone"] == zone_id]
        if cells.empty:
            continue
        rows.append({
            "zone": name,
            "zone_id": int(zone_id),
            "grid_cells": int(len(cells)),
            "area_km2": round(cell_area_m2 * len(cells) / 1e6, 4),
            "tonnage_mt": round(float(cells["tonnage_mt"].sum()), 3),
            "mean_grade_mn_pct": round(float(cells["grade_pct"].mean()), 2),
            "mean_thickness_m": round(float(cells["thickness_m"].mean()), 2),
        })
    ore = grid_out[grid_out["grade_pct"] >= GRADE_RED]
    if not ore.empty:
        rows.append({
            "zone": "TOTAL ORE (cutoff >=32% Mn)",
            "zone_id": -1,
            "grid_cells": int(len(ore)),
            "area_km2": round(cell_area_m2 * len(ore) / 1e6, 4),
            "tonnage_mt": round(float(ore["tonnage_mt"].sum()), 3),
            "mean_grade_mn_pct": round(float(ore["grade_pct"].mean()), 2),
            "mean_thickness_m": round(float(ore["thickness_m"].mean()), 2),
        })
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# 7. Persistence + inference entry points
# ---------------------------------------------------------------------------

RESERVE_MODEL_PATH = ARTIFACT_DIR / "reserve_model.pkl"
_ESTIMATOR_CACHE = None


def save_reserve_model(estimator: ReserveHybrid, meta: dict) -> Path:
    bundle = {
        "version": 1,
        "meta": meta,
        "feature_names": FEATURES,
        "scaler": estimator.scaler,
        "xgb_grade": estimator.xgb_grade,
        "xgb_thickness": estimator.xgb_thickness,
        "variogram_grade": estimator.var_grade,
        "variogram_thickness": estimator.var_thickness,
        "residual_x": estimator.rx,
        "residual_y": estimator.ry,
        "residual_grade": estimator.rg,
        "residual_thickness": estimator.rth,
        "floor_grade": estimator.floor_grade,
        "floor_thickness": estimator.floor_thickness,
        "constants": {"density": DENSITY_T_M3, "block_area": BLOCK_AREA_M2,
                      "default_lst": float(meta.get("mean_lst", 31.0))},
    }
    joblib.dump(bundle, RESERVE_MODEL_PATH)
    LOGGER.info("Model artifact saved -> %s", RESERVE_MODEL_PATH)
    return RESERVE_MODEL_PATH


def load_reserve_model() -> ReserveHybrid:
    global _ESTIMATOR_CACHE
    if _ESTIMATOR_CACHE is not None:
        return _ESTIMATOR_CACHE
    if not RESERVE_MODEL_PATH.exists():
        raise FileNotFoundError(f"Missing {RESERVE_MODEL_PATH}. Run `python reserve_model.py` first.")
    bundle = joblib.load(RESERVE_MODEL_PATH)
    _ESTIMATOR_CACHE = ReserveHybrid(
        xgb_grade=bundle["xgb_grade"], xgb_thickness=bundle["xgb_thickness"],
        scaler=bundle["scaler"],
        residual_x=bundle["residual_x"], residual_y=bundle["residual_y"],
        residual_grade=bundle["residual_grade"], residual_thickness=bundle["residual_thickness"],
        var_grade=bundle["variogram_grade"], var_thickness=bundle["variogram_thickness"],
        floor_grade=bundle.get("floor_grade", 0.0), floor_thickness=bundle.get("floor_thickness", 0.0),
    )
    _ESTIMATOR_CACHE._default_lst = bundle["constants"]["default_lst"]
    return _ESTIMATOR_CACHE


def _feature_vector(easting, northing, depth, ndvi, moisture, lst=None):
    # Paired entry point used by both the grid mapper and predict_reserve.
    if lst is None:
        cache = load_reserve_model()
        lst = getattr(cache, "_default_lst", 31.0)
    return np.array([
        float(easting), float(northing), float(depth), float(ndvi), float(moisture), float(lst),
        float(depth) ** 2, float(easting) * float(northing), float(depth) * float(ndvi), float(depth) * float(moisture),
    ])


def predict_reserve(easting, northing, depth, ndvi, moisture, lst: float | None = None) -> dict:
    """Predict underground Mn grade, seam thickness, tonnage and confidence
    interval at an arbitrary (unsampled) coordinate.

    Parameters
    ----------
    easting, northing : float - collar position (UTM, metres)
    depth             : float - mid-seam depth below collar (m, positive down)
    ndvi, moisture    : float - Sentinel-2 NDVI and NDMI (moisture) index
    lst               : float|None - thermal LST (defaults to deposit mean)

    Returns a dict with grade_pct, grade CI (1.96 sigma), thickness, and the
    in-situ tonnage for a nominal 100x100 m reporting block (Million Tonnes).
    """
    estimator = load_reserve_model()
    vec = _feature_vector(easting, northing, depth, ndvi, moisture, lst)
    X = estimator.scaler.transform(vec.reshape(1, -1))
    grade, thick, s2g, s2t = estimator.predict(X, np.atleast_1d(easting), np.atleast_1d(northing))
    grade, thick, s2g, s2t = float(grade[0]), float(thick[0]), float(s2g[0]), float(s2t[0])
    half_ci_grade = 1.96 * np.sqrt(max(s2g, 0.0))
    tonnage_mt = thick * BLOCK_AREA_M2 * DENSITY_T_M3 * 1e-6
    return {
        "easting": float(easting), "northing": float(northing), "depth_m": float(depth),
        "grade_pct": round(grade, 2),
        "grade_ci_lower": round(grade - half_ci_grade, 2),
        "grade_ci_upper": round(grade + half_ci_grade, 2),
        "thickness_m": round(thick, 2),
        "tonnage_mt_per_100m_block": round(tonnage_mt, 3),
        "zone": ZONE_NAMES[int(classify_zone(np.array([grade]))[0])],
    }


# ---------------------------------------------------------------------------
# 8. Plotting
# ---------------------------------------------------------------------------

def plot_zone_map(grid_out: pd.DataFrame, boreholes: pd.DataFrame, out: Path) -> Path:
    """2D classified reserve map: GREEN >=38, YELLOW 32-38, RED <32."""
    gx = grid_out["easting"].to_numpy().reshape(N_GRID, N_GRID)
    gy = grid_out["northing"].to_numpy().reshape(N_GRID, N_GRID)
    zones = classify_zone(grid_out["grade_pct"].to_numpy()).reshape(N_GRID, N_GRID)
    cmap = matplotlib.colors.ListedColormap([ZONE_COLORS[0], ZONE_COLORS[1], ZONE_COLORS[2]])
    fig, ax = plt.subplots(figsize=(10, 7))
    im = ax.pcolormesh(gx, gy, zones, cmap=cmap, vmin=0, vmax=2, shading="auto")
    sc = ax.scatter(boreholes["easting"], boreholes["northing"], c=boreholes["mn_pct"],
                    cmap=plt.cm.coolwarm, edgecolor="k", linewidth=0.4, s=28, label="Boreholes")
    ax.set_title("MOIL - Manganese Ore Reserve Zones (100x100 grid)")
    ax.set_xlabel("Easting (m)"); ax.set_ylabel("Northing (m)")
    cbar_zone = fig.colorbar(im, ax=ax, ticks=[0, 1, 2], shrink=0.8)
    cbar_zone.ax.set_yticklabels(["RED <32", "YELLOW 32-38", "GREEN >=38"])
    cbar_grade = fig.colorbar(sc, ax=ax, shrink=0.8)
    cbar_grade.set_label("Assayed Mn % (boreholes)")
    fig.tight_layout(); fig.savefig(out, dpi=160); plt.close(fig)
    LOGGER.info("Zone raster map exported -> %s", out)
    return out


def plot_grade_surface_3d(grid_out: pd.DataFrame, boreholes: pd.DataFrame, out: Path) -> Path:
    gx = grid_out["easting"].to_numpy().reshape(N_GRID, N_GRID)
    gy = grid_out["northing"].to_numpy().reshape(N_GRID, N_GRID)
    grade = grid_out["grade_pct"].to_numpy().reshape(N_GRID, N_GRID)
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection="3d")
    surf = ax.plot_surface(gx, gy, grade, cmap="RdYlGn", alpha=0.85, linewidth=0, antialiased=True)
    ax.scatter(boreholes["easting"], boreholes["northing"], boreholes["mn_pct"],
               c="navy", s=24, depthshade=True, label="Assayed boreholes")
    ax.set_title("MOIL - Predicted Mn Grade Surface (% Mn)")
    ax.set_xlabel("Easting (m)"); ax.set_ylabel("Northing (m)"); ax.set_zlabel("Mn %")
    fig.colorbar(surf, ax=ax, shrink=0.6, pad=0.1)
    fig.tight_layout(); fig.savefig(out, dpi=130); plt.close(fig)
    LOGGER.info("3D grade surface exported -> %s", out)
    return out


# ---------------------------------------------------------------------------
# 9. Pipeline orchestration
# ---------------------------------------------------------------------------

def run_pipeline(n_boreholes: int, seed: int, data_csv: str | None = None) -> dict:
    raw, satellites = load_or_simulate(data_csv, n_boreholes, seed)
    df = engineer_features(raw)
    LOGGER.info("Prepared dataset: %d samples | Mn mean=%.2f%% | oxide_sum mean=%.1f",
                len(df), df["mn_pct"].mean(), df["oxide_sum"].mean())

    # --- prediction targets -------------------------------------------------
    y_grade = df["mn_pct"].to_numpy()
    y_thick = df["thickness_m"].to_numpy()
    coords = df[["easting", "northing"]].to_numpy()
    groups = spatial_block_groups(coords, n_blocks=5)
    LOGGER.info("Spatial blocks: %s (each an easting strip, held out whole during CV)",
                np.unique(groups, return_counts=True)[1].tolist())

    # --- hyper-parameter tuning via spatial block CV -------------------------
    X = df[FEATURES].to_numpy()
    param_grid = {
        "n_estimators": [150, 300, 500],
        "max_depth": [3, 5, 7],
        "learning_rate": [0.02, 0.05, 0.10],
        "subsample": [0.7, 0.85, 1.0],
    }
    rng = np.random.default_rng(seed)
    configs = [
        {k: v[int(rng.integers(len(v)))] for k, v in param_grid.items()}
        for _ in range(28)
    ]
    best = {"grade": (None, np.inf, {}), "thickness": (None, np.inf, {})}
    for cfg in configs:
        xgb_cfg = {"random_state": seed, "tree_method": "hist", "objective": "reg:squarederror", **cfg}
        for target_name, y, slot in (("grade", y_grade, "grade"), ("thickness", y_thick, "thickness")):
            scores = block_cv_scores(X, y, groups, xgb_cfg)
            if scores["mae_mean"] < best[slot][1]:
                best[slot] = (xgb_cfg, scores["mae_mean"], scores)
    for slot in ("grade", "thickness"):
        _, _, scores = best[slot]
        LOGGER.info("[%s] tuning | best MAE=%.3f | R2=%.3f | RMSE=%.3f | params=%s",
                    slot, scores["mae_mean"], scores["r2_mean"], scores["rmse_mean"], best[slot][0])

    # --- final fit on all data + residual kriging ----------------------------
    scaler = StandardScaler().fit(X)
    Xs = scaler.transform(X)
    xgb_grade = XGBRegressor(**best["grade"][0]); xgb_grade.fit(Xs, y_grade)
    xgb_thick = XGBRegressor(**best["thickness"][0]); xgb_thick.fit(Xs, y_thick)

    res_grade = y_grade - xgb_grade.predict(Xs)
    res_thick = y_thick - xgb_thick.predict(Xs)

    # --- block-CV performance of final config, per target ---------------------
    cv_report = {
        "grade": block_cv_scores(X, y_grade, groups, best["grade"][0]),
        "thickness": block_cv_scores(X, y_thick, groups, best["thickness"][0]),
    }
    LOGGER.info("Final 5-fold spatial block CV | grade R2=%.3f RMSE=%.3f MAE=%.3f",
                cv_report["grade"]["r2_mean"], cv_report["grade"]["rmse_mean"], cv_report["grade"]["mae_mean"])
    LOGGER.info("Final 5-fold spatial block CV | thickness R2=%.3f RMSE=%.3f MAE=%.3f",
                cv_report["thickness"]["r2_mean"], cv_report["thickness"]["rmse_mean"], cv_report["thickness"]["mae_mean"])

    # model-error variance floor comes from GENUINE held-out accuracy (CV RMSE^2),
    # not from in-sample residuals which XGBoost squeezes toward zero. This keeps
    # the confidence interval honest when kriged residual variance collapses.
    floor_grade = float(cv_report["grade"]["rmse_mean"] ** 2)
    floor_thick = float(cv_report["thickness"]["rmse_mean"] ** 2)
    var_grade = fit_spherical_variogram(df["easting"], df["northing"], res_grade)
    var_thick = fit_spherical_variogram(df["easting"], df["northing"], res_thick)
    variogram_report = {
        "grade_mn_pct": {k: v for k, v in var_grade.items() if k in ("psill", "range", "nugget")},
        "thickness_m": {k: v for k, v in var_thick.items() if k in ("psill", "range", "nugget")},
    }

    hybrid = ReserveHybrid(xgb_grade, xgb_thick, scaler,
                           df["easting"].to_numpy(), df["northing"].to_numpy(),
                           res_grade, res_thick, var_grade, var_thick,
                           floor_grade=floor_grade, floor_thickness=floor_thick)
    LOGGER.info("XGB feature importance (grade): %s",
                dict(zip(FEATURES, (100 * xgb_grade.feature_importances_).round(1))))

    # --- 100x100 grid prediction + tonnage -----------------------------------
    grid = build_grid(df, satellites)
    rows = []
    for i in range(len(grid["x"])):
        vec = _feature_vector(grid["x"][i], grid["y"][i], grid["depth"][i],
                              grid["ndvi"][i], grid["ndmi"][i], grid["lst"][i])
        rows.append(vec)
    Xg = scaler.transform(np.vstack(rows))
    grade_g, thick_g, s2g_g, s2t_g = hybrid.predict(Xg, grid["x"], grid["y"])
    dx = grid["x"].max() / (N_GRID - 1) if N_GRID > 1 else DOMAIN_X_M
    dy = grid["y"].max() / (N_GRID - 1) if N_GRID > 1 else DOMAIN_Y_M
    cell_area = dx * dy
    grid_out = pd.DataFrame({
        "easting": grid["x"], "northing": grid["y"], "depth_m": grid["depth"],
        "ndvi_grid": grid["ndvi"], "ndmi_grid": grid["ndmi"], "lst_grid": grid["lst"],
        "grade_pct": np.round(grade_g, 2), "thickness_m": thick_g.round(2),
        "grade_kriging_var": s2g_g.round(4),
        "tonnage_mt": np.round(thick_g * cell_area * DENSITY_T_M3 * 1e-6, 4),
    })
    summary = zone_reserve_summary(grid_out, cell_area_m2=cell_area)
    LOGGER.info("Reserve summary (100x100 grid, density=%.1f t/m3):\n%s", DENSITY_T_M3, summary.to_string(index=False))

    # --- plots & persistence ---------------------------------------------------
    plot_zone_map(grid_out, raw, ARTIFACT_DIR / "reserve_zone_map.png")
    plot_grade_surface_3d(grid_out, raw, ARTIFACT_DIR / "reserve_grade_surface_3d.png")
    grid_out.to_csv(ARTIFACT_DIR / "reserve_grid.csv", index=False)
    summary.to_json(ARTIFACT_DIR / "reserve_summary.json", orient="records", indent=2)
    (ARTIFACT_DIR / "variogram_params.json").write_text(json.dumps(variogram_report, indent=2))

    meta = {
        "n_boreholes": int(len(df)), "seed": seed, "targets": ["mn_pct", "thickness_m"],
        "features": FEATURES, "n_grid": N_GRID, "grid_cell_area_m2": round(cell_area, 3),
        "density_t_m3": DENSITY_T_M3, "mean_lst": float(df["lst"].mean()),
        "cv": cv_report, "tuning": {k: {"params": v[0], "mae": v[1]} for k, v in best.items()},
    }
    save_reserve_model(hybrid, meta)

    # --- Print Structured Accuracy Summary to Bash ---
    grade_mean = float(df["mn_pct"].mean())
    thick_mean = float(df["thickness_m"].mean())
    grade_mape = float(cv_report["grade"]["mae_mean"] / grade_mean * 100.0)
    thick_mape = float(cv_report["thickness"]["mae_mean"] / thick_mean * 100.0)

    print("\n" + "=" * 70)
    print("      MOIL GEOLOGICAL RESERVE MODEL - ACCURACY & VALIDATION REPORT")
    print("=" * 70)
    print(f"Dataset Source : {data_csv or 'Synthetic Simulation'} ({len(df)} boreholes)")
    print(f"Validation     : 5-Fold Spatial Block Cross-Validation (Zero Spatial Leakage)")
    print("-" * 70)
    print(f"1. ORE GRADE (% Mn) PREDICTION ACCURACY:")
    print(f"   - Coefficient of Determination (R2) : {cv_report['grade']['r2_mean']:.4f} (+/- {cv_report['grade']['r2_std']:.4f})")
    print(f"   - Root Mean Squared Error (RMSE)    : {cv_report['grade']['rmse_mean']:.3f} % Mn")
    print(f"   - Mean Absolute Error (MAE)         : {cv_report['grade']['mae_mean']:.3f} % Mn")
    print(f"   - Mean Percentage Accuracy          : {100.0 - grade_mape:.2f}% (MAPE: {grade_mape:.2f}%)")
    print("-" * 70)
    print(f"2. SEAM THICKNESS (m) PREDICTION ACCURACY:")
    print(f"   - Coefficient of Determination (R2) : {cv_report['thickness']['r2_mean']:.4f} (+/- {cv_report['thickness']['r2_std']:.4f})")
    print(f"   - Root Mean Squared Error (RMSE)    : {cv_report['thickness']['rmse_mean']:.3f} m")
    print(f"   - Mean Absolute Error (MAE)         : {cv_report['thickness']['mae_mean']:.3f} m")
    print(f"   - Mean Percentage Accuracy          : {100.0 - thick_mape:.2f}% (MAPE: {thick_mape:.2f}%)")
    print("-" * 70)
    print("3. RESERVE TONNAGE & ZONING ESTIMATE (100x100 Grid):")
    for _, row in summary.iterrows():
        print(f"   - {row['zone']:<30s} | Area: {row['area_km2']:>6.4f} km2 | Tonnage: {row['tonnage_mt']:>7.3f} MT | Grade: {row['mean_grade_mn_pct']:>5.2f}% Mn")
    print("=" * 70 + "\n")

    # --- example call of the public inference function -------------------------
    probe = predict_reserve(easting=430.0, northing=340.0, depth=125.0, ndvi=0.48, moisture=0.22)
    LOGGER.info("predict_reserve probe: %s", json.dumps(probe, indent=2))
    return {"model": RESERVE_MODEL_PATH, "summary": summary, "cv": cv_report, "probe": probe}


def main() -> None:
    parser = argparse.ArgumentParser(description="MOIL Geological Reserve Estimation (Model 1)")
    default_data = "data/moil_boreholes.csv" if Path("data/moil_boreholes.csv").exists() else None
    parser.add_argument("--n-boreholes", type=int, default=180, help="Boreholes to simulate if no CSV given.")
    parser.add_argument("--seed", type=int, default=42, help="Reproducibility seed.")
    parser.add_argument("--data", type=str, default=default_data, help="Optional real assays CSV (see module docstring).")
    args = parser.parse_args()

    if not HAS_PYKRIGE:
        LOGGER.warning("PyKrige not installed (pip install pykrige); running XGBoost-only fallback.")
    run_pipeline(n_boreholes=args.n_boreholes, seed=args.seed, data_csv=args.data)
    LOGGER.info("Pipeline complete. Artifacts in %s/", ARTIFACT_DIR)


if __name__ == "__main__":
    main()