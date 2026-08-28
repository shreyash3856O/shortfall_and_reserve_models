import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollSubsurfaceTerrain3D from '../components/3d/ScrollSubsurfaceTerrain3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

// Reusable scroll-reveal container component
function ScrollRevealBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '800ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-12 scale-[0.97]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { t } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(progress);
      }
      setShowScrollTop(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Centered Scrollable Story Content Overlaid on 3D Subsurface World */}
      <div className="relative z-10 pt-28 pb-20 space-y-48 max-w-4xl mx-auto px-6">
        {/* SECTION 1: HERO VIEW (CENTERED) */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full">
            <div className="bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C1C22] border border-[#2E2E36] text-[11px] font-semibold text-[#C0BDB8] mx-auto">
                <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
                Autonomous Geological &amp; Operational Core
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight max-w-2xl mx-auto">
                AI Decision Support for Manganese Mining
              </h1>

              <p className="text-[15px] text-[#9A9A9A] leading-relaxed max-w-xl mx-auto">
                MIDAS fuses borehole geological core assays, SCADA pit telemetry, and Sentinel-2 satellite imagery to eliminate production deficits and map subterranean manganese reserves with 92.1% accuracy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-lg mx-auto">
                <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl text-left">
                  <div className="text-[11px] text-[#777777] font-medium">Reserve Estimation (Model 1)</div>
                  <div className="text-2xl font-bold text-[#EFEFEF] mt-1">92.1%</div>
                  <div className="text-[10px] text-[#555555] mt-0.5">5-Fold Spatial CV &bull; R&sup2; 0.8002</div>
                </div>
                <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl text-left">
                  <div className="text-[11px] text-[#777777] font-medium">Shortfall Recall (Model 2)</div>
                  <div className="text-2xl font-bold text-[#4F9067] mt-1">98.5%</div>
                  <div className="text-[10px] text-[#555555] mt-0.5">133/135 Deficits Detected</div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onEnterDashboard}
                  className="bg-[#24242A] hover:bg-[#303038] border border-[#3C3C46] text-[#EFEFEF] px-7 py-3.5 rounded-xl text-[13px] font-semibold transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <span>Enter Operations Dashboard</span>
                  <span>&rarr;</span>
                </button>
                <div className="text-[12px] text-[#777777] flex items-center gap-2 px-2">
                  <span>&darr;</span>
                  <span>Scroll down to explore subterranean AI</span>
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* SECTION 2: SUBTERRANEAN GEOLOGY & BOREHOLE ESTIMATION (CENTERED) */}
        <section className="min-h-[75vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-[#1C1C22] border border-[#2E2E36] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
                <span>Subsurface Model 1 &bull; Geological Kriging</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                100&times;100m Spatial Block Reserve Model
              </h2>

              <p className="text-[14px] text-[#9A9A9A] leading-relaxed max-w-lg mx-auto">
                Combining XGBoost spatial regression with Ordinary Kriging to map manganese ore seams across the Sausar Supergroup. Predicts in-situ ore grade (% Mn), seam thickness, and deposit tonnage with 95% confidence intervals.
              </p>

              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-5 rounded-2xl space-y-2.5 text-[12px] text-left max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-[#777777]">High-Grade Reserve Zone:</span>
                  <span className="text-[#4F9067] font-bold">&ge;38% Mn (1.892 MT)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#777777]">Medium-Grade Reserve Zone:</span>
                  <span className="text-[#C98040] font-bold">32&ndash;38% Mn (2.889 MT)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#777777]">Spatial Grid Coverage:</span>
                  <span className="text-[#CCCCCC]">10,000 blocks across 100 km&sup2;</span>
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* SECTION 3: EARLY-WARNING SHORTFALL & SCADA AI (CENTERED) */}
        <section className="min-h-[75vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-[#1C1C22] border border-[#2E2E36] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D94F4F]"></span>
                <span>Operational Model 2 &bull; Cost-Sensitive AI</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                Real-Time Production Shortfall Early Warning
              </h2>

              <p className="text-[14px] text-[#9A9A9A] leading-relaxed max-w-lg mx-auto">
                Monitors daily extraction rates, shovel-dumper breakdowns, monsoon precipitation, and workforce headcount. Outputs probability of monthly production shortfall with SHAP root-cause attributions days in advance.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 max-w-md mx-auto text-left">
                <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl">
                  <div className="text-[11px] text-[#777777]">False Alarm Rate</div>
                  <div className="text-xl font-bold text-[#EFEFEF] mt-0.5">5.6%</div>
                  <div className="text-[10px] text-[#555555]">F1-Optimal 0.080 Cutoff</div>
                </div>
                <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-xl">
                  <div className="text-[11px] text-[#777777]">ROC-AUC Metric</div>
                  <div className="text-xl font-bold text-[#4F9067] mt-0.5">0.9921</div>
                  <div className="text-[10px] text-[#555555]">Tested on 1,500 cycles</div>
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* SECTION 4: PRESCRIPTIVE DIRECTIVES & DIGITAL TWIN (CENTERED) */}
        <section className="min-h-[75vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="bg-[#141418]/85 backdrop-blur-md border border-[#26262C] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-[#1C1C22] border border-[#2E2E36] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C98040]"></span>
                <span>Decision Core &bull; Prescriptive Action Plans</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                From Diagnosis to Autonomous Recovery Plans
              </h2>

              <p className="text-[14px] text-[#9A9A9A] leading-relaxed max-w-lg mx-auto">
                MIDAS doesn't just alert managers to risks&mdash;it evaluates live rule triggers to recommend prioritized operational actions: deploying backup excavators, advancing blasting schedules, and reallocating haulage trucks.
              </p>

              <div className="bg-[#0D0D10]/80 border border-[#24242A] p-4 rounded-2xl space-y-2 text-[12px] text-left max-w-lg mx-auto">
                <div className="flex items-center gap-2.5 text-[#CCCCCC]">
                  <span className="w-5 h-5 rounded bg-[#1C1C22] border border-[#2E2E36] text-[#C0BDB8] font-bold text-[10px] flex items-center justify-center flex-shrink-0">1</span>
                  <span>Deploy Komatsu PC1250 excavator to active ore face (+350 T/day)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#CCCCCC]">
                  <span className="w-5 h-5 rounded bg-[#1C1C22] border border-[#2E2E36] text-[#C0BDB8] font-bold text-[10px] flex items-center justify-center flex-shrink-0">2</span>
                  <span>Advance blasting before monsoon front &amp; activate pit pumps (+200 T/day)</span>
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* SECTION 5: FINAL LAUNCH CTA (CENTERED) */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-xl">
            <div className="bg-[#141418]/90 backdrop-blur-md border border-[#26262C] p-10 sm:p-12 rounded-3xl shadow-2xl space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C22] border border-[#2E2E36] text-[11px] font-semibold text-[#C0BDB8] mx-auto">
                <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
                Production Ready Deployment
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F7]">
                Ready to Explore MOIL Live Operations?
              </h2>

              <p className="text-[14px] text-[#888888] max-w-md mx-auto">
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
          </ScrollRevealBlock>
        </section>
      </div>

      {/* Floating Scroll to Top Button (Only on Landing Page) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-[#1A1A20]/90 backdrop-blur-md border border-[#2E2E38] hover:border-[#4F9067] text-[#C0BDB8] hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-8 border-t border-[#1C1C20] bg-[#0D0D10] text-[11px] text-[#555555] flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>MIDAS Decision Core &bull; MOIL Limited</div>
        <div>Data Sources: SCADA Ingest, Sentinel-2 Spectral Orbit, IBM Statutory Registry</div>
      </footer>
    </div>
  );
}
