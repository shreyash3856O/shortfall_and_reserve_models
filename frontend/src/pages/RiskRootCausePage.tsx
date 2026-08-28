import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, MineRiskSummary, PredictionResponse } from '../api/client';

interface RiskRootCausePageProps {
  selectedMineId?: string;
}

export default function RiskRootCausePage({ selectedMineId = 'MN01' }: RiskRootCausePageProps) {
  const { t } = useTranslation();
  const [mineId, setMineId] = useState(selectedMineId);
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [detail, setDetail] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMines() {
      try {
        const res = await api.getShortfallMines();
        setMines(res.data);
      } catch (err) { console.error('Failed to load mines', err); }
    }
    loadMines();
  }, []);

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const res = await api.getMineDetail(mineId);
        setDetail(res.data);
      } catch (err) { console.error('Failed to load mine detail', err); }
      finally { setIsLoading(false); }
    }
    loadDetail();
  }, [mineId]);

  const activeMine = mines.find((m) => m.mine_id === mineId);
  const isHighRisk = activeMine?.risk_level === 'HIGH';
  const isMedRisk = activeMine?.risk_level === 'MEDIUM';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header & Mine Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('risk.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-0.5">{t('risk.subheading')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#888888] text-[12px] font-medium">Select Mine:</span>
          <select
            value={mineId}
            onChange={(e) => setMineId(e.target.value)}
            className="bg-[#1C1C1C] border border-[#2E2E2E] text-[#EFEFEF] px-3 py-1.5 rounded-md font-semibold text-[13px] focus:outline-none focus:border-[#444444] transition-colors"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>
                {m.mine_name} ({m.mine_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading || !detail ? (
        <div className="p-8 text-[13px] text-[#888888] flex items-center justify-center min-h-[300px] gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
          Loading risk breakdown...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Root Cause Breakdown Chart */}
          <div className="lg:col-span-7 bg-[#181818] border border-[#2A2A2A] p-5 space-y-4 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#242424] pb-3 text-[12px]">
              <span className="font-bold text-[#EFEFEF]">Primary Risk Drivers</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                isHighRisk
                  ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                  : isMedRisk
                  ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                  : 'bg-[#4F9067]/15 text-[#4F9067] border-[#4F9067]/30'
              }`}>
                Total Shortfall Risk: {detail.shortfall_probability.toFixed(0)}%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detail.shap_breakdown} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid stroke="#222222" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#262626' }}
                    label={{ value: '+Risk Contribution (%)', position: 'insideBottom', fill: '#666666', fontSize: 10 }} />
                  <YAxis type="category" dataKey="feature" stroke="#333333" tick={{ fill: '#CCCCCC', fontSize: 11 }} tickLine={{ stroke: '#262626' }} width={140} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', borderRadius: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }} />
                  <Bar dataKey="impact_pct" name="Risk Impact (+%)" fill="#D94F4F" radius={[0, 2, 2, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-[#666666]">
              Feature contribution calculated using SHAP TreeExplainer on live operational variables.
            </div>
          </div>

          {/* Right Column: Clear Plain-Language Diagnosis & Action Preview */}
          <div className="lg:col-span-5 space-y-4 text-[12px]">
            {/* Diagnosis Card */}
            <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-3 rounded-lg">
              <div className="text-[11px] text-[#888888] uppercase tracking-wider font-semibold">
                AI Diagnosis Summary
              </div>
              <div className="text-[14px] text-[#EFEFEF] leading-relaxed font-medium border-l-2 border-[#D94F4F] pl-3 py-0.5">
                {detail.main_reason}
              </div>
              <div className="pt-3 border-t border-[#242424] space-y-2 text-[#888888]">
                <div className="flex justify-between"><span>Current Extraction Pace:</span><span className="text-[#EFEFEF] font-medium">{activeMine?.daily_avg_tonnes} T/day</span></div>
                <div className="flex justify-between"><span>Equipment Breakdown:</span><span className="text-[#EFEFEF] font-medium">{activeMine?.equipment_downtime_hrs} h/day</span></div>
                <div className="flex justify-between"><span>Monsoon Rainfall:</span><span className="text-[#EFEFEF] font-medium">{activeMine?.rainfall_mm} mm</span></div>
                <div className="flex justify-between"><span>Blasting Delays:</span><span className="text-[#EFEFEF] font-medium">{activeMine?.blasting_delay_days} days</span></div>
              </div>
            </div>

            {/* Quick Action Directives */}
            <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-3 rounded-lg">
              <div className="text-[11px] text-[#888888] uppercase tracking-wider font-semibold">
                Immediate Action Steps
              </div>
              <div className="space-y-2 text-[#CCCCCC]">
                {detail.recommended_actions.map((act, idx) => (
                  <div key={idx} className="flex gap-2.5 text-[12px] items-start">
                    <span className="w-5 h-5 rounded bg-[#242424] border border-[#333333] text-[#C0BDB8] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#AAAAAA] leading-relaxed">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
