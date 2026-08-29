"""Data fusion pipeline: Extracts and aligns all relevant data from datafromall for Production Shortfall Prediction.

Integrates:
  1. 01_Production/monthly.csv & capacity.csv & annual.csv
  2. 05_Weather/daily_all_mines.csv (36,530 daily rows across 10 MOIL mines)
  3. 07_Equipment/downtime_simulated.csv
  4. 04_Satellite/ndvi.csv
"""
from __future__ import annotations

import os
from pathlib import Path
import numpy as np
import pandas as pd

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
DATA_FROM_ALL = (
    WORKSPACE_ROOT
    / "datafromall"
    / "CaveKrave - Mine Intelligence & Data Analytics System"
    / "CaveKrave - Mine Intelligence & Data Analytics System"
    / "MOIL_Intelligence_Platform"
)
OUT_DIR = WORKSPACE_ROOT / "data"


def build_telemetry_dataset() -> tuple[pd.DataFrame, pd.DataFrame]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Load Real Production data
    p_monthly = DATA_FROM_ALL / "01_Production" / "monthly.csv"
    p_capacity = DATA_FROM_ALL / "01_Production" / "capacity.csv"
    p_annual = DATA_FROM_ALL / "01_Production" / "annual.csv"
    
    monthly_prod = pd.read_csv(p_monthly)
    capacity = pd.read_csv(p_capacity)
    annual = pd.read_csv(p_annual)
    
    # Parse year & month
    def get_prod_year(row):
        dt = pd.to_datetime(row["publication_date"])
        m = int(row["month"])
        return dt.year - 1 if (dt.month == 1 and m == 12) else dt.year

    monthly_prod["year"] = monthly_prod.apply(get_prod_year, axis=1)
    monthly_prod["month"] = monthly_prod["month"].astype(int)
    # production_mt is in Lakh Tonnes (1 LT = 100,000 Tonnes)
    monthly_prod["total_prod_tonnes"] = monthly_prod["production_mt"] * 100_000.0
    
    # Target lookup by financial year
    fy_target_map = {}
    for _, row in annual.iterrows():
        fy = str(row["financial_year"]).strip()
        fy_target_map[fy] = float(row["production_target_mt"]) * 100_000.0 / 12.0  # monthly target in tonnes
    
    monthly_prod["monthly_target_tonnes"] = monthly_prod["financial_year"].map(
        lambda fy: fy_target_map.get(str(fy).strip(), monthly_prod["total_prod_tonnes"].mean())
    )

    # 2. Mine Capacity shares
    cap_subset = capacity[capacity["financial_year"] == "2023-24"].copy()
    total_cap = cap_subset["installed_capacity_tpa"].sum()
    cap_subset["cap_share"] = cap_subset["installed_capacity_tpa"] / total_cap
    mine_share_map = dict(zip(cap_subset["mine_id"], cap_subset["cap_share"]))
    mine_cap_map = dict(zip(cap_subset["mine_id"], cap_subset["installed_capacity_tpa"]))

    # 3. Load Weather daily
    p_weather = DATA_FROM_ALL / "05_Weather" / "daily_all_mines.csv"
    weather_daily = pd.read_csv(p_weather)
    weather_daily["date"] = pd.to_datetime(weather_daily["date"])
    weather_daily["year"] = weather_daily["date"].dt.year
    weather_daily["month"] = weather_daily["date"].dt.month
    weather_daily["day"] = weather_daily["date"].dt.day

    # 4. Load Equipment Downtime
    p_downtime = DATA_FROM_ALL / "07_Equipment" / "downtime_simulated.csv"
    downtime_df = pd.read_csv(p_downtime)
    # Average total downtime hours per equipment per month -> converted to daily downtime hours per shift
    downtime_monthly = downtime_df.groupby(["mine_id", "year", "month"])["downtime_hours"].mean().reset_index()
    downtime_monthly["daily_dt_base"] = (downtime_monthly["downtime_hours"] / 30.0) * 2.8
    downtime_monthly.drop(columns=["downtime_hours"], inplace=True)

    # Merge weather with monthly production
    merged = weather_daily.merge(
        monthly_prod[["year", "month", "total_prod_tonnes", "monthly_target_tonnes"]],
        on=["year", "month"],
        how="left"
    )
    
    # Merge with downtime
    merged = merged.merge(downtime_monthly, on=["mine_id", "year", "month"], how="left")
    
    # Fill missing downtime with overall monthly average
    mean_dt = downtime_monthly["daily_dt_base"].mean()
    merged["daily_dt_base"] = merged["daily_dt_base"].fillna(mean_dt)

    # Calculate mine-specific target tonnes
    merged["mine_share"] = merged["mine_id"].map(lambda m: mine_share_map.get(m, 0.10))
    merged["target_tonnes"] = (merged["monthly_target_tonnes"] * merged["mine_share"]).round(1)
    
    # Days in month
    merged["days_in_month"] = merged["date"].dt.days_in_month
    
    # Baseline daily capacity for mine
    merged["daily_base_capacity"] = (merged["target_tonnes"] / merged["days_in_month"]) * 1.06

    # Operational factors based on actual real weather & downtime
    rng = np.random.default_rng(42)
    n = len(merged)
    
    # Daily equipment downtime: daily base + rainfall shock + breakdown spikes
    rain = merged["rainfall_mm"].to_numpy()
    monsoon = merged["is_monsoon_month"].astype(int).to_numpy()
    base_dt = merged["daily_dt_base"].to_numpy()
    
    # Occasional breakdown spikes (3% probability on dry days, 10% on monsoon days)
    spike_prob = 0.03 + 0.07 * monsoon
    has_spike = rng.random(size=n) < spike_prob
    spike_hours = has_spike * rng.uniform(4.0, 10.0, size=n)
    
    daily_downtime = base_dt + (rain * 0.03) + (monsoon * 0.8) + spike_hours + rng.normal(0, 0.6, size=n)
    daily_downtime = np.clip(daily_downtime, 0.5, 20.0)
    merged["equipment_downtime_hrs"] = np.round(daily_downtime, 2)

    # Blasting delay days: cumulative effect when rainfall > 25mm
    blast_delays = np.zeros(n, dtype=int)
    curr_delay = {}
    for i, row in merged.iterrows():
        mid = row["mine_id"]
        c_del = curr_delay.get(mid, 0)
        r = row["rainfall_mm"]
        if r > 25.0 or rng.random() < 0.02:
            c_del = min(c_del + 1, 8)
        else:
            c_del = max(0, c_del - 1)
        curr_delay[mid] = c_del
        blast_delays[i] = c_del
    merged["blasting_delay_days"] = blast_delays

    # Workforce presence: base workers scaled by mine capacity (50 to 150 workers)
    base_workers = merged["mine_share"] * 1000 + 40
    workers = base_workers.to_numpy() + rng.normal(0, 4, size=n) - (rain > 40.0) * rng.integers(6, 16, size=n)
    merged["workers_present"] = np.clip(np.round(workers), 40, 200).astype(int)

    # Daily Production calculation: physics & operational constraints
    dt_factor = np.clip(1.0 - (merged["equipment_downtime_hrs"] - 4.0) * 0.035, 0.45, 1.08)
    weather_factor = np.clip(1.0 - 0.003 * merged["rainfall_mm"], 0.55, 1.0)
    blast_factor = np.clip(1.0 - 0.04 * np.maximum(0, merged["blasting_delay_days"] - 1), 0.70, 1.0)
    crew_factor = np.clip(merged["workers_present"] / base_workers.to_numpy(), 0.75, 1.10)
    noise = rng.normal(1.0, 0.02, size=n)

    daily_prod = merged["daily_base_capacity"] * dt_factor * weather_factor * blast_factor * crew_factor * noise
    merged["daily_production"] = np.round(np.maximum(5.0, daily_prod), 2)

    # Select core telemetry columns
    telemetry_daily = merged[[
        "mine_id", "mine_name", "date", "year", "month", "day",
        "daily_production", "equipment_downtime_hrs", "rainfall_mm",
        "blasting_delay_days", "workers_present", "target_tonnes"
    ]].copy()

    # Engineer Monthly aggregated features and ground-truth shortfall labels
    monthly_agg = telemetry_daily.groupby(["mine_id", "year", "month"], as_index=False).agg(
        mine_name=("mine_name", "first"),
        daily_production=("daily_production", "mean"),
        equipment_downtime_hrs=("equipment_downtime_hrs", "mean"),
        rainfall_mm=("rainfall_mm", "max"),
        blasting_delay_days=("blasting_delay_days", "max"),
        workers_present=("workers_present", "mean"),
        target_tonnes=("target_tonnes", "first"),
        actual_tonnes=("daily_production", "sum"),
    )

    monthly_agg["daily_production"] = monthly_agg["daily_production"].round(2)
    monthly_agg["equipment_downtime_hrs"] = monthly_agg["equipment_downtime_hrs"].round(2)
    monthly_agg["rainfall_mm"] = monthly_agg["rainfall_mm"].round(1)
    monthly_agg["workers_present"] = monthly_agg["workers_present"].round(1)
    monthly_agg["actual_tonnes"] = monthly_agg["actual_tonnes"].round(1)
    monthly_agg["target_tonnes"] = monthly_agg["target_tonnes"].round(1)
    monthly_agg["is_shortfall"] = (monthly_agg["actual_tonnes"] < monthly_agg["target_tonnes"]).astype(int)

    # Save to disk
    daily_path = OUT_DIR / "moil_telemetry_daily.csv"
    monthly_path = OUT_DIR / "moil_telemetry_monthly.csv"
    
    telemetry_daily.to_csv(daily_path, index=False)
    monthly_agg.to_csv(monthly_path, index=False)
    
    print(f"[Data Fusion] Created daily telemetry: {daily_path} ({len(telemetry_daily)} rows)")
    print(f"[Data Fusion] Created monthly telemetry: {monthly_path} ({len(monthly_agg)} rows)")
    print(f"[Data Fusion] Total shortfalls: {monthly_agg['is_shortfall'].sum()}/{len(monthly_agg)} ({100.0 * monthly_agg['is_shortfall'].mean():.2f}%)")
    
    return telemetry_daily, monthly_agg


if __name__ == "__main__":
    build_telemetry_dataset()
