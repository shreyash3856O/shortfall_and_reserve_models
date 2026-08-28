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
      } catch (err) {
        console.error('Failed to load mines', err);
      }
    }
    loadMines();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await api.getMineHistory(mineId, 24);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to load mine history', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [mineId]);

  const activeMine = mines.find((m) => m.mine_id === mineId);
  const isHighRisk = activeMine?.risk_level === 'HIGH';
  const isMedRisk = activeMine?.risk_level === 'MEDIUM';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header & Mine Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('trends.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-0.5">{t('trends.subheading')}</p>
        </div>

        {/* Clean Mine Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[#888888] text-[12px] font-medium">{t('trends.selectMine')}:</span>
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

      {/* Active Mine Status Summary Card */}
      {activeMine && (
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#EFEFEF]">{activeMine.mine_name}</h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                isHighRisk
                  ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                  : isMedRisk
                  ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                  : 'bg-[#4F9067]/15 text-[#4F9067] border-[#4F9067]/30'
              }`}>
                {isHighRisk ? 'High Shortfall Risk' : isMedRisk ? 'Moderate Risk' : 'On Track'}
              </span>
            </div>
            <div className="text-[12px] text-[#888888] mt-1">
              {activeMine.main_reason}
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] border-t sm:border-t-0 sm:border-l border-[#262626] pt-3 sm:pt-0 sm:pl-6">
            <div>
              <div className="text-[#666666] text-[11px]">Monthly Pace</div>
              <div className="text-[#EFEFEF] font-bold text-sm mt-0.5">
                {activeMine.mtd_actual_tonnes.toLocaleString()} / {activeMine.target_tonnes.toLocaleString()} T
              </div>
            </div>
            <div>
              <div className="text-[#666666] text-[11px]">Downtime</div>
              <div className="text-[#EFEFEF] font-bold text-sm mt-0.5">
                {activeMine.equipment_downtime_hrs} h/day
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Time-Series Chart */}
      <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-4 rounded-lg">
        <div className="flex flex-wrap justify-between items-center text-[12px] border-b border-[#242424] pb-3">
          <div className="font-bold text-[#EFEFEF]">24-Month Extraction Trajectory</div>
          <div className="flex items-center gap-4 text-[#888888] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#4F9067] inline-block rounded-sm"></span>
              <span>Actual Production</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#C0BDB8] inline-block"></span>
              <span>Monthly Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#D94F4F] inline-block border-dashed border-t border-[#D94F4F]"></span>
              <span>Shortfall Risk %</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-[13px] text-[#888888] gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Loading history...
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#222222" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#262626' }} />
                <YAxis yAxisId="left" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#262626' }}
                  label={{ value: 'Tonnes (T)', angle: -90, position: 'insideLeft', fill: '#666666', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#262626' }}
                  label={{ value: 'Risk %', angle: 90, position: 'insideRight', fill: '#666666', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', borderRadius: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }} itemStyle={{ color: '#EFEFEF' }} />
                <Bar yAxisId="left" dataKey="actual_tonnes" name="Actual (T)" fill="#4F9067" radius={[2, 2, 0, 0]} maxBarSize={24} />
                <Line yAxisId="left" type="monotone" dataKey="target_tonnes" name="Target (T)" stroke="#C0BDB8" strokeWidth={2} dot={{ r: 2, fill: '#C0BDB8' }} />
                <Line yAxisId="right" type="stepAfter" dataKey="shortfall_probability" name="Shortfall Risk (%)" stroke="#D94F4F" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Audit Table */}
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#242424] bg-[#1C1C1C] font-bold text-[#EFEFEF] text-[13px]">
          Recent Monthly Cycles
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#141414] border-b border-[#242424] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">Month</th>
                <th className="py-2.5 px-4">Actual (T)</th>
                <th className="py-2.5 px-4">Target (T)</th>
                <th className="py-2.5 px-4">Achievement</th>
                <th className="py-2.5 px-4">Outcome</th>
                <th className="py-2.5 px-4">Predicted Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424] text-[#CCCCCC]">
              {history.slice(-8).reverse().map((h, idx) => (
                <tr key={idx} className="hover:bg-[#1C1C1C] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#EFEFEF]">{h.date}</td>
                  <td className="py-2.5 px-4">{h.actual_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4">{h.target_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-medium">{h.achievement_pct}%</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                      h.is_shortfall === 1
                        ? 'bg-[#D94F4F]/15 text-[#D94F4F] border border-[#D94F4F]/30'
                        : 'bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30'
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
