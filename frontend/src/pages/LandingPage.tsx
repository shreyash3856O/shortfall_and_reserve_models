import React from 'react';
import { useTranslation } from 'react-i18next';
import ReserveBlockTerrain3D from '../components/3d/ReserveBlockTerrain3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#E6EDF3] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[#232834] px-8 flex items-center justify-between bg-[#12151B]">
        <div className="flex items-center gap-3">
          <div className="bg-[#1D222A] border border-[#2E3544] px-3 py-1 text-[13px] font-mono font-bold text-[#C8A96E]">
            MIDAS
          </div>
          <div className="text-[13px] text-[#8B949E] font-mono">
            MOIL LIMITED | MINE DECISION SUPPORT SYSTEM
          </div>
        </div>
        <button
          onClick={onEnterDashboard}
          className="bg-[#C8A96E] hover:bg-[#B3955A] text-[#0B0D10] px-5 py-2 text-[12px] font-mono font-bold transition-colors"
        >
          ENTER OPERATIONAL DASHBOARD &rarr;
        </button>
      </header>

      {/* Hero Section with Interactive 3D Terrain */}
      <section className="border-b border-[#232834] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Factual Specifications & CTA */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-[#12151B]">
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
              Autonomous Mining Intelligence Core
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#E6EDF3] leading-tight">
              Data-Fused Geological Modeling &amp; Production Early-Warning
            </h1>
            <p className="text-[13px] text-[#8B949E] leading-relaxed">
              MIDAS replaces manual drilling report synthesis with real-time operational telemetry, 
              satellite spectral indices, and machine learning. Built specifically for manganese ore deposits 
              of the Sausar Supergroup.
            </p>
          </div>

          {/* Core Verified Validation Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-[#232834] space-y-4 font-mono">
            <div className="text-[10px] text-[#586069] uppercase tracking-wider">
              Verified Production Validation Metrics
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#161A22] border border-[#232834] p-3">
                <div className="text-[10px] text-[#8B949E]">RESERVE GRADE ACCURACY</div>
                <div className="text-2xl font-bold text-[#C8A96E] mt-1">92.10%</div>
                <div className="text-[10px] text-[#586069] mt-0.5">R2 0.8002 | 5-Fold Spatial CV</div>
              </div>
              <div className="bg-[#161A22] border border-[#232834] p-3">
                <div className="text-[10px] text-[#8B949E]">SHORTFALL RECALL (TEST)</div>
                <div className="text-2xl font-bold text-[#4E9F6E] mt-1">98.52%</div>
                <div className="text-[10px] text-[#586069] mt-0.5">133/135 Shortfalls Caught</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onEnterDashboard}
              className="w-full bg-[#1D222A] hover:bg-[#232834] border border-[#2E3544] text-[#E6EDF3] py-3 text-[13px] font-mono font-bold tracking-wider transition-colors"
            >
              LAUNCH MIDAS WORKSPACE
            </button>
          </div>
        </div>

        {/* Right Column: Interactive 3D Three.js Geological Block Mesh */}
        <div className="lg:col-span-7 h-[420px] lg:h-full relative min-h-[480px]">
          <ReserveBlockTerrain3D />
        </div>
      </section>

      {/* Model Architectures & Data Pipeline Section */}
      <section className="p-8 lg:p-12 border-b border-[#232834] bg-[#0E1015]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
              System Specifications
            </div>
            <h2 className="text-2xl font-bold text-[#E6EDF3] mt-1">
              Integrated Machine Learning Pipelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model 1 Overview */}
            <div className="bg-[#12151B] border border-[#232834] p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-mono text-[#C8A96E]">MODEL 1</div>
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Geological Reserve Estimation</h3>
                </div>
                <span className="text-[10px] font-mono bg-[#161A22] border border-[#232834] px-2 py-1 text-[#8B949E]">
                  SPATIAL REGRESSOR
                </span>
              </div>
              <p className="text-[12px] text-[#8B949E] leading-relaxed">
                Hybrid spatial architecture combining XGBoost with Ordinary Kriging (PyKrige). Predicts in-situ manganese ore grade (% Mn), seam thickness (m), and deposit tonnage (MT) with 95% confidence intervals across 100x100m blocks.
              </p>
              <div className="pt-3 border-t border-[#232834] font-mono text-[11px] space-y-1.5 text-[#8B949E]">
                <div className="flex justify-between">
                  <span>Ore Grade R2:</span>
                  <span className="text-[#E6EDF3]">0.8002 (+/- 0.0635)</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade Mean Error:</span>
                  <span className="text-[#E6EDF3]">2.216% Mn (92.10% accuracy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation Strategy:</span>
                  <span className="text-[#C8A96E]">5-Fold Spatial Block CV</span>
                </div>
              </div>
            </div>

            {/* Model 2 Overview */}
            <div className="bg-[#12151B] border border-[#232834] p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-mono text-[#C8A96E]">MODEL 2</div>
                  <h3 className="text-lg font-bold text-[#E6EDF3]">Production Shortfall Early-Warning</h3>
                </div>
                <span className="text-[10px] font-mono bg-[#161A22] border border-[#232834] px-2 py-1 text-[#8B949E]">
                  COST-SENSITIVE CLASSIFIER
                </span>
              </div>
              <p className="text-[12px] text-[#8B949E] leading-relaxed">
                Cost-sensitive XGBoost classifier paired with SHAP TreeExplainer. Monitors daily extraction rates, equipment breakdown hours, monsoon precipitation, and workforce headcount to output shortfall probabilities and prescriptive directives.
              </p>
              <div className="pt-3 border-t border-[#232834] font-mono text-[11px] space-y-1.5 text-[#8B949E]">
                <div className="flex justify-between">
                  <span>Overall Accuracy:</span>
                  <span className="text-[#E6EDF3]">94.67% (Holdout Test)</span>
                </div>
                <div className="flex justify-between">
                  <span>Shortfall Recall:</span>
                  <span className="text-[#4E9F6E]">98.52% (Sensitivity)</span>
                </div>
                <div className="flex justify-between">
                  <span>ROC-AUC Metric:</span>
                  <span className="text-[#E6EDF3]">0.9921</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Factual Footer */}
      <footer className="py-6 px-8 bg-[#0B0D10] border-t border-[#232834] text-[11px] font-mono text-[#586069] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>MIDAS DEPLOYMENT VERSION 1.0.0 | MOIL LIMITED</div>
        <div>DATA SOURCES: SCADA TELEMETRY, SENTINEL-2, IBM STATUTORY REGISTRY</div>
      </footer>
    </div>
  );
}
