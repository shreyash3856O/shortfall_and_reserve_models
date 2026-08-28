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
    shortfall_model_loaded: bool
    reserve_model_loaded: bool
    shap_explainer_loaded: bool
    api_version: str


class ReservePredictInput(BaseModel):
    easting: float = Field(..., ge=0.0, le=1500.0, description="Easting coordinate in metres (0-1200m).")
    northing: float = Field(..., ge=0.0, le=1000.0, description="Northing coordinate in metres (0-800m).")
    depth_m: float = Field(120.0, ge=10.0, le=500.0, description="Drill / intersection depth in metres.")
    ndvi: float = Field(0.48, ge=0.0, le=1.0, description="Sentinel-2 NDVI vegetation index.")
    moisture: float = Field(0.22, ge=0.0, le=1.0, description="Sentinel-2 NDMI moisture index.")
    lst: float | None = Field(None, ge=15.0, le=50.0, description="Land surface temperature in Celsius (optional).")


class ReservePredictResponse(BaseModel):
    easting: float
    northing: float
    depth_m: float
    grade_pct: float
    grade_ci_lower: float
    grade_ci_upper: float
    thickness_m: float
    tonnage_mt_per_100m_block: float
    zone: str


class ReserveSummaryItem(BaseModel):
    zone: str
    zone_id: int
    grid_cells: int
    area_km2: float
    tonnage_mt: float
    mean_grade_mn_pct: float
    mean_thickness_m: float


class ReserveGridBlock(BaseModel):
    easting: float
    northing: float
    depth_m: float
    ndvi_grid: float
    ndmi_grid: float
    lst_grid: float
    grade_pct: float
    thickness_m: float
    grade_kriging_var: float
    tonnage_mt: float
    zone_id: int


class ReserveGridResponse(BaseModel):
    total_blocks: int
    page: int
    limit: int
    blocks: list[ReserveGridBlock]


class MineRiskSummary(BaseModel):
    mine_id: str
    mine_name: str
    shortfall_probability: float
    risk_level: str
    is_shortfall_likely: bool
    mtd_actual_tonnes: float
    target_tonnes: float
    daily_avg_tonnes: float
    equipment_downtime_hrs: float
    rainfall_mm: float
    blasting_delay_days: int
    workers_present: int
    main_reason: str
    top_actions: list[str]


class MineHistoryRecord(BaseModel):
    year: int
    month: int
    date: str
    actual_tonnes: float
    target_tonnes: float
    achievement_pct: float
    is_shortfall: int
    shortfall_probability: float


class PrescriptiveActionItem(BaseModel):
    rank: int
    mine_id: str
    mine_name: str
    action: str
    trigger_driver: str
    trigger_value: str
    priority: str
    expected_impact: str


class DataHealthItem(BaseModel):
    feed_name: str
    source_origin: str
    record_count: int
    last_sync: str
    status: str
    cadence: str


class DataHealthResponse(BaseModel):
    overall_status: str
    system_time_utc: str
    sources: list[DataHealthItem]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = Field("en", description="Language code: 'en' (English), 'hi' (Hindi), 'mr' (Marathi).")
    history: list[ChatMessage] | None = None


class ChatResponse(BaseModel):
    reply: str
    language: str
    sources_used: list[str]
    suggested_queries: list[str]