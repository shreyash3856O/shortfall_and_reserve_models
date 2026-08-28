"""Train the MOIL production-shortfall early-warning model.

Pipeline:
  1. Generate (or load) monthly mine telemetry cycles with shortfall labels.
  2. Stratified train/val/test split.
  3. Fit a cost-sensitive XGBClassifier (scale_pos_weight = normal/shortfall).
  4. Evaluate ROC-AUC, F1, Precision, Recall and Confusion Matrix on holdout.
  5. Fit a SHAP TreeExplainer, pick the F1-optimal decision threshold.
  6. Persist ``shortfall_model.pkl``, ``shap_explainer.pkl`` and JSON metadata.

Optional ``--data data/moil_telemetry_daily.csv`` trains on real daily logs
instead of the built-in synthetic telemetry generator.
"""
from __future__ import annotations

import argparse
import json
import logging
import pickle
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import (
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

from midas.config import (
    EXPLAINER_PATH,
    FEATURE_ORDER,
    LABEL_COLUMN,
    METRICS_PATH,
    META_PATH,
    MODEL_PATH,
)
from midas.data_generator import generate_dataset
from midas.features import engineer_monthly_features
from midas.shap_utils import build_explainer, explain_row, save_explainer

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
LOGGER = logging.getLogger("train")


def acquisition(args: argparse.Namespace) -> pd.DataFrame:
    if args.data and Path(args.data).exists():
        LOGGER.info("Loading real telemetry from %s", args.data)
        daily = pd.read_csv(args.data)
        return engineer_monthly_features(daily)
    LOGGER.info(
        "Generating %s mines x %s years of synthetic operational telemetry (seed=%s)",
        args.mines,
        args.years,
        args.seed,
    )
    daily = generate_dataset(n_mines=args.mines, n_years=args.years, seed=args.seed)
    return engineer_monthly_features(daily)


def fit_model(
    X_train: np.ndarray,
    y_train: np.ndarray,
    seed: int,
) -> tuple[XGBClassifier, float]:
    negatives = int(np.sum(y_train == 0))
    positives = int(np.sum(y_train == 1))
    scale_pos_weight = negatives / max(positives, 1)
    LOGGER.info("Class balance: normal=%d shortfall=%d  ->  scale_pos_weight=%.2f", negatives, positives, scale_pos_weight)
    model = XGBClassifier(
        n_estimators=600,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        scale_pos_weight=scale_pos_weight,
        eval_metric="aucpr",
        random_state=seed,
        tree_method="hist",
    )
    model.fit(X_train, y_train, verbose=False)
    return model, scale_pos_weight


def best_threshold_by_f1(y_val: np.ndarray, proba_val: np.ndarray) -> float:
    candidates = np.linspace(0.05, 0.95, 91)
    scores = [f1_score(y_val, proba_val >= t) for t in candidates]
    return float(candidates[int(np.argmax(scores))])


def evaluate(model: XGBClassifier, X_test: np.ndarray, y_test: np.ndarray, threshold: float) -> dict:
    proba = model.predict_proba(X_test)[:, 1]
    preds = (proba >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
    accuracy = float((tp + tn) / len(y_test))
    return {
        "accuracy": round(accuracy, 4),
        "roc_auc": round(roc_auc_score(y_test, proba), 4),
        "f1": round(f1_score(y_test, preds), 4),
        "precision": round(precision_score(y_test, preds), 4),
        "recall": round(recall_score(y_test, preds), 4),
        "decision_threshold": round(threshold, 3),
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "test_rows": int(len(y_test)),
    }


def persist(model: XGBClassifier, explainer, meta: dict, out_dir: Path) -> None:
    model_path = out_dir / MODEL_PATH.name
    explainer_path = out_dir / EXPLAINER_PATH.name
    with model_path.open("wb") as fh:
        pickle.dump(model, fh)
    save_explainer(explainer, explainer_path)
    (out_dir / META_PATH.name).write_text(json.dumps(meta, indent=2), encoding="utf-8")
    LOGGER.info("Artifacts persisted -> %s, %s, %s", model_path, explainer_path, out_dir / META_PATH.name)


def demo_prediction(model: XGBClassifier, explainer, frame: pd.DataFrame) -> None:
    X = frame[FEATURE_ORDER].astype(np.float64).to_numpy()
    proba = model.predict_proba(X)[:, 1]
    frame = frame.copy()
    frame["_proba"] = proba
    candidates = frame[(frame[LABEL_COLUMN] == 1) & (frame["_proba"] > 0.60)]
    risks = candidates.sort_values("_proba", ascending=False).head(2)
    LOGGER.info("--- SHAP root-cause demo (high-risk shortfall months) ---")
    for _, row in risks.iterrows():
        inputs = {k: float(row[k]) for k in FEATURE_ORDER}
        decomposed = explain_row(model, explainer, inputs)
        print(json.dumps({"inputs": inputs, **decomposed}, indent=2))
        print("---")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train MOIL production-shortfall early-warning model")
    default_data = "data/moil_telemetry_daily.csv" if Path("data/moil_telemetry_daily.csv").exists() else None
    parser.add_argument("--data", type=str, default=default_data, help="Path to a real daily-telemetry CSV (optional).")
    parser.add_argument("--mines", type=int, default=60, help="Number of synthetic mines to simulate.")
    parser.add_argument("--years", type=int, default=2, help="Operational years per synthetic mine.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility.")
    parser.add_argument("--out-dir", type=str, default="artifacts", help="Directory for persisted artifacts.")
    args = parser.parse_args()

    t0 = time.time()
    frame = acquisition(args)
    positives = int(frame[LABEL_COLUMN].sum())
    LOGGER.info("Dataset: %d mine-months, shortfall rate = %.2f%%", len(frame), 100.0 * positives / len(frame))

    X = frame[FEATURE_ORDER].astype(np.float64).to_numpy()
    y = frame[LABEL_COLUMN].to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=args.seed)
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.15, stratify=y_train, random_state=args.seed)

    model, scale_pos_weight = fit_model(X_train, y_train, args.seed)
    threshold = best_threshold_by_f1(y_val, model.predict_proba(X_val)[:, 1])
    metrics = evaluate(model, X_test, y_test, threshold)

    LOGGER.info(
        "Holdout metrics | ROC-AUC=%.4f | F1=%.4f | Precision=%.4f | Recall=%.4f | threshold=%.3f",
        metrics["roc_auc"],
        metrics["f1"],
        metrics["precision"],
        metrics["recall"],
        metrics["decision_threshold"],
    )
    LOGGER.info("Confusion matrix: %s", metrics["confusion_matrix"])

    explainer = build_explainer(model)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    meta = {
        "model_type": "xgboost.XGBClassifier",
        "objective": "binary:logistic",
        "feature_order": FEATURE_ORDER,
        "n_features": len(FEATURE_ORDER),
        "scale_pos_weight": round(scale_pos_weight, 4),
        "decision_threshold": metrics["decision_threshold"],
        "class_distribution": {"normal": int(np.sum(y == 0)), "shortfall": int(np.sum(y == 1))},
        "shortfall_rate_pct": round(100.0 * positives / len(frame), 2),
        "rows": int(len(frame)),
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "seed": args.seed,
    }
    persist(model, explainer, meta, out_dir)
    (out_dir / METRICS_PATH.name).write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    demo_prediction(model, explainer, frame)
    LOGGER.info("Training completed in %.1fs", time.time() - t0)


if __name__ == "__main__":
    main()