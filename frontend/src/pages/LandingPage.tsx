import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollSubsurfaceTerrain3D from '../components/3d/ScrollSubsurfaceTerrain3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { t } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0D0D10] text-[#EFEFEF] font-sans selection:bg-[#4F9067]/30 selection:text-white">
      {/* 3D Scroll Subsurface Canvas Background */}
      <ScrollSubsurfaceTerrain3D scrollProgress={scrollProgress} />

      {/* Top Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#1A1A1E] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#4F9067] to-[#C0BDB8] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Fixed Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-[#26262A]/70 px-6 lg:px-12 flex items-center justify-between bg-[#0D0D10]/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="bg-[#202024] border border-[#303036] px-2.5 py-1 rounded text-[13px] font-bold text-[#C0BDB8]">
            MIDAS
          </div>
          <div className="text-[13px] text-[#888888] font-medium hidden sm:block">
            MOIL Limited &bull; Mine Intelligence System
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterDashboard}
            className="bg-[#1C1C20] hover:bg-[#282830] border border-[#3A3A42] text-[#EFEFEF] px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all shadow-md hover:border-[#4F9067]/60"
          >
            Launch Dashboard &rarr;
          </button>
        </div>
      </header>

      {/* Scrollable Story Content Overlaid on 3D Subsurface World */}
      <div className="relative z-10 pt-24 pb-16 space-y-36 max-w-6xl mx-auto px-6 lg:px-12">
        {/* SECTION 1: HERO VIEW */}
        <section className="min-h-[80vh] flex flex-col justify-center max-w-2xl">
          <div className="bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 lg:p-10 rounded-2xl shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C22] border border-[#2E2E36] text-[11px] font-semibold text-[#C0BDB8]">
              <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
              Autonomous Geological &amp; Operational Core
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
              AI Decision Support for Manganese Mining
            </h1>

            <p className="text-[15px] text-[#9A9A9A] leading-relaxed">
              MIDAS fuses borehole geological core assays, SCADA pit telemetry, and Sentinel-2 satellite imagery to eliminate production deficits and map subterranean manganese reserves with 92.1% accuracy.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl">
                <div className="text-[11px] text-[#777777] font-medium">Reserve Estimation (Model 1)</div>
                <div className="text-2xl font-bold text-[#EFEFEF] mt-1">92.1%</div>
                <div className="text-[10px] text-[#555555] mt-0.5">5-Fold Spatial CV &bull; R&sup2; 0.8002</div>
              </div>
              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl">
                <div className="text-[11px] text-[#777777] font-medium">Shortfall Recall (Model 2)</div>
                <div className="text-2xl font-bold text-[#4F9067] mt-1">98.5%</div>
                <div className="text-[10px] text-[#555555] mt-0.5">133/135 Deficits Detected</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEnterDashboard}
                className="bg-[#24242A] hover:bg-[#303038] border border-[#3C3C46] text-[#EFEFEF] px-6 py-3 rounded-lg text-[13px] font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Enter Operations Dashboard</span>
                <span>&rarr;</span>
              </button>
              <div className="text-[12px] text-[#777777] flex items-center gap-2 px-2">
                <span>&darr;</span>
                <span>Scroll down to inspect subterranean models</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SUBTERRANEAN GEOLOGY & BOREHOLE ESTIMATION (Model 1) */}
        <section className="min-h-[70vh] flex flex-col justify-center items-end">
          <div className="max-w-xl bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 lg:p-10 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
              <span>Subsurface Model 1 &bull; Geological Kriging</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
              100&times;100m Spatial Block Reserve Model
            </h2>

            <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
              Combining XGBoost spatial regression with Ordinary Kriging to map manganese ore seams across the Sausar Supergroup. Predicts in-situ ore grade (% Mn), seam thickness, and deposit tonnage with 95% confidence intervals.
            </p>

            <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#777777]">High-Grade Reserve Zone:</span>
                <span className="text-[#4F9067] font-bold">&ge;38% Mn (1.892 MT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Medium-Grade Reserve Zone:</span>
                <span className="text-[#C98040] font-bold">32&ndash;38% Mn (2.889 MT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Spatial Resolution:</span>
                <span className="text-[#CCCCCC]">10,000 blocks across 100 km&sup2;</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EARLY-WARNING SHORTFALL & SCADA AI (Model 2) */}
        <section className="min-h-[70vh] flex flex-col justify-center">
          <div className="max-w-xl bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 lg:p-10 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D94F4F]"></span>
              <span>Operational Model 2 &bull; Cost-Sensitive AI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
              Real-Time Production Shortfall Early Warning
            </h2>

            <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
              Monitors daily extraction rates, shovel-dumper breakdowns, monsoon precipitation, and workforce headcount. Outputs probability of monthly production shortfall with SHAP root-cause attributions days in advance.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-3.5 rounded-xl">
                <div className="text-[11px] text-[#777777]">False Alarm Rate</div>
                <div className="text-xl font-bold text-[#EFEFEF] mt-0.5">5.6%</div>
                <div className="text-[10px] text-[#555555]">F1-Optimal 0.080 Cutoff</div>
              </div>
              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-3.5 rounded-xl">
                <div className="text-[11px] text-[#777777]">ROC-AUC Metric</div>
                <div className="text-xl font-bold text-[#4F9067] mt-0.5">0.9921</div>
                <div className="text-[10px] text-[#555555]">Tested on 1,500 cycles</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRESCRIPTIVE DIRECTIVES & DIGITAL TWIN */}
        <section className="min-h-[70vh] flex flex-col justify-center items-end">
          <div className="max-w-xl bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 lg:p-10 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98040]"></span>
              <span>Decision Core &bull; Prescriptive Action Plans</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
              From Diagnosis to Autonomous Recovery Plans
            </h2>

            <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
              MIDAS doesn't just alert managers to risks&mdash;it evaluates live rule triggers to recommend prioritized operational actions: deploying backup excavators, advancing blasting schedules, and reallocating haulage trucks.
            </p>

            <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl space-y-2 text-[12px]">
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <span className="w-5 h-5 rounded bg-[#1C1C22] border border-[#2E2E36] text-[#C0BDB8] font-bold text-[10px] flex items-center justify-center flex-shrink-0">1</span>
                <span>Deploy Komatsu PC1250 excavator to active ore face (+350 T/day)</span>
              </div>
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <span className="w-5 h-5 rounded bg-[#1C1C22] border border-[#2E2E36] text-[#C0BDB8] font-bold text-[10px] flex items-center justify-center flex-shrink-0">2</span>
                <span>Advance blasting before monsoon front &amp; activate pit pumps (+200 T/day)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL LAUNCH CTA */}
        <section className="min-h-[60vh] flex flex-col justify-center items-center text-center">
          <div className="max-w-2xl bg-[#141418]/90 backdrop-blur-md border border-[#26262C] p-10 lg:p-12 rounded-3xl shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C22] border border-[#2E2E36] text-[11px] font-semibold text-[#C0BDB8]">
              <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
              Production Ready Deployment
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F7]">
              Ready to Explore MOIL Live Operations?
            </h2>

            <p className="text-[14px] text-[#888888] max-w-lg mx-auto">
              Inspect real-time telemetry across Balaghat, Ukwa, Dongri Buzurg, Tirodi, and all 10 production units.
            </p>

            <div className="pt-2">
              <button
                onClick={onEnterDashboard}
                className="bg-[#24242A] hover:bg-[#303038] border border-[#3C3C46] text-white px-8 py-3.5 rounded-xl text-[14px] font-bold tracking-wide transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
              >
                <span>Launch MIDAS Workspace</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-8 border-t border-[#1C1C20] bg-[#0D0D10] text-[11px] text-[#555555] flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>MIDAS Decision Core &bull; MOIL Limited</div>
        <div>Data Sources: SCADA Ingest, Sentinel-2 Spectral Orbit, IBM Statutory Registry</div>
      </footer>
    </div>
  );
}
