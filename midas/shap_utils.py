"""SHAP decomposition utilities.

Converts the raw margin (log-odds) contributions from ``shap.TreeExplainer``
into an additive, probability-space \"impact pct\" decomposition so that the
top-3 root-cause drivers read as e.g. \"Equipment Downtime: +41% risk\".
"""
from __future__ import annotations

import logging
import pickle
from pathlib import Path
from typing import Any

import numpy as np
import shap

from .config import FEATURE_LABELS, FEATURE_ORDER, TOP_N_DRIVERS

LOGGER = logging.getLogger("CaveKrave.shap")


def sigmoid(value: float) -> float:
    return float(1.0 / (1.0 + np.exp(-value)))


class ExplainerHandle:
    def __init__(
        self,
        explainer: Any,
        feature_names: list[str],
        booster: Any = None,
    ) -> None:
        self._explainer = explainer
        self._booster = booster or getattr(explainer, "model", None)
        self.feature_names = list(feature_names)
        expected = np.asarray(explainer.expected_value).ravel()
        self.base_value = float(expected[0]) if expected.size else 0.0

    def shap_values(self, X: np.ndarray) -> np.ndarray:
        return np.asarray(self._explainer.shap_values(X), dtype=np.float64)


def build_explainer(model: Any) -> ExplainerHandle:
    explainer = shap.TreeExplainer(model)
    return ExplainerHandle(explainer, FEATURE_ORDER)


def save_explainer(handle: ExplainerHandle, path: Path) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as fh:
        pickle.dump(handle._explainer, fh)
    LOGGER.info("SHAP explainer saved to %s", path)
    return path


def load_explainer(path: Path) -> ExplainerHandle:
    path = Path(path)
    with path.open("rb") as fh:
        loaded = pickle.load(fh)
    if isinstance(loaded, ExplainerHandle):
        return loaded
    if hasattr(loaded, "shap_values"):
        return ExplainerHandle(loaded, FEATURE_ORDER)
    explainer = shap.TreeExplainer(loaded["booster"])
    return ExplainerHandle(explainer, loaded["feature_names"])


def _as_row(row: dict[str, float] | np.ndarray) -> np.ndarray:
    if isinstance(row, np.ndarray):
        return np.asarray(row, dtype=np.float64).reshape(1, -1)
    return np.asarray([row[feature] for feature in FEATURE_ORDER], dtype=np.float64).reshape(1, -1)


def decompose_probability(
    model: Any,
    handle: ExplainerHandle,
    row: dict[str, float] | np.ndarray,
) -> tuple[float, float, np.ndarray, np.ndarray]:
    X = _as_row(row)
    proba = float(model.predict_proba(X)[0, 1])
    phi = handle.shap_values(X)[0]
    if np.allclose(phi.sum(), 0.0, atol=1e-12):
        impacts = np.zeros_like(phi)
    else:
        logit = handle.base_value + phi.sum()
        proba_logit = sigmoid(logit)
        base_prob = sigmoid(handle.base_value)
        impact_budget = proba_logit - base_prob
        impacts = impact_budget * (phi / phi.sum())
    return proba, handle.base_value, phi, impacts


def top_drivers(
    row: dict[str, float],
    impacts: np.ndarray,
) -> list[dict[str, float | str]]:
    ranked = sorted(
        zip(FEATURE_ORDER, impacts),
        key=lambda pair: abs(float(pair[1])),
        reverse=True,
    )
    drivers = [
        {
            "feature": FEATURE_LABELS[feature],
            "feature_key": feature,
            "impact_pct": round(float(impact) * 100.0, 1),
        }
        for feature, impact in ranked[:TOP_N_DRIVERS]
    ]
    return drivers


def explain_row(model: Any, handle: ExplainerHandle, row: dict[str, float]) -> dict[str, Any]:
    proba, base, phi, impacts = decompose_probability(model, handle, row)
    drivers = top_drivers(row, impacts)
    return {
        "probability": round(proba * 100.0, 1),
        "base_probability": round(sigmoid(base) * 100.0, 1),
        "drivers": drivers,
    }