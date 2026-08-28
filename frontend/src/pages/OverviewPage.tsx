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

  const totalActual = mines.reduce((acc, m) => acc + m.mtd_actual_tonnes, 0);
  const totalTarget = mines.reduce((acc, m) => acc + m.target_tonnes, 0);
  const atRiskCount = mines.filter((m) => m.risk_level === 'HIGH' || m.risk_level === 'MEDIUM').length;
  const totalReserveOre = reserveSummary.find((r) => r.zone_id === -1)?.tonnage_mt || 4.781;

  if (isLoading) {
    return (
      <div className="p-8 text-[13px] text-[#888888] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">
          Morning Operational Posture
        </div>
        <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('overview.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-1">{t('overview.subheading')}</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#2E2E2E] bg-[#1A1A1A] rounded-lg overflow-hidden divide-x divide-y md:divide-y-0 divide-[#2E2E2E]">
        <div className="p-5">
          <div className="text-[11px] text-[#777777] font-semibold uppercase tracking-wider">{t('overview.totalReserves')}</div>
          <div className="text-2xl font-bold text-[#EFEFEF] mt-1">{totalReserveOre.toFixed(3)} <span className="text-[13px] text-[#555555] font-normal">MT</span></div>
          <div className="text-[11px] text-[#555555] mt-0.5">Cutoff &ge;32% Mn</div>
        </div>
        <div className="p-5">
          <div className="text-[11px] text-[#777777] font-semibold uppercase tracking-wider">{t('overview.activeProduction')}</div>
          <div className="text-2xl font-bold text-[#EFEFEF] mt-1">{totalActual.toLocaleString()} <span className="text-[13px] text-[#555555] font-normal">/ {totalTarget.toLocaleString()} T</span></div>
          <div className="text-[11px] text-[#C0BDB8] font-medium mt-0.5">{((totalActual / Math.max(totalTarget, 1)) * 100).toFixed(1)}% of Target Mandate</div>
        </div>
        <div className="p-5">
          <div className="text-[11px] text-[#777777] font-semibold uppercase tracking-wider">{t('overview.minesAtRisk')}</div>
          <div className={`text-2xl font-bold mt-1 ${atRiskCount > 0 ? 'text-[#D94F4F]' : 'text-[#4F9067]'}`}>
            {atRiskCount} <span className="text-[13px] text-[#555555] font-normal">/ {mines.length} Units</span>
          </div>
          <div className="text-[11px] text-[#555555] mt-0.5">Model 2 Early-Warning</div>
        </div>
        <div className="p-5">
          <div className="text-[11px] text-[#777777] font-semibold uppercase tracking-wider">{t('overview.modelReliability')}</div>
          <div className="text-2xl font-bold text-[#4F9067] mt-1">98.52%</div>
          <div className="text-[11px] text-[#555555] mt-0.5">0.9921 ROC-AUC Metric</div>
        </div>
      </div>

      {/* Mines Table */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2E2E2E] flex justify-between items-center bg-[#1E1E1E]">
          <div className="text-[13px] font-bold text-[#EFEFEF]">
            {t('overview.allMinesTable')}
          </div>
          <div className="text-[12px] text-[#777777] font-medium">
            10 Production Units Monitored
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#161616] border-b border-[#2E2E2E] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Unit ID</th>
                <th className="py-3 px-4">Mine Name</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Shortfall Proba</th>
                <th className="py-3 px-4">Extraction / Target (T)</th>
                <th className="py-3 px-4">Daily Extraction</th>
                <th className="py-3 px-4">Fleet Downtime</th>
                <th className="py-3 px-4">Primary Root Cause</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E] text-[#CCCCCC]">
              {mines.map((m) => {
                const isHigh = m.risk_level === 'HIGH';
                const isMed = m.risk_level === 'MEDIUM';
                return (
                  <tr key={m.mine_id} className="hover:bg-[#1E1E1E] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#C0BDB8]">{m.mine_id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#EFEFEF]">{m.mine_name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        isHigh
                          ? 'bg-[#D94F4F]/10 text-[#D94F4F] border border-[#D94F4F]/30'
                          : isMed
                          ? 'bg-[#C98040]/10 text-[#C98040] border border-[#C98040]/30'
                          : 'bg-[#4F9067]/10 text-[#4F9067] border border-[#4F9067]/30'
                      }`}>
                        {m.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{m.shortfall_probability.toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-[#AAAAAA]">
                      {m.mtd_actual_tonnes.toLocaleString()} / {m.target_tonnes.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">{m.daily_avg_tonnes} T/day</td>
                    <td className="py-3.5 px-4">{m.equipment_downtime_hrs} h/day</td>
                    <td className="py-3.5 px-4 text-[#888888] max-w-xs truncate" title={m.main_reason}>
                      {m.main_reason}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectMine(m.mine_id)}
                        className="bg-[#242424] hover:bg-[#2E2E2E] border border-[#3A3A3A] text-[#C0BDB8] px-3 py-1 rounded text-[11px] font-semibold transition-all"
                      >
                        Diagnose &rarr;
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
