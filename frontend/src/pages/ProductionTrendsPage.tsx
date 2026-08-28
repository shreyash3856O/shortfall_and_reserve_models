import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'boneyard-js/react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, MineHistoryRecord, MineRiskSummary } from '../api/client';
import { TrendsSkeleton } from '../components/layout/ViewSkeletons';

interface ProductionTrendsPageProps {
  selectedMineId?: string;
}

export default function ProductionTrendsPage({ selectedMineId = 'MN01' }: ProductionTrendsPageProps) {
  const { t } = useTranslation();
  const [mineId, setMineId] = useState(selectedMineId);
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [history, setHistory] = useState<MineHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<12 | 24>(24);

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
        const res = await api.getMineHistory(mineId, timeRange);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to load mine history', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [mineId, timeRange]);

  const activeMine = mines.find((m) => m.mine_id === mineId);
  const isHighRisk = activeMine?.risk_level === 'HIGH';
  const isMedRisk = activeMine?.risk_level === 'MEDIUM';

  return (
    <Skeleton
      name="production-trends"
      loading={isLoading && history.length === 0}
      fallback={<TrendsSkeleton />}
    >
      <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
        {/* Header & Mine Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#EFEFEF] tracking-tight">{t('trends.heading')}</h1>
            <p className="text-[13px] text-[#888888] mt-0.5">{t('trends.subheading')}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Timeframe Filter */}
            <div className="flex items-center bg-[#121215] border border-[#24242A] p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setTimeRange(12)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeRange === 12 ? 'bg-[#222228] text-white shadow-sm' : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                12 Mo
              </button>
              <button
                onClick={() => setTimeRange(24)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeRange === 24 ? 'bg-[#222228] text-white shadow-sm' : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                24 Mo
              </button>
            </div>

            {/* Mine Selector Dropdown */}
            <select
              value={mineId}
              onChange={(e) => setMineId(e.target.value)}
              className="bg-[#16161A] border border-[#24242A] text-[#EFEFEF] px-3 py-1.5 rounded-lg font-semibold text-[13px] focus:outline-none focus:border-[#4F9067]/60 transition-colors shadow-sm"
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
          <div className="bg-[#16161A] border border-[#24242A] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-fade-in-up stagger-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-[#EFEFEF]">{activeMine.mine_name}</h2>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
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

            <div className="flex items-center gap-6 text-[12px] border-t sm:border-t-0 sm:border-l border-[#222228] pt-3 sm:pt-0 sm:pl-6">
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
        <div className="bg-[#16161A] border border-[#24242A] p-5 space-y-4 rounded-2xl shadow-sm animate-fade-in-up stagger-2">
          <div className="flex flex-wrap justify-between items-center text-[12px] border-b border-[#222228] pb-3">
            <div className="font-bold text-[#EFEFEF]">{timeRange}-Month Extraction Trajectory</div>
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

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#202026" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#222228' }} />
                <YAxis yAxisId="left" stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#222228' }}
                  label={{ value: 'Tonnes (T)', angle: -90, position: 'insideLeft', fill: '#666666', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#333333" tick={{ fill: '#666666', fontSize: 10 }} tickLine={{ stroke: '#222228' }}
                  label={{ value: 'Risk %', angle: 90, position: 'insideRight', fill: '#666666', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#16161A', borderColor: '#26262E', borderRadius: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px' }} itemStyle={{ color: '#EFEFEF' }} />
                <Bar yAxisId="left" dataKey="actual_tonnes" name="Actual (T)" fill="#4F9067" radius={[2, 2, 0, 0]} maxBarSize={24} />
                <Line yAxisId="left" type="monotone" dataKey="target_tonnes" name="Target (T)" stroke="#C0BDB8" strokeWidth={2} dot={{ r: 2, fill: '#C0BDB8' }} />
                <Line yAxisId="right" type="stepAfter" dataKey="shortfall_probability" name="Shortfall Risk (%)" stroke="#D94F4F" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Audit Table */}
        <div className="bg-[#16161A] border border-[#24242A] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up stagger-3">
          <div className="p-4 border-b border-[#222228] bg-[#18181D] font-bold text-[#EFEFEF] text-[13px]">
            Recent Monthly Cycles
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#121215] border-b border-[#222228] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Month</th>
                  <th className="py-2.5 px-4">Actual (T)</th>
                  <th className="py-2.5 px-4">Target (T)</th>
                  <th className="py-2.5 px-4">Achievement</th>
                  <th className="py-2.5 px-4">Outcome</th>
                  <th className="py-2.5 px-4">Predicted Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202026] text-[#CCCCCC]">
                {history.slice(-8).reverse().map((h, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A20] transition-colors">
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
    </Skeleton>
  );
}
