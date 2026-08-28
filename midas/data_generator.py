"""Synthetic MOIL-style manganese mine telemetry generator.

Simulates daily operational logs (production, equipment downtime, rainfall,
blasting stalls and workforce attendance) over multiple mines and operational
years, with monsoon seasonality, correlated breakdown cascades and blasting
face closures. Each calendar month is later labelled as a shortfall cycle.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from .config import MONTH_DAYS

MONSOON_MONTHS = (6, 7, 8, 9)


def _sample_rainfall(rng: np.random.Generator, monsoon: bool) -> float:
    if not monsoon:
        return round(float(rng.uniform(0.0, 8.0)), 1) if rng.random() < 0.12 else 0.0
    if rng.random() < 0.20:
        storm = float(np.clip(rng.gamma(2.2, 45.0), 0.0, 160.0))
        return round(storm, 1)
    normal = float(np.clip(rng.gamma(1.6, 20.0), 0.0, 120.0))
    return round(normal, 1)


def _sample_downtime(
    rng: np.random.Generator,
    rainfall: float,
    prev_downtime: float,
    breakdown_left: int,
    base_downtime: float,
    monsoon: bool,
) -> tuple[float, int]:
    wet = rainfall > 25.0
    rain_shift = 0.010 * rainfall
    if breakdown_left > 0:
        hours = rng.uniform(9.0, 15.0) + rain_shift
        breakdown_left -= 1
    else:
        failure_prob = 0.030 + (0.018 if wet else 0.0) + (0.008 if monsoon else 0.0)
        if rng.random() < failure_prob:
            breakdown_left = int(rng.integers(2, 5))
            hours = rng.uniform(9.0, 15.0) + rain_shift
        else:
            hours = rng.normal(base_downtime + rain_shift, 2.0) + 0.20 * (prev_downtime - base_downtime)
    return float(np.clip(hours, 0.5, 22.0)), breakdown_left


def _sample_blasting_delay(rng: np.random.Generator, rainfall: float, delay_days: int) -> int:
    if rainfall > 25.0 or rng.random() < 0.05:
        return min(delay_days + 1, 12)
    return max(0, delay_days - 1)


def _sample_workers(
    rng: np.random.Generator,
    base_workers: int,
    rainfall: float,
    delay_days: int,
) -> float:
    crew = rng.normal(base_workers, 10.0)
    if rainfall > 50.0:
        crew -= float(rng.integers(6, 22))
    if delay_days >= 3:
        crew -= float(rng.integers(0, 8))
    return float(np.clip(round(crew), 60, 140))


def _sample_production(
    rng: np.random.Generator,
    capacity_rate: float,
    downtime: float,
    rainfall: float,
    delay_days: int,
    workers: float,
    base_workers: int,
) -> float:
    utilization = float(np.clip(1.0 - downtime / 18.0, 0.30, 1.0))
    weather_factor = float(np.clip(1.0 - 0.0035 * rainfall, 0.60, 1.0))
    blast_factor = float(np.clip(1.0 - 0.045 * max(0.0, delay_days - 1), 0.72, 1.0))
    crew_factor = float(np.clip(workers / base_workers, 0.65, 1.12))
    noise = float(rng.normal(1.0, 0.05))
    return float(capacity_rate * utilization * weather_factor * blast_factor * crew_factor * noise)


def simulate_mine_days(
    mine_id: str,
    n_years: int = 2,
    seed: int = 0,
    base_workers: int = 115,
    target_range: tuple[int, int] = (95_000, 110_000),
    cap_factor: float = 2.70,
    base_downtime: float = 6.0,
) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows: list[dict] = []
    prev_downtime = base_downtime
    breakdown_left = 0
    delay_days = 0
    for year in range(1, n_years + 1):
        for month in range(1, 13):
            monsoon = month in MONSOON_MONTHS
            target_tonnes = float(rng.integers(*target_range))
            capacity_rate = cap_factor * target_tonnes / MONTH_DAYS
            for day in range(1, MONTH_DAYS + 1):
                rainfall = _sample_rainfall(rng, monsoon)
                downtime, breakdown_left = _sample_downtime(
                    rng, rainfall, prev_downtime, breakdown_left, base_downtime, monsoon
                )
                delay_days = _sample_blasting_delay(rng, rainfall, delay_days)
                workers = _sample_workers(rng, base_workers, rainfall, delay_days)
                daily_production = _sample_production(
                    rng, capacity_rate, downtime, rainfall, delay_days, workers, base_workers
                )
                rows.append(
                    {
                        "mine_id": mine_id,
                        "year": year,
                        "month": month,
                        "day": day,
                        "daily_production": round(daily_production, 2),
                        "equipment_downtime_hrs": round(downtime, 2),
                        "rainfall_mm": rainfall,
                        "blasting_delay_days": delay_days,
                        "workers_present": int(workers),
                        "target_tonnes": target_tonnes,
                    }
                )
                prev_downtime = downtime
    return pd.DataFrame(rows)


def generate_dataset(
    n_mines: int = 40,
    n_years: int = 2,
    seed: int = 42,
    cap_factor: float = 2.70,
) -> pd.DataFrame:
    frames = [
        simulate_mine_days(
            mine_id=f"MOIL-{i:02d}",
            n_years=n_years,
            seed=seed + i,
            cap_factor=cap_factor,
        )
        for i in range(n_mines)
    ]
    return pd.concat(frames, ignore_index=True)