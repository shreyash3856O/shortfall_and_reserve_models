import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, MineRiskSummary, ReserveSummaryItem } from '../api/client';

interface OverviewPageProps {
  onSelectMine: (mineId: string) => void;
}

export default function OverviewPage({ onSelectMine }: OverviewPageProps) {
  const { t } = useTranslation();
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [reserveSummary, setReserveSummary] = useState<ReserveSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [minesRes, reserveRes] = await Promise.all([
          api.getShortfallMines(),
          api.getReserveSummary(),
        ]);
        setMines(minesRes.data);
        setReserveSummary(reserveRes.data);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute aggregate statistics
  const totalActual = mines.reduce((acc, m) => acc + m.mtd_actual_tonnes, 0);
  const totalTarget = mines.reduce((acc, m) => acc + m.target_tonnes, 0);
  const atRiskCount = mines.filter((m) => m.risk_level === 'HIGH' || m.risk_level === 'MEDIUM').length;
  const totalReserveOre = reserveSummary.find((r) => r.zone_id === -1)?.tonnage_mt || 4.781;

  if (isLoading) {
    return (
      <div className="p-8 font-mono text-[12px] text-[#8B949E] flex items-center gap-2">
        <span className="w-2 h-2 bg-[#C8A96E] animate-pulse"></span>
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
          Morning Operational Posture
        </div>
        <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('overview.heading')}</h1>
        <p className="text-[13px] text-[#8B949E] mt-1">{t('overview.subheading')}</p>
      </div>

      {/* Horizontal KPI Strip (No generic card grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#232834] bg-[#12151B] divide-x divide-y md:divide-y-0 divide-[#232834] font-mono">
        <div className="p-4">
          <div className="text-[11px] text-[#8B949E] uppercase tracking-wider">{t('overview.totalReserves')}</div>
          <div className="text-2xl font-bold text-[#E6EDF3] mt-1">{totalReserveOre.toFixed(3)} <span className="text-[12px] text-[#586069] font-normal">MT</span></div>
          <div className="text-[10px] text-[#586069] mt-0.5">Cutoff &gt;=32% Mn</div>
        </div>

        <div className="p-4">
          <div className="text-[11px] text-[#8B949E] uppercase tracking-wider">{t('overview.activeProduction')}</div>
          <div className="text-2xl font-bold text-[#E6EDF3] mt-1">{totalActual.toLocaleString()} <span className="text-[12px] text-[#586069] font-normal">/ {totalTarget.toLocaleString()} T</span></div>
          <div className="text-[10px] text-[#C8A96E] mt-0.5">{((totalActual / Math.max(totalTarget, 1)) * 100).toFixed(1)}% of Target Mandate</div>
        </div>

        <div className="p-4">
          <div className="text-[11px] text-[#8B949E] uppercase tracking-wider">{t('overview.minesAtRisk')}</div>
          <div className={`text-2xl font-bold mt-1 ${atRiskCount > 0 ? 'text-[#D9534F]' : 'text-[#4E9F6E]'}`}>
            {atRiskCount} <span className="text-[12px] text-[#586069] font-normal">/ {mines.length} Units</span>
          </div>
          <div className="text-[10px] text-[#586069] mt-0.5">Model 2 Early-Warning</div>
        </div>

        <div className="p-4">
          <div className="text-[11px] text-[#8B949E] uppercase tracking-wider">{t('overview.modelReliability')}</div>
          <div className="text-2xl font-bold text-[#4E9F6E] mt-1">98.52%</div>
          <div className="text-[10px] text-[#586069] mt-0.5">0.9921 ROC-AUC Metric</div>
        </div>
      </div>

      {/* Production Unit Posture Table */}
      <div className="bg-[#12151B] border border-[#232834]">
        <div className="p-4 border-b border-[#232834] flex justify-between items-center bg-[#161A22]">
          <div className="font-mono text-[12px] font-bold text-[#E6EDF3]">
            {t('overview.allMinesTable')}
          </div>
          <div className="text-[11px] font-mono text-[#8B949E]">
            10 Production Units Monitored
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-[#0E1015] border-b border-[#232834] text-[#8B949E] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Unit ID</th>
                <th className="py-2.5 px-4">Mine Name</th>
                <th className="py-2.5 px-4">Risk Level</th>
                <th className="py-2.5 px-4">Shortfall Proba</th>
                <th className="py-2.5 px-4">Extraction / Target (T)</th>
                <th className="py-2.5 px-4">Daily Extraction</th>
                <th className="py-2.5 px-4">Fleet Downtime</th>
                <th className="py-2.5 px-4">Primary Root Cause</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232834] text-[#E6EDF3]">
              {mines.map((m) => {
                const isHigh = m.risk_level === 'HIGH';
                const isMed = m.risk_level === 'MEDIUM';

                return (
                  <tr key={m.mine_id} className="hover:bg-[#161A22] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#C8A96E]">{m.mine_id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-[#E6EDF3]">{m.mine_name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                          isHigh
                            ? 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                            : isMed
                            ? 'bg-[#E09B3D]/20 text-[#E09B3D] border border-[#E09B3D]/40'
                            : 'bg-[#4E9F6E]/20 text-[#4E9F6E] border border-[#4E9F6E]/40'
                        }`}
                      >
                        {m.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{m.shortfall_probability.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      {m.mtd_actual_tonnes.toLocaleString()} / {m.target_tonnes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{m.daily_avg_tonnes} T/day</td>
                    <td className="py-3 px-4">{m.equipment_downtime_hrs} h/day</td>
                    <td className="py-3 px-4 text-[#8B949E] max-w-xs truncate" title={m.main_reason}>
                      {m.main_reason}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectMine(m.mine_id)}
                        className="bg-[#1D222A] hover:bg-[#232834] border border-[#2E3544] text-[#C8A96E] px-2.5 py-1 text-[10px] font-bold transition-colors"
                      >
                        DIAGNOSE &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
