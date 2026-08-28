import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, MineHistoryRecord, MineRiskSummary } from '../api/client';

interface ProductionTrendsPageProps {
  selectedMineId?: string;
}

export default function ProductionTrendsPage({ selectedMineId = 'MN01' }: ProductionTrendsPageProps) {
  const { t } = useTranslation();
  const [mineId, setMineId] = useState(selectedMineId);
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [history, setHistory] = useState<MineHistoryRecord[]>([]);
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
    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await api.getMineHistory(mineId, 24);
        setHistory(res.data);
      } catch (err) { console.error('Failed to load mine history', err); }
      finally { setIsLoading(false); }
    }
    loadHistory();
  }, [mineId]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">Production Time Series (Model 2)</div>
          <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('trends.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-1">{t('trends.subheading')}</p>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-[#888888] font-medium">{t('trends.selectMine')}:</span>
          <select
            value={mineId}
            onChange={(e) => setMineId(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2E2E2E] text-[#EFEFEF] px-3 py-1.5 rounded font-semibold focus:outline-none focus:border-[#4A4A4A] transition-colors"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>{m.mine_id} — {m.mine_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-5 space-y-4 rounded-lg">
        <div className="flex flex-wrap justify-between items-center text-[12px] border-b border-[#2E2E2E] pb-3">
          <div className="font-bold text-[#EFEFEF]">Actual Extraction vs Target Mandate (24-Month Trajectory)</div>
          <div className="flex items-center gap-5 text-[#888888]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#4F9067] inline-block rounded-sm"></span>
              <span>Actual Tonnes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#C0BDB8] inline-block"></span>
              <span>Target Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#D94F4F] inline-block"></span>
              <span>Shortfall Risk %</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-[13px] text-[#888888] gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Loading historical trajectory...
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#252525" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#2E2E2E' }} />
                <YAxis yAxisId="left" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#2E2E2E' }}
                  label={{ value: 'Tonnes (T)', angle: -90, position: 'insideLeft', fill: '#666666', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#2E2E2E' }}
                  label={{ value: 'Risk %', angle: 90, position: 'insideRight', fill: '#666666', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', borderRadius: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }} itemStyle={{ color: '#EFEFEF' }} />
                <Bar yAxisId="left" dataKey="actual_tonnes" name="Actual (T)" fill="#4F9067" radius={[2, 2, 0, 0]} maxBarSize={26} />
                <Line yAxisId="left" type="monotone" dataKey="target_tonnes" name="Target (T)" stroke="#C0BDB8" strokeWidth={2} dot={{ r: 2, fill: '#C0BDB8' }} />
                <Line yAxisId="right" type="stepAfter" dataKey="shortfall_probability" name="Shortfall Probability (%)" stroke="#D94F4F" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Audit Table */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2E2E2E] bg-[#1E1E1E] font-bold text-[#EFEFEF] text-[13px]">
          Monthly Performance &amp; Shortfall Log
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#161616] border-b border-[#2E2E2E] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">Cycle</th>
                <th className="py-2.5 px-4">Actual (T)</th>
                <th className="py-2.5 px-4">Target (T)</th>
                <th className="py-2.5 px-4">Achievement</th>
                <th className="py-2.5 px-4">Shortfall Event</th>
                <th className="py-2.5 px-4">Model Predicted Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E] text-[#CCCCCC]">
              {history.slice(-12).reverse().map((h, idx) => (
                <tr key={idx} className="hover:bg-[#1E1E1E] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#C0BDB8]">{h.date}</td>
                  <td className="py-2.5 px-4">{h.actual_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4">{h.target_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-medium">{h.achievement_pct}%</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                      h.is_shortfall === 1
                        ? 'bg-[#D94F4F]/10 text-[#D94F4F] border border-[#D94F4F]/30'
                        : 'bg-[#4F9067]/10 text-[#4F9067] border border-[#4F9067]/30'
                    }`}>
                      {h.is_shortfall === 1 ? 'Deficit' : 'Target Met'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold">{h.shortfall_probability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
