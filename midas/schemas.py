"""Pydantic request & response schemas for the shortfall prediction API."""
from __future__ import annotations

from pydantic import BaseModel, Field, field_validator


class MineInput(BaseModel):
    daily_production: float = Field(
        ...,
        gt=0.0,
        description="Tonnes of manganese ore extracted per day (e.g. 3200.0 T/day).",
    )
    equipment_downtime_hrs: float = Field(
        ...,
        ge=0.0,
        le=24.0,
        description="Machine breakdown hours per day across excavators, haul trucks and conveyors.",
    )
    rainfall_mm: float = Field(
        ...,
        ge=0.0,
        description="Daily precipitation / monsoon weather telemetry.",
    )
    blasting_delay_days: int = Field(
        ...,
        description="Consecutive days bench blasting has been stalled.",
    )
    target_tonnes: float = Field(
        ...,
        gt=0.0,
        description="Monthly production quota in tonnes.",
    )
    workers_present: int = Field(
        ...,
        gt=0,
        description="Attendance headcount on shift.",
    )

    @field_validator("blasting_delay_days", "workers_present")
    @classmethod
    def coerce_integer(cls, value: float) -> int:
        return int(value)


class ShapFeature(BaseModel):
    feature: str = Field(..., description="Human-readable root-cause driver name.")
    impact_pct: float = Field(..., description="Signed contribution to shortfall probability in percentage points.")


class PredictionResponse(BaseModel):
    shortfall_probability: float = Field(..., description="Probability (0.0-100.0) that this month misses the production mandate.")
    risk_level: str = Field(..., description="LOW / MEDIUM / HIGH operational risk band.")
    main_reason: str = Field(..., description="Plain-English explanation of the dominant root cause combination.")
    is_shortfall_likely: bool = Field(..., description="True when probability >= decision threshold.")
    shap_breakdown: list[ShapFeature] = Field(..., description="Top-3 SHAP root-cause drivers, ranked by absolute impact.")
    recommended_actions: list[str] = Field(..., description="Prescriptive corrective directives from the rule engine.")


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    explainer_loaded: bool