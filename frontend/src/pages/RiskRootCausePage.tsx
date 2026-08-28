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
      } catch (err) {
        console.error('Failed to load mines', err);
      }
    }
    loadMines();
  }, []);

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const res = await api.getMineDetail(mineId);
        setDetail(res.data);
      } catch (err) {
        console.error('Failed to load mine detail', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [mineId]);

  const activeMine = mines.find((m) => m.mine_id === mineId);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
            Explainable AI Subsystem (SHAP)
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('risk.heading')}</h1>
          <p className="text-[13px] text-[#8B949E] mt-1">{t('risk.subheading')}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span className="text-[#8B949E]">Select Unit:</span>
          <select
            value={mineId}
            onChange={(e) => setMineId(e.target.value)}
            className="bg-[#12151B] border border-[#232834] text-[#C8A96E] px-3 py-1.5 font-bold focus:outline-none focus:border-[#C8A96E]"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>
                {m.mine_id} — {m.mine_name} ({m.risk_level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading || !detail ? (
        <div className="p-8 font-mono text-[12px] text-[#8B949E]">
          Loading SHAP root-cause attributions...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: SHAP Waterfall Attribution Chart */}
          <div className="lg:col-span-7 bg-[#12151B] border border-[#232834] p-5 space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-[#232834] pb-2 text-[11px]">
              <span className="font-bold text-[#E6EDF3]">
                SHAP PER-FEATURE RISK ATTRIBUTION (PERCENTAGE POINTS)
              </span>
              <span className="text-[#C8A96E]">
                Total Risk: {detail.shortfall_probability.toFixed(1)}%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={detail.shap_breakdown}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid stroke="#1E232F" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#586069"
                    tick={{ fill: '#8B949E', fontSize: 10 }}
                    tickLine={{ stroke: '#232834' }}
                    label={{ value: '+Risk Contribution (%)', position: 'insideBottom', fill: '#8B949E', fontSize: 10 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    stroke="#586069"
                    tick={{ fill: '#E6EDF3', fontSize: 11 }}
                    tickLine={{ stroke: '#232834' }}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12151B',
                      borderColor: '#232834',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                  />
                  <Bar
                    dataKey="impact_pct"
                    name="Impact (+% Risk)"
                    fill="#D9534F"
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-[#586069]">
              Derived via shap.TreeExplainer from XGBoost margin space to additive probability contributions.
            </div>
          </div>

          {/* Right: Plain-Language Operational Diagnosis */}
          <div className="lg:col-span-5 space-y-4 font-mono text-[11px]">
            {/* Diagnosis Card */}
            <div className="bg-[#12151B] border border-[#232834] p-5 space-y-3">
              <div className="text-[10px] text-[#C8A96E] uppercase tracking-wider font-bold">
                Automated Root-Cause Diagnosis
              </div>
              <div className="text-[13px] text-[#E6EDF3] leading-relaxed font-sans border-l-2 border-[#D9534F] pl-3">
                {detail.main_reason}
              </div>
              <div className="pt-3 border-t border-[#232834] space-y-2 text-[#8B949E] text-[10px]">
                <div className="flex justify-between">
                  <span>Operating Status:</span>
                  <span className="text-[#E6EDF3]">{activeMine?.daily_avg_tonnes} T/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment Breakdown:</span>
                  <span className="text-[#E6EDF3]">{activeMine?.equipment_downtime_hrs} h/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Monsoon Peak Rain:</span>
                  <span className="text-[#E6EDF3]">{activeMine?.rainfall_mm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Stalled Blasting Days:</span>
                  <span className="text-[#E6EDF3]">{activeMine?.blasting_delay_days} days</span>
                </div>
              </div>
            </div>

            {/* Directives Preview */}
            <div className="bg-[#161A22] border border-[#232834] p-5 space-y-2">
              <div className="text-[10px] text-[#C8A96E] uppercase tracking-wider font-bold">
                Prescriptive Trigger Response
              </div>
              <div className="space-y-1.5 text-[#E6EDF3]">
                {detail.recommended_actions.map((act, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#C8A96E]">[{idx + 1}]</span>
                    <span>{act}</span>
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
