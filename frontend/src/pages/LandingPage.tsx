import React from 'react';
import { useTranslation } from 'react-i18next';
import ReserveBlockTerrain3D from '../components/3d/ReserveBlockTerrain3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#111111] text-[#EFEFEF] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-[#2E2E2E] px-8 flex items-center justify-between bg-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="bg-[#2A2A2A] border border-[#3C3C3C] px-3 py-1 rounded text-[13px] font-bold text-[#C0BDB8]">
            MIDAS
          </div>
          <div className="text-[13px] text-[#888888] font-medium">
            MOIL Limited &bull; Mine Decision Support System
          </div>
        </div>
        <button
          onClick={onEnterDashboard}
          className="bg-[#272727] hover:bg-[#323232] border border-[#3C3C3C] text-[#EFEFEF] px-5 py-2 rounded text-[13px] font-bold tracking-wide transition-all"
        >
          Enter Operational Dashboard &rarr;
        </button>
      </header>

      {/* Hero: Left Text + Right 3D */}
      <section className="border-b border-[#2E2E2E] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-[#181818]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#242424] border border-[#383838] text-[11px] font-semibold text-[#C0BDB8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
              Autonomous Mining Intelligence Core
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F2F0ED] leading-tight">
              Data-Fused Geological Modeling &amp; Production Early-Warning
            </h1>
            <p className="text-[14px] text-[#888888] leading-relaxed font-normal">
              MIDAS replaces manual drilling report synthesis with real-time operational telemetry,
              satellite spectral indices, and machine learning. Built specifically for manganese ore deposits
              of the Sausar Supergroup.
            </p>
          </div>

          {/* Validated Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-[#2E2E2E] space-y-4">
            <div className="text-[11px] text-[#666666] uppercase font-semibold tracking-wider">
              Verified Production Validation Metrics
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E1E1E] border border-[#2E2E2E] p-4 rounded-lg">
                <div className="text-[11px] text-[#888888] font-medium">Reserve Grade Accuracy</div>
                <div className="text-2xl font-extrabold text-[#C0BDB8] mt-1">92.10%</div>
                <div className="text-[11px] text-[#555555] mt-0.5">R&sup2; 0.8002 &bull; 5-Fold Spatial CV</div>
              </div>
              <div className="bg-[#1E1E1E] border border-[#2E2E2E] p-4 rounded-lg">
                <div className="text-[11px] text-[#888888] font-medium">Shortfall Recall (Test)</div>
                <div className="text-2xl font-extrabold text-[#4F9067] mt-1">98.52%</div>
                <div className="text-[11px] text-[#555555] mt-0.5">133/135 Shortfalls Caught</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onEnterDashboard}
              className="w-full bg-[#222222] hover:bg-[#2A2A2A] border border-[#363636] text-[#EFEFEF] py-3.5 rounded text-[13px] font-semibold tracking-wide transition-all"
            >
              Launch MIDAS Workspace
            </button>
          </div>
        </div>

        {/* 3D Terrain */}
        <div className="lg:col-span-7 h-[420px] lg:h-full relative min-h-[480px]">
          <ReserveBlockTerrain3D />
        </div>
      </section>

      {/* ML Architecture Section */}
      <section className="p-8 lg:p-12 border-b border-[#2E2E2E] bg-[#141414]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">
              System Specifications
            </div>
            <h2 className="text-2xl font-bold text-[#EFEFEF] mt-1">
              Integrated Machine Learning Pipelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-semibold text-[#C0BDB8]">Model 1</div>
                  <h3 className="text-lg font-bold text-[#EFEFEF]">Geological Reserve Estimation</h3>
                </div>
                <span className="text-[11px] bg-[#222222] border border-[#333333] px-2.5 py-1 rounded text-[#888888] font-medium">
                  Spatial Regressor
                </span>
              </div>
              <p className="text-[13px] text-[#888888] leading-relaxed">
                Hybrid spatial architecture combining XGBoost with Ordinary Kriging (PyKrige). Predicts in-situ manganese ore grade, seam thickness, and deposit tonnage with 95% confidence intervals across 100x100m blocks.
              </p>
              <div className="pt-3 border-t border-[#2E2E2E] text-[12px] space-y-2 text-[#777777]">
                <div className="flex justify-between">
                  <span>Ore Grade R&sup2;:</span>
                  <span className="text-[#EFEFEF] font-medium">0.8002 (&plusmn; 0.0635)</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade Mean Error:</span>
                  <span className="text-[#EFEFEF] font-medium">2.216% Mn (92.10% accuracy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation Strategy:</span>
                  <span className="text-[#C0BDB8] font-semibold">5-Fold Spatial Block CV</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-semibold text-[#C0BDB8]">Model 2</div>
                  <h3 className="text-lg font-bold text-[#EFEFEF]">Production Shortfall Early-Warning</h3>
                </div>
                <span className="text-[11px] bg-[#222222] border border-[#333333] px-2.5 py-1 rounded text-[#888888] font-medium">
                  Cost-Sensitive Classifier
                </span>
              </div>
              <p className="text-[13px] text-[#888888] leading-relaxed">
                Cost-sensitive XGBoost classifier paired with SHAP TreeExplainer. Monitors daily extraction rates, equipment breakdown hours, monsoon precipitation, and workforce headcount to output shortfall probabilities and prescriptive directives.
              </p>
              <div className="pt-3 border-t border-[#2E2E2E] text-[12px] space-y-2 text-[#777777]">
                <div className="flex justify-between">
                  <span>Overall Accuracy:</span>
                  <span className="text-[#EFEFEF] font-medium">94.67% (Holdout Test)</span>
                </div>
                <div className="flex justify-between">
                  <span>Shortfall Recall:</span>
                  <span className="text-[#4F9067] font-bold">98.52% (Sensitivity)</span>
                </div>
                <div className="flex justify-between">
                  <span>ROC-AUC Metric:</span>
                  <span className="text-[#EFEFEF] font-medium">0.9921</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 px-8 bg-[#111111] border-t border-[#2E2E2E] text-[12px] text-[#555555] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>MIDAS v1.0.0 &bull; MOIL Limited</div>
        <div>Data Sources: SCADA Telemetry, Sentinel-2, IBM Statutory Registry</div>
      </footer>
    </div>
  );
}
