"""Prescriptive rule engine that converts SHAP drivers into corrective directives."""
from __future__ import annotations

from typing import Callable

from .config import (
    ACTION_BLASTING,
    ACTION_CREW,
    ACTION_EXCAVATOR,
    ACTION_PUMPS,
    ACTION_ZONE_B,
    FEATURE_LABELS,
    FEATURE_ORDER,
    FEATURE_UNITS,
    MAX_ACTIONS,
    MONTH_DAYS,
    PACE_DEFICIT_FACTOR,
    RULE_BLAST_DAYS,
    RULE_DOWNTIME_HRS,
    RULE_LOW_WORKERS,
    RULE_RAIN_MM,
)

Condition = Callable[[dict[str, float]], bool]

RULES: list[tuple[str, str, Condition]] = [
    (
        "equipment_downtime_hrs",
        ACTION_EXCAVATOR,
        lambda inputs: inputs["equipment_downtime_hrs"] > RULE_DOWNTIME_HRS,
    ),
    (
        "rainfall_mm",
        ACTION_PUMPS,
        lambda inputs: inputs["rainfall_mm"] > RULE_RAIN_MM,
    ),
    (
        "blasting_delay_days",
        ACTION_BLASTING,
        lambda inputs: inputs["blasting_delay_days"] >= RULE_BLAST_DAYS,
    ),
    (
        "daily_production",
        ACTION_ZONE_B,
        lambda inputs: inputs["daily_production"] < (inputs["target_tonnes"] / MONTH_DAYS) * PACE_DEFICIT_FACTOR,
    ),
    (
        "workers_present",
        ACTION_CREW,
        lambda inputs: inputs["workers_present"] < RULE_LOW_WORKERS,
    ),
]


def _format_value(feature_key: str, value: float) -> str:
    if abs(value - round(value)) < 0.05:
        number = str(int(round(value)))
    else:
        number = f"{value:.1f}"
    return f"{number} {FEATURE_UNITS[feature_key]}"


def build_main_reason(
    inputs: dict[str, float],
    drivers: list[dict[str, float | str]],
) -> str:
    positive = [d for d in drivers if float(d["impact_pct"]) > 0]
    if not positive:
        return "Operational telemetry within control limits"
    parts = []
    for driver in positive[:2]:
        key = str(driver["feature_key"])
        parts.append(f"{FEATURE_LABELS[key]} ({_format_value(key, float(inputs[key]))})")
    return " + ".join(parts)


def recommend_actions(
    inputs: dict[str, float],
    drivers: list[dict[str, float | str]],
) -> list[str]:
    priority: list[str] = [str(d["feature_key"]) for d in drivers] if drivers else list(FEATURE_ORDER)
    rank = {feature: index for index, feature in enumerate(priority)}
    fired = [
        (rank.get(feature, len(priority)), action)
        for feature, action, condition in RULES
        if condition(inputs)
    ]
    fired.sort(key=lambda pair: pair[0])
    seen: set[str] = set()
    actions: list[str] = []
    for _, action in fired:
        if action not in seen:
            seen.add(action)
            actions.append(action)
        if len(actions) >= MAX_ACTIONS:
            break
    return actions