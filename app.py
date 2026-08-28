"""MOIL Production Shortfall Early-Warning API.

FastAPI backend that loads ``shortfall_model.pkl`` and ``shap_explainer.pkl``
once into RAM, then serves per-shift shortfall probability predictions with
explainable SHAP root-cause drivers and prescriptive corrective actions.

Run:  uvicorn app:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import json
import pickle
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from midas import __version__
from midas.config import (
    EXPLAINER_PATH,
    FEATURE_ORDER,
    METRICS_PATH,
    META_PATH,
    MODEL_PATH,
    RISK_HIGH,
    RISK_MEDIUM,
)
from midas.rules import build_main_reason, recommend_actions
from midas.schemas import HealthResponse, MineInput, PredictionResponse, ShapFeature
from midas.shap_utils import load_explainer, top_drivers, decompose_probability


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = None
    app.state.explainer = None
    app.state.meta = None
    for resource in (MODEL_PATH, EXPLAINER_PATH, META_PATH):
        if not Path(resource).exists():
            raise RuntimeError(f"Missing artifact {resource}. Run `python train_model.py` first.")
    with MODEL_PATH.open("rb") as fh:
        app.state.model = pickle.load(fh)
    app.state.explainer = load_explainer(EXPLAINER_PATH)
    app.state.meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    yield


app = FastAPI(
    title="MOIL Production Shortfall Early-Warning API",
    description=(
        "Autonomous operational early-warning for manganese ore mines. "
        "Predicts whether the active month will miss its production mandate "
        "(YES/NO), returns the exact shortfall probability and decomposes "
        "root causes with SHAP values."
    ),
    version=__version__,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _risk_level(probability: float) -> str:
    if probability >= RISK_HIGH:
        return "HIGH"
    if probability >= RISK_MEDIUM:
        return "MEDIUM"
    return "LOW"


def _predict(payload: MineInput) -> PredictionResponse:
    model = app.state.model
    handle = app.state.explainer
    meta = app.state.meta
    inputs = {key: getattr(payload, key) for key in FEATURE_ORDER}
    row_vector = np.asarray([inputs[key] for key in FEATURE_ORDER], dtype=np.float64).reshape(1, -1)
    proba = float(model.predict_proba(row_vector)[0, 1])
    _, _, _, impacts = decompose_probability(model, handle, inputs)
    drivers = top_drivers(inputs, impacts)
    threshold = float(meta.get("decision_threshold", 0.5))
    probability_pct = round(proba * 100.0, 1)
    breakdown = [
        ShapFeature(feature=str(driver["feature"]), impact_pct=float(driver["impact_pct"]))
        for driver in drivers
    ]
    return PredictionResponse(
        shortfall_probability=probability_pct,
        risk_level=_risk_level(proba),
        main_reason=build_main_reason(inputs, drivers),
        is_shortfall_likely=bool(proba >= threshold),
        shap_breakdown=breakdown,
        recommended_actions=recommend_actions(inputs, drivers),
    )


@app.get("/", tags=["meta"])
async def root() -> dict:
    return {
        "service": "MOIL production-shortfall early-warning",
        "version": __version__,
        "endpoints": ["GET /health", "POST /predict-shortfall"],
        "docs": "/docs",
        "model": app.state.meta.get("model_type"),
        "decision_threshold": app.state.meta.get("decision_threshold"),
    }


@app.get("/health", response_model=HealthResponse, tags=["meta"])
async def health() -> HealthResponse:
    model_ready = getattr(app.state, "model", None) is not None
    explainer_ready = getattr(app.state, "explainer", None) is not None
    return HealthResponse(status="ok", model_loaded=model_ready, explainer_loaded=explainer_ready)


@app.post("/predict-shortfall", response_model=PredictionResponse, tags=["inference"])
async def predict_shortfall(payload: MineInput) -> PredictionResponse:
    if getattr(app.state, "model", None) is None:
        raise HTTPException(status_code=503, detail="Model not loaded; retry once the lifespan has completed.")
    try:
        return _predict(payload)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Inference failure: {exc}") from exc