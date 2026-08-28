"""Monthly aggregation & labelling of mine telemetry for shortfall prediction."""
from __future__ import annotations

import pandas as pd

from .config import LABEL_COLUMN

AGG_DICT = {
    "daily_production": ("daily_production", "mean"),
    "equipment_downtime_hrs": ("equipment_downtime_hrs", "mean"),
    "rainfall_mm": ("rainfall_mm", "max"),
    "blasting_delay_days": ("blasting_delay_days", "max"),
    "target_tonnes": ("target_tonnes", "first"),
    "workers_present": ("workers_present", "mean"),
    "actual_tonnes": ("daily_production", "sum"),
}


def engineer_monthly_features(daily: pd.DataFrame) -> pd.DataFrame:
    monthly = daily.groupby(["mine_id", "year", "month"], as_index=False).agg(**AGG_DICT)
    monthly["rainfall_mm"] = monthly["rainfall_mm"].round(1)
    monthly["daily_production"] = monthly["daily_production"].round(2)
    monthly["equipment_downtime_hrs"] = monthly["equipment_downtime_hrs"].round(2)
    monthly["workers_present"] = monthly["workers_present"].round(1)
    monthly["blasting_delay_days"] = monthly["blasting_delay_days"].astype(int)
    monthly[LABEL_COLUMN] = (monthly["actual_tonnes"] < monthly["target_tonnes"]).astype(int)
    return monthly