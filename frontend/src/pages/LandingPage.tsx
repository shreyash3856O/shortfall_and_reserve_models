import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollSubsurfaceTerrain3D from '../components/3d/ScrollSubsurfaceTerrain3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

// ── Intersection-observer reveal block ──────────────────────────
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
    );
    const el = ref.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '900ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-14 scale-[0.96]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── Live animated counter ────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    const el = ref.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Thin horizontal data ticker ──────────────────────────────────
function LiveTicker() {
  const items = [
    'Fleet Online: 94.2% (48/51 Units)',
    'Balaghat — Extraction: 2,840 T/day',
    'Shortfall Risk: MN01 72% HIGH',
    'Active Shift: A (06:00–14:00)',
    'Reserve Stock: 4.781 MT in-situ',
    'Sentinel-2 Pass: 10:30 IST • Clear',
    'Borehole Cores: 2,847 logs active',
    'Dongri Buzurg — Grade 46.5% Mn',
    'SCADA Latency: 240ms avg',
    'Next Blast Window: 14:00 IST',
  ];
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden bg-[#0E0E12]/90 border-t border-b border-white/[0.05] py-2 select-none">
      <div className="ticker-track flex items-center gap-8 text-[11px] font-mono">
        {track.map((item, i) => (
          <span key={i} className="flex-shrink-0 flex items-center gap-2.5 text-[#666672]">
            <span className="w-1 h-1 rounded-full bg-[#4F9067] inline-block flex-shrink-0"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────
export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress(Math.min(Math.max(window.scrollY / total, 0), 1));
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const stats = [
    { label: 'Reserve Accuracy', value: 92, suffix: '%', sub: '5-Fold Spatial CV • R² 0.8002', accent: '#4F9067' },
    { label: 'Shortfall Recall', value: 98, suffix: '.5%', sub: '133/135 Deficits Detected', accent: '#4F9067' },
    { label: 'ROC-AUC Score', value: 99, suffix: '.21', sub: 'Tested on 1,500 Cycles', accent: '#C0BDB8' },
    { label: 'False Alarm Rate', value: 5, suffix: '.6%', sub: 'F1-Optimal 0.080 Cutoff', accent: '#C98040' },
    { label: 'Ore Blocks Mapped', value: 10000, suffix: '', sub: '100×100m Resolution Grid', accent: '#C0BDB8' },
    { label: 'MOIL Mines Covered', value: 10, suffix: '/10', sub: 'Full Production Network', accent: '#4F9067' },
  ];

  const timeline = [
    {
      step: '01',
      title: 'SCADA & Geological Ingest',
      desc: 'Borehole core assays, daily SCADA shift records, and Sentinel-2 spectral indices streamed into a unified feature store.',
      color: '#4F9067',
    },
    {
      step: '02',
      title: 'Spatial Reserve Estimation',
      desc: 'XGBoost + Ordinary Kriging models output per-block ore grade, seam thickness, and deposit confidence across 10,000 spatial cells.',
      color: '#C0BDB8',
    },
    {
      step: '03',
      title: 'Shortfall Risk AI',
      desc: 'Cost-sensitive XGBoost monitors equipment downtime, rainfall, and workforce factors to predict production deficits 7–14 days ahead.',
      color: '#C98040',
    },
    {
      step: '04',
      title: 'SHAP Attribution',
      desc: 'TreeSHAP identifies which operational driver (breakdown hours, rain, blasting delays) contributes most to each mine\'s risk score.',
      color: '#4F9067',
    },
    {
      step: '05',
      title: 'Prescriptive Dispatch',
      desc: 'Rule-engine translates AI output into prioritized, weighted action directives — deploy equipment, advance blasting, or reroute haulage.',
      color: '#C0BDB8',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0D0D10] text-[#EFEFEF] font-sans selection:bg-[#4F9067]/30 selection:text-white">
      {/* 3D Subsurface Canvas */}
      <ScrollSubsurfaceTerrain3D scrollProgress={scrollProgress} />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#1A1A1E] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#4F9067] via-[#6BAF88] to-[#C0BDB8] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Fixed Header */}
      <header className="fixed top-[2px] left-0 right-0 h-16 border-b border-white/[0.05] px-6 lg:px-12 flex items-center justify-between bg-[#0D0D10]/85 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F9067]/30 to-[#3D7852]/10 border border-[#4F9067]/25 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#4F9067]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-extrabold tracking-tight text-[#F0F0F0]">MIDAS</div>
            <div className="text-[10px] text-[#555566] font-medium leading-tight hidden sm:block">MOIL Limited • Mine Intelligence System</div>
          </div>
        </div>

        {/* Header progress summary */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#666672]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067] animate-pulse"></span>
            10 Mines Live
          </span>
          <span className="text-[#333340]">|</span>
          <span>2 AI Models Active</span>
          <span className="text-[#333340]">|</span>
          <span>SCADA Connected</span>
        </div>

        <button
          onClick={onEnterDashboard}
          className="bg-[#1C1C22] hover:bg-[#262630] border border-white/[0.08] hover:border-[#4F9067]/40 text-[#EFEFEF] px-4 py-2 rounded-lg text-[12px] font-semibold transition-all shadow-md"
        >
          Launch Dashboard &rarr;
        </button>
      </header>

      {/* Live Ticker under header */}
      <div className="fixed top-16 left-0 right-0 z-30">
        <LiveTicker />
      </div>

      {/* Main Scroll Content */}
      <div className="relative z-10 pt-36 pb-24 space-y-48 max-w-4xl mx-auto px-6">

        {/* ── HERO ────────────────────────────────── */}
        <section className="min-h-[82vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full">
            <div className="glass-tile rounded-3xl p-8 sm:p-12 space-y-8 text-center">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-semibold text-[#C0BDB8] mx-auto">
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-[#4F9067] inline-block"></span>
                  <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#4F9067] animate-ping"></span>
                </div>
                Autonomous Geological &amp; Operational Core
              </div>

              <h1 className="text-3xl sm:text-[52px] font-extrabold tracking-tight text-[#F5F5F7] leading-[1.1] max-w-2xl mx-auto">
                AI Decision Support for
                <span className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #6BAF88 0%, #C0BDB8 60%)' }}>
                  Manganese Mining
                </span>
              </h1>

              <p className="text-[15px] text-[#888898] leading-relaxed max-w-xl mx-auto">
                MIDAS fuses borehole geological core assays, SCADA pit telemetry, and Sentinel-2 satellite imagery to eliminate production deficits and map subterranean manganese reserves with 92.1% accuracy.
              </p>

              {/* 2 Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-lg mx-auto">
                <div className="bg-white/[0.03] border border-white/[0.07] p-4 rounded-2xl text-left space-y-1 hover:border-[#4F9067]/30 transition-all duration-300">
                  <div className="text-[11px] text-[#777788] font-medium">Reserve Estimation (Model 1)</div>
                  <div className="text-2xl font-bold text-[#EFEFEF]">92.1%</div>
                  <div className="text-[10px] text-[#555560]">5-Fold Spatial CV &bull; R&sup2; 0.8002</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] p-4 rounded-2xl text-left space-y-1 hover:border-[#4F9067]/30 transition-all duration-300">
                  <div className="text-[11px] text-[#777788] font-medium">Shortfall Recall (Model 2)</div>
                  <div className="text-2xl font-bold text-[#4F9067]">98.5%</div>
                  <div className="text-[10px] text-[#555560]">133/135 Deficits Detected</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onEnterDashboard}
                  className="bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-[#4F9067]/40 text-[#EFEFEF] px-7 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-300 shadow-lg flex items-center gap-2 hover:scale-[1.02]"
                >
                  Enter Operations Dashboard
                  <span>&rarr;</span>
                </button>
                <div className="text-[12px] text-[#555568] flex items-center gap-2">
                  <span className="animate-float inline-block">&darr;</span>
                  Scroll to explore the AI pipeline
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── ANIMATED STATS ROW ───────────────────── */}
        <section>
          <ScrollRevealBlock className="w-full">
            <div className="text-center mb-8 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#444450]">Validated Performance</div>
              <h2 className="text-xl font-bold text-[#EFEFEF]">By the Numbers</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  className="glass-tile glass-tile-hover rounded-2xl p-5 text-center space-y-1.5 cursor-default"
                  style={{
                    borderColor: hoveredStat === i ? `${s.accent}40` : undefined,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: s.accent }}>
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[12px] font-semibold text-[#CCCCCE]">{s.label}</div>
                  <div className="text-[10px] text-[#555560]">{s.sub}</div>
                </div>
              ))}
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── HOW IT WORKS TIMELINE ───────────────── */}
        <section>
          <ScrollRevealBlock className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#444450]">AI Decision Pipeline</div>
              <h2 className="text-2xl font-bold text-[#EFEFEF]">How MIDAS Works</h2>
              <p className="text-[13px] text-[#666672]">A 5-stage end-to-end intelligence loop from raw sensor data to prescriptive action.</p>
            </div>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <ScrollRevealBlock key={i} delay={i * 80}>
                  <div className="glass-tile glass-tile-hover rounded-2xl p-5 flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[12px] font-extrabold border"
                      style={{
                        background: `${step.color}15`,
                        borderColor: `${step.color}30`,
                        color: step.color,
                      }}
                    >
                      {step.step}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#EFEFEF] mb-1">{step.title}</div>
                      <div className="text-[12px] text-[#888898] leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                </ScrollRevealBlock>
              ))}
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── SUBSURFACE MODEL SECTION ─────────────── */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="glass-tile rounded-3xl p-8 sm:p-10 space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
                Subsurface Model 1 &bull; Geological Kriging
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                100&times;100m Spatial Block Reserve Model
              </h2>

              <p className="text-[14px] text-[#888898] leading-relaxed max-w-lg mx-auto">
                XGBoost spatial regression combined with Ordinary Kriging maps manganese ore seams across the Sausar Supergroup. Predicts in-situ ore grade, seam thickness, and tonnage with 95% confidence intervals.
              </p>

              <div className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-2xl space-y-2.5 text-[12px] text-left max-w-md mx-auto">
                {[
                  { label: 'High-Grade Reserve Zone:', val: '≥38% Mn (1.892 MT)', color: '#4F9067' },
                  { label: 'Medium-Grade Reserve Zone:', val: '32–38% Mn (2.889 MT)', color: '#C98040' },
                  { label: 'Spatial Grid Coverage:', val: '10,000 blocks across 100 km²', color: '#CCCCCC' },
                  { label: 'Estimation Confidence:', val: '95% CI on each block', color: '#C0BDB8' },
                ].map(({ label, val, color }, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-[#666672]">{label}</span>
                    <span className="font-bold" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── SHORTFALL AI SECTION ─────────────────── */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="glass-tile rounded-3xl p-8 sm:p-10 space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D94F4F]"></span>
                Operational Model 2 &bull; Cost-Sensitive AI
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                Real-Time Production Shortfall Early Warning
              </h2>

              <p className="text-[14px] text-[#888898] leading-relaxed max-w-lg mx-auto">
                Monitors daily extraction rates, shovel-dumper breakdowns, monsoon precipitation, and workforce headcount. Outputs shortfall probability with SHAP root-cause attributions days in advance.
              </p>

              {/* Live risk indicators */}
              <div className="space-y-2.5 max-w-md mx-auto text-left">
                {[
                  { label: 'Balaghat (MN01)', risk: 72, high: true },
                  { label: 'Ukwa (MN02)', risk: 55, high: false },
                  { label: 'Tirodi (MN03)', risk: 18, high: false },
                ].map(({ label, risk, high }, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.05] px-4 py-3 rounded-xl flex items-center gap-3">
                    <div className="text-[12px] text-[#CCCCCE] flex-1 font-medium">{label}</div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-24 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${risk}%`,
                            background: high ? '#D94F4F' : risk > 40 ? '#C98040' : '#4F9067',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold w-10 text-right" style={{ color: high ? '#D94F4F' : '#888898' }}>{risk}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 max-w-sm mx-auto text-left">
                <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl">
                  <div className="text-[11px] text-[#777788]">False Alarm Rate</div>
                  <div className="text-xl font-bold text-[#EFEFEF] mt-0.5">5.6%</div>
                  <div className="text-[10px] text-[#555560]">F1-Optimal Cutoff</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl">
                  <div className="text-[11px] text-[#777788]">ROC-AUC Score</div>
                  <div className="text-xl font-bold text-[#4F9067] mt-0.5">0.9921</div>
                  <div className="text-[10px] text-[#555560]">1,500 Test Cycles</div>
                </div>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── PRESCRIPTIVE ACTIONS ─────────────────── */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="glass-tile rounded-3xl p-8 sm:p-10 space-y-5 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C0BDB8] mx-auto bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C98040]"></span>
                Decision Core &bull; Prescriptive Action Plans
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F7]">
                From Diagnosis to Autonomous Recovery Plans
              </h2>

              <p className="text-[14px] text-[#888898] leading-relaxed max-w-lg mx-auto">
                MIDAS doesn't just alert managers to risks—it evaluates live rule triggers to recommend prioritized operational actions: deploying backup excavators, advancing blasting schedules, and reallocating haulage trucks.
              </p>

              <div className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-2xl space-y-3 text-left max-w-lg mx-auto">
                {[
                  { priority: 'CRITICAL', action: 'Deploy Komatsu PC1250 excavator to active ore face', impact: '+350 T/day' },
                  { priority: 'HIGH', action: 'Advance blasting before monsoon front & activate pit pumps', impact: '+200 T/day' },
                  { priority: 'MEDIUM', action: 'Prioritize high-grade Zone B extraction (38.6% Mn)', impact: '+120 T/day' },
                ].map(({ priority, action, impact }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold border flex-shrink-0 mt-0.5"
                      style={{
                        color: priority === 'CRITICAL' ? '#D94F4F' : priority === 'HIGH' ? '#C98040' : '#C0BDB8',
                        borderColor: priority === 'CRITICAL' ? '#D94F4F40' : priority === 'HIGH' ? '#C9804040' : '#C0BDB840',
                        background: priority === 'CRITICAL' ? '#D94F4F10' : priority === 'HIGH' ? '#C9804010' : '#C0BDB810',
                      }}
                    >
                      {priority}
                    </span>
                    <div className="flex-1">
                      <div className="text-[12px] text-[#CCCCCE]">{action}</div>
                      <div className="text-[11px] text-[#4F9067] font-semibold mt-0.5">{impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealBlock>
        </section>

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center">
          <ScrollRevealBlock className="w-full max-w-2xl">
            <div className="glass-tile rounded-3xl p-10 sm:p-14 space-y-7 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(79,144,103,0.07) 0%, rgba(18,18,22,0.9) 60%)',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4F9067]/10 border border-[#4F9067]/25 text-[11px] font-semibold text-[#4F9067] mx-auto">
                <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
                Production Ready
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F7] leading-tight">
                Ready to Explore MOIL<br />Live Operations?
              </h2>

              <p className="text-[14px] text-[#666672] max-w-md mx-auto">
                Inspect real-time telemetry across Balaghat, Ukwa, Dongri Buzurg, Tirodi, and all 10 production units of the MOIL network.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onEnterDashboard}
                  className="bg-[#4F9067]/15 hover:bg-[#4F9067]/25 border border-[#4F9067]/35 hover:border-[#4F9067]/60 text-white px-8 py-4 rounded-xl text-[14px] font-bold tracking-wide transition-all shadow-xl hover:scale-[1.02] flex items-center gap-2 mx-auto"
                >
                  Launch MIDAS Workspace &rarr;
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-3 text-[11px] text-[#444450]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
                  10 Mines Live
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0BDB8]"></span>
                  2 AI Models
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C98040]"></span>
                  SCADA Live
                </span>
              </div>
            </div>
          </ScrollRevealBlock>
        </section>
      </div>

      {/* Floating Scroll-to-Top (Landing page only) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl transition-all duration-350 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,32,0.95) 0%, rgba(18,18,22,0.98) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <svg className="w-5 h-5 text-[#C0BDB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-8 border-t border-white/[0.04] text-[11px] text-[#444450] flex flex-col sm:flex-row justify-between items-center gap-3"
        style={{ background: 'rgba(10,10,13,0.95)' }}
      >
        <div>MIDAS Decision Core &bull; MOIL Limited &bull; v2.4.1</div>
        <div>Data: SCADA Ingest, Sentinel-2 Spectral Orbit, IBM Statutory Registry</div>
      </footer>
    </div>
  );
}
