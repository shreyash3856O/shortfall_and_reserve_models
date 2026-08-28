# MIDAS — Mine Intelligence & Data Analytics System
## MOIL Machine Learning Core

MIDAS hosts the two core production-grade machine learning models calibrated for MOIL (Manganese Ore India Limited) manganese mining operations:

1. **Model 1: Geological Reserve Estimation & Block Modelling** (`reserve_model.py`)
2. **Model 2: Production Shortfall Early-Warning & Root-Cause System** (`train_model.py` / `app.py`)

---

## 1. Project Structure

```
MIDAS/
├── artifacts/                           # Persisted model bundles, metrics & maps
│   ├── shortfall_model.pkl              # Model 2: Trained XGBoost Shortfall Classifier
│   ├── shap_explainer.pkl               # Model 2: SHAP TreeExplainer artifact
│   ├── metrics.json                     # Model 2: Holdout validation metrics
│   ├── model_meta.json                  # Model 2: Metadata & optimal decision threshold
│   ├── reserve_model.pkl                # Model 1: Hybrid XGBoost + Kriging model bundle
│   ├── reserve_grid.csv                 # Model 1: 100x100 spatial block predictions
│   ├── reserve_summary.json             # Model 1: Reserve tonnage & grade by zone
│   ├── variogram_params.json            # Model 1: Fitted spherical variograms
│   ├── reserve_zone_map.png             # Model 1: 2D Classified reserve zone map
│   └── reserve_grade_surface_3d.png     # Model 1: 3D Ore grade surface visualization
│
├── data/                                # Fused & standardized MOIL datasets
│   ├── moil_boreholes.csv               # Exploration drill core assays & satellite indices
│   ├── moil_telemetry_daily.csv         # 36,530 daily mine telemetry observations (10 mines)
│   └── moil_telemetry_monthly.csv       # 1,200 monthly aggregated mine operational cycles
│
├── midas/                               # Core Python package & feature engineering modules
│   ├── config.py                        # Paths, feature orders, units & thresholds
│   ├── features.py                      # Monthly operational feature aggregation
│   ├── rules.py                         # Prescriptive corrective action rules
│   ├── schemas.py                       # Pydantic input/output schemas
│   └── shap_utils.py                    # SHAP decomposition & driver attribution
│
├── app.py                               # FastAPI inference microservice for Model 2
├── reserve_model.py                     # Training & spatial block CV for Model 1
├── train_model.py                       # Training & holdout evaluation for Model 2
├── requirements.txt                     # Dependencies
└── README.md
```

---

## 2. Installation

```bash
pip install -r requirements.txt
```

---

## 3. Model 1: Geological Reserve Estimation

### Overview
A hybrid spatial regressor combining **XGBoost** with **Ordinary Kriging (PyKrige)** to predict in-situ manganese ore grade (% Mn), seam thickness (m), and deposit tonnage (MT) with 95% confidence intervals derived from kriging variance.

### Validation
Evaluated via **5-Fold Spatial Block Cross-Validation** (zero spatial leakage across easting strips):
- **Ore Grade (% Mn)**: **$R^2 = 0.8002$**, **$\text{MAE} = 2.22\%$ Mn**, **$92.10\%$ Accuracy**
- **Seam Thickness (m)**: **$R^2 = 0.5358$**, **$\text{MAE} = 1.62\text{ m}$**, **$77.33\%$ Accuracy**

### Run Training
```bash
python reserve_model.py
```

### Python API
```python
from reserve_model import predict_reserve

result = predict_reserve(
    easting=430.0,
    northing=340.0,
    depth=125.0,
    ndvi=0.48,
    moisture=0.22,
    lst=31.5
)
print(result)
```

---

## 4. Model 2: Production Shortfall Early-Warning

### Overview
A cost-sensitive **XGBoost Classifier** paired with **SHAP TreeExplainer** that monitors per-shift operational telemetry (equipment downtime, precipitation, blasting delays, workforce headcount) to predict whether the mine will miss its monthly target quota and outputs root-cause drivers and prescriptive interventions.

### Validation
Evaluated on a **stratified holdout test set** (300 mine-months):
- **Classification Accuracy**: **$94.67\%$**
- **ROC-AUC**: **$0.9921$**
- **Recall (Sensitivity)**: **$98.52\%$** (133 of 135 shortfall events caught)
- **Precision**: **$90.48\%$**
- **F1-Score**: **$0.9433$**

### Run Training
```bash
python train_model.py
```

### Launch Inference API
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```
Interactive Swagger UI available at `http://localhost:8000/docs`.