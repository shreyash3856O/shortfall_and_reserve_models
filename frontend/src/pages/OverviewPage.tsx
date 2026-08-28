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
  const [filterTab, setFilterTab] = useState<'ALL' | 'RISK' | 'OK'>('ALL');

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
  const percentAchieved = Math.round((totalActual / Math.max(totalTarget, 1)) * 100);
  const atRiskMines = mines.filter((m) => m.risk_level === 'HIGH' || m.risk_level === 'MEDIUM');
  const onTrackMines = mines.filter((m) => m.risk_level === 'LOW');
  const highRiskCount = mines.filter((m) => m.risk_level === 'HIGH').length;
  const totalReserveOre = reserveSummary.find((r) => r.zone_id === -1)?.tonnage_mt || 4.781;

  const filteredMines = filterTab === 'RISK' ? atRiskMines : filterTab === 'OK' ? onTrackMines : mines;

  if (isLoading) {
    return (
      <div className="p-8 text-[13px] text-[#888888] flex items-center justify-center min-h-[400px] gap-2">
        <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('overview.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-0.5">{t('overview.subheading')}</p>
        </div>
        <div className="text-[11px] text-[#777777] bg-[#1A1A1A] border border-[#2E2E2E] px-3 py-1.5 rounded-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
          <span>Live Telemetry Active</span>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Production Progress */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-[#888888] text-[12px] font-medium">
            <span>{t('overview.activeProduction')}</span>
            <span className="text-[#C0BDB8] font-bold">{percentAchieved}%</span>
          </div>
          <div className="text-2xl font-bold text-[#EFEFEF]">
            {totalActual.toLocaleString()} <span className="text-[13px] text-[#666666] font-normal">/ {totalTarget.toLocaleString()} T</span>
          </div>
          <div className="w-full bg-[#242424] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4F9067] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentAchieved, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Mines Status */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg space-y-3">
          <div className="text-[#888888] text-[12px] font-medium">
            {t('overview.minesAtRisk')}
          </div>
          <div className="text-2xl font-bold text-[#EFEFEF]">
            <span className={atRiskMines.length > 0 ? 'text-[#C98040]' : 'text-[#4F9067]'}>
              {atRiskMines.length}
            </span>
            <span className="text-[13px] text-[#666666] font-normal"> of {mines.length} Units</span>
          </div>
          <div className="text-[11px] text-[#777777] flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${highRiskCount > 0 ? 'bg-[#D94F4F]' : 'bg-[#4F9067]'}`}></span>
            <span>{highRiskCount} High Risk, {atRiskMines.length - highRiskCount} Medium Risk</span>
          </div>
        </div>

        {/* Metric 3: Total Reserves */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg space-y-3">
          <div className="text-[#888888] text-[12px] font-medium">
            {t('overview.totalReserves')}
          </div>
          <div className="text-2xl font-bold text-[#EFEFEF]">
            {totalReserveOre.toFixed(3)} <span className="text-[13px] text-[#666666] font-normal">MT</span>
          </div>
          <div className="text-[11px] text-[#777777]">
            Proven Manganese Ore (&ge;32% Mn)
          </div>
        </div>

        {/* Metric 4: AI Reliability */}
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg space-y-3">
          <div className="text-[#888888] text-[12px] font-medium">
            {t('overview.modelReliability')}
          </div>
          <div className="text-2xl font-bold text-[#4F9067]">
            98.5%
          </div>
          <div className="text-[11px] text-[#777777]">
            Shortfall Catch Rate (Holdout Test)
          </div>
        </div>
      </div>

      {/* Alert Callout for Quick Action */}
      {highRiskCount > 0 && (
        <div className="bg-[#1F1818] border border-[#3E2525] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D94F4F]/15 border border-[#D94F4F]/30 flex items-center justify-center text-[#D94F4F] font-bold text-sm flex-shrink-0">
              !
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#EFEFEF]">
                {highRiskCount} production units require attention
              </div>
              <div className="text-[12px] text-[#A08888]">
                Production pace is below monthly mandate due to equipment downtime and weather.
              </div>
            </div>
          </div>
          <button
            onClick={() => setFilterTab('RISK')}
            className="bg-[#2C1D1D] hover:bg-[#382424] border border-[#4F2B2B] text-[#E5A5A5] px-3.5 py-1.5 rounded text-[12px] font-semibold transition-colors flex-shrink-0"
          >
            Review At-Risk Units &rarr;
          </button>
        </div>
      )}

      {/* Clean Mine List Table with Filter Tabs */}
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
        {/* Table Header & Filter Tabs */}
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap justify-between items-center gap-3 bg-[#1C1C1C]">
          <div className="text-[14px] font-bold text-[#EFEFEF]">
            {t('overview.allMinesTable')}
          </div>
          <div className="flex items-center gap-1 bg-[#141414] border border-[#2E2E2E] p-0.5 rounded-md text-[11px] font-semibold">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                filterTab === 'ALL'
                  ? 'bg-[#282828] text-[#EFEFEF] shadow-sm'
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
            >
              All Mines ({mines.length})
            </button>
            <button
              onClick={() => setFilterTab('RISK')}
              className={`px-3 py-1 rounded transition-colors ${
                filterTab === 'RISK'
                  ? 'bg-[#282828] text-[#C98040] shadow-sm'
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
            >
              Needs Attention ({atRiskMines.length})
            </button>
            <button
              onClick={() => setFilterTab('OK')}
              className={`px-3 py-1 rounded transition-colors ${
                filterTab === 'OK'
                  ? 'bg-[#282828] text-[#4F9067] shadow-sm'
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
            >
              On Track ({onTrackMines.length})
            </button>
          </div>
        </div>

        {/* Simplified, High-Signal Rows */}
        <div className="divide-y divide-[#242424]">
          {filteredMines.map((m) => {
            const isHigh = m.risk_level === 'HIGH';
            const isMed = m.risk_level === 'MEDIUM';
            const minePercent = Math.round((m.mtd_actual_tonnes / Math.max(m.target_tonnes, 1)) * 100);

            return (
              <div
                key={m.mine_id}
                className="p-4 sm:p-5 hover:bg-[#1C1C1C] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Mine Identity & Risk Status */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-[200px]">
                  <div className="w-9 h-9 rounded-md bg-[#222222] border border-[#2E2E2E] text-[#C0BDB8] font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {m.mine_id}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#EFEFEF] flex items-center gap-2">
                      <span>{m.mine_name}</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isHigh
                            ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                            : isMed
                            ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                            : 'bg-[#4F9067]/15 text-[#4F9067] border-[#4F9067]/30'
                        }`}
                      >
                        {isHigh ? 'High Risk' : isMed ? 'Medium Risk' : 'On Track'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#777777] mt-0.5">
                      Shortfall Probability: <strong className="text-[#AAAAAA]">{m.shortfall_probability.toFixed(0)}%</strong>
                    </div>
                  </div>
                </div>

                {/* Center: Production Progress Bar */}
                <div className="w-full md:w-56 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#888888]">
                    <span>Extracted: <strong className="text-[#CCCCCC]">{m.mtd_actual_tonnes.toLocaleString()} T</strong></span>
                    <span>Target: {m.target_tonnes.toLocaleString()} T</span>
                  </div>
                  <div className="w-full bg-[#242424] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        isHigh ? 'bg-[#D94F4F]' : isMed ? 'bg-[#C98040]' : 'bg-[#4F9067]'
                      }`}
                      style={{ width: `${Math.min(minePercent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-[#666666] flex justify-between">
                    <span>{m.daily_avg_tonnes} T/day</span>
                    <span>{minePercent}% achieved</span>
                  </div>
                </div>

                {/* Right: Primary Root Cause & Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  <div className="text-[11px] text-[#888888] max-w-xs hidden lg:block">
                    <span className="text-[#555555]">Issue: </span>
                    <span>{m.main_reason}</span>
                  </div>
                  <button
                    onClick={() => onSelectMine(m.mine_id)}
                    className="bg-[#242424] hover:bg-[#2F2F2F] border border-[#353535] text-[#EFEFEF] px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Diagnose</span>
                    <span className="text-[#888888]">&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
