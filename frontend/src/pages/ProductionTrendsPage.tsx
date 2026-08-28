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

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Mine Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
            Production Time Series (Model 2)
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('trends.heading')}</h1>
          <p className="text-[13px] text-[#8B949E] mt-1">{t('trends.subheading')}</p>
        </div>

        {/* Mine Selector Dropdown */}
        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span className="text-[#8B949E]">{t('trends.selectMine')}:</span>
          <select
            value={mineId}
            onChange={(e) => setMineId(e.target.value)}
            className="bg-[#12151B] border border-[#232834] text-[#C8A96E] px-3 py-1.5 font-bold focus:outline-none focus:border-[#C8A96E]"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>
                {m.mine_id} — {m.mine_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Time-Series Chart */}
      <div className="bg-[#12151B] border border-[#232834] p-5 space-y-4 font-mono">
        <div className="flex flex-wrap justify-between items-center text-[11px] border-b border-[#232834] pb-3">
          <div className="font-bold text-[#E6EDF3]">
            ACTUAL EXTRACTION VS TARGET MANDATE (24-MONTH TRAJECTORY)
          </div>
          <div className="flex items-center gap-4 text-[#8B949E]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#4E9F6E] inline-block"></span>
              <span>Actual Tonnes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#8B949E] inline-block"></span>
              <span>Target Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#D9534F] inline-block"></span>
              <span>Shortfall Risk Probability (%)</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-[12px] text-[#8B949E]">
            Loading historical operational trajectory...
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#1E232F" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#586069"
                  tick={{ fill: '#8B949E', fontSize: 10 }}
                  tickLine={{ stroke: '#232834' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#586069"
                  tick={{ fill: '#8B949E', fontSize: 10 }}
                  tickLine={{ stroke: '#232834' }}
                  label={{ value: 'Tonnes (T)', angle: -90, position: 'insideLeft', fill: '#8B949E', fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  stroke="#586069"
                  tick={{ fill: '#D9534F', fontSize: 10 }}
                  tickLine={{ stroke: '#232834' }}
                  label={{ value: 'Risk %', angle: 90, position: 'insideRight', fill: '#D9534F', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12151B',
                    borderColor: '#232834',
                    borderRadius: '2px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#E6EDF3' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="actual_tonnes"
                  name="Actual (T)"
                  fill="#4E9F6E"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={28}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="target_tonnes"
                  name="Target (T)"
                  stroke="#C8A96E"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#C8A96E' }}
                />
                <Line
                  yAxisId="right"
                  type="stepAfter"
                  dataKey="shortfall_probability"
                  name="Shortfall Probability (%)"
                  stroke="#D9534F"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Audit Table */}
      <div className="bg-[#12151B] border border-[#232834] font-mono text-[11px]">
        <div className="p-4 border-b border-[#232834] bg-[#161A22] font-bold text-[#E6EDF3]">
          MONTHLY PERFORMANCE &amp; SHORTFALL LOGS
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0E1015] border-b border-[#232834] text-[#8B949E] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Cycle</th>
                <th className="py-2.5 px-4">Actual (T)</th>
                <th className="py-2.5 px-4">Target (T)</th>
                <th className="py-2.5 px-4">Achievement</th>
                <th className="py-2.5 px-4">Shortfall Event</th>
                <th className="py-2.5 px-4">Model Predicted Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232834] text-[#E6EDF3]">
              {history.slice(-12).reverse().map((h, idx) => (
                <tr key={idx} className="hover:bg-[#161A22] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#C8A96E]">{h.date}</td>
                  <td className="py-2.5 px-4">{h.actual_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4">{h.target_tonnes.toLocaleString()}</td>
                  <td className="py-2.5 px-4">{h.achievement_pct}%</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-bold ${
                        h.is_shortfall === 1
                          ? 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                          : 'bg-[#4E9F6E]/20 text-[#4E9F6E] border border-[#4E9F6E]/40'
                      }`}
                    >
                      {h.is_shortfall === 1 ? 'DEFICIT' : 'TARGET MET'}
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
