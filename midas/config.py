"""Central configuration for the MOIL production-shortfall MLOps pipeline."""
from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = BASE_DIR / "artifacts"
DATA_DIR = BASE_DIR / "data"

MODEL_PATH = ARTIFACT_DIR / "shortfall_model.pkl"
EXPLAINER_PATH = ARTIFACT_DIR / "shap_explainer.pkl"
META_PATH = ARTIFACT_DIR / "model_meta.json"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"

FEATURE_ORDER = [
    "daily_production",
    "equipment_downtime_hrs",
    "rainfall_mm",
    "blasting_delay_days",
    "target_tonnes",
    "workers_present",
]

FEATURE_LABELS = {
    "daily_production": "Daily Production",
    "equipment_downtime_hrs": "Equipment Downtime",
    "rainfall_mm": "Monsoon Rainfall",
    "blasting_delay_days": "Blasting Delay",
    "target_tonnes": "Target Tonnage",
    "workers_present": "Workforce Attendance",
}

FEATURE_UNITS = {
    "daily_production": "T/day",
    "equipment_downtime_hrs": "h",
    "rainfall_mm": "mm",
    "blasting_delay_days": "days",
    "target_tonnes": "T",
    "workers_present": "workers",
}

LABEL_COLUMN = "is_shortfall"
MONTH_DAYS = 30

RULE_DOWNTIME_HRS = 8.0
RULE_RAIN_MM = 50.0
RULE_BLAST_DAYS = 1
RULE_LOW_WORKERS = 80
PACE_DEFICIT_FACTOR = 0.95

RISK_HIGH = 0.75
RISK_MEDIUM = 0.50
TOP_N_DRIVERS = 3
MAX_ACTIONS = 4

ACTION_EXCAVATOR = "Deploy backup excavator Komatsu PC1250 to Block B"
ACTION_PUMPS = "Advance blasting before rain front & activate pit pump battery #2"
ACTION_BLASTING = "Reschedule blasting to first dry window"
ACTION_ZONE_B = "Prioritize high-grade extraction at Zone B (38.6% Mn)"
ACTION_CREW = "Deploy relief crew & overtime roster to restore shift headcount"