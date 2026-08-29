import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'boneyard-js/react';
import { api, MineRiskSummary, ReserveSummaryItem } from '../api/client';
import { OverviewSkeleton } from '../components/layout/ViewSkeletons';

interface OverviewPageProps {
  onSelectMine: (mineId: string) => void;
}

export default function OverviewPage({ onSelectMine }: OverviewPageProps) {
  const { t } = useTranslation();
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [reserveSummary, setReserveSummary] = useState<ReserveSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'RISK' | 'OK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickInspectMine, setQuickInspectMine] = useState<MineRiskSummary | null>(null);

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const exportReportCSV = () => {
    const headers = ['Mine ID', 'Mine Name', 'Risk Level', 'Shortfall Proba %', 'MTD Actual (T)', 'Monthly Target (T)', 'Daily Avg (T)', 'Downtime (hrs)', 'Primary Cause'];
    const rows = mines.map((m) => [
      m.mine_id,
      `"${m.mine_name}"`,
      m.risk_level,
      m.shortfall_probability,
      m.mtd_actual_tonnes,
      m.target_tonnes,
      m.daily_avg_tonnes,
      m.equipment_downtime_hrs,
      `"${m.main_reason}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MOIL_MIDAS_Shift_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalActual = mines.reduce((acc, m) => acc + m.mtd_actual_tonnes, 0);
  const totalTarget = mines.reduce((acc, m) => acc + m.target_tonnes, 0);
  const percentAchieved = Math.round((totalActual / Math.max(totalTarget, 1)) * 100);
  const atRiskMines = mines.filter((m) => m.risk_level === 'HIGH' || m.risk_level === 'MEDIUM');
  const onTrackMines = mines.filter((m) => m.risk_level === 'LOW');
  const highRiskCount = mines.filter((m) => m.risk_level === 'HIGH').length;
  const totalReserveOre = reserveSummary.find((r) => r.zone_id === -1)?.tonnage_mt || 4.781;

  const filteredMines = mines.filter((m) => {
    const matchesFilter =
      filterTab === 'RISK' ? m.risk_level === 'HIGH' || m.risk_level === 'MEDIUM' :
      filterTab === 'OK' ? m.risk_level === 'LOW' : true;
    const matchesSearch =
      m.mine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.main_reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Skeleton
      name="overview-dashboard-v3"
      loading={isLoading}
      fallback={<OverviewSkeleton />}
    >
      <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in relative">
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#4F9067]/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-[#C98040]/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header with Live Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[#F5F5F7] tracking-tight">{t('overview.heading')}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067] animate-ping inline-block"></span>
                LIVE SCADA
              </span>
            </div>
            <p className="text-[13px] text-[#888888] mt-0.5">{t('overview.subheading')}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#C0BDB8] hover:text-white px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5 shadow-sm"
              title="Refresh telemetry stream"
            >
              <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#4F9067]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isRefreshing ? t('overview.syncing') : t('overview.syncTelemetry')}</span>
            </button>

            {/* Export Shift Report Button */}
            <button
              onClick={exportReportCSV}
              className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02]"
            >
              <svg className="w-3.5 h-3.5 text-[#C0BDB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('overview.exportCSV')}</span>
            </button>
          </div>
        </div>

        {/* Operational Pulse Bar (Transparent Tile) */}
        <div className="glass-tile-static px-5 py-3 rounded-2xl text-[11px] text-[#888888] flex flex-wrap items-center justify-between gap-3 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#CCCCCC]">
              <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
              <strong>{t('overview.activeShift')}</strong> (06:00 – 14:00)
            </span>
            <span className="text-[#44444A] hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">{t('overview.fleetTelemetry')}: <strong className="text-[#4F9067]">94.2% {t('overview.online')}</strong> (48/51 {t('overview.units')})</span>
            <span className="text-[#44444A] hidden md:inline">&bull;</span>
            <span className="hidden md:inline">Balaghat {t('overview.weather')}: <strong>28&deg;C &bull; 12mm {t('overview.rain')}</strong></span>
          </div>
          <div className="text-[#666666] font-mono text-[10px]">
            WGS-84 &bull; {t('overview.sausarBelt')}
          </div>
        </div>

        {/* 4 Interactive Glass KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Production Progress */}
          <div className="glass-tile p-5 rounded-2xl space-y-3 animate-fade-in-up stagger-1 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#888888] text-[12px] font-medium">
              <span>{t('overview.activeProduction')}</span>
              <span className="text-[#4F9067] font-bold text-[11px] bg-[#4F9067]/15 px-2 py-0.5 rounded-md">
                {percentAchieved}% {t('overview.pace')}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#F5F5F7]">
              {totalActual.toLocaleString()} <span className="text-[13px] text-[#777777] font-normal">/ {totalTarget.toLocaleString()} T</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#3D7852] to-[#4F9067] h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(percentAchieved, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Card 2: Mines Risk */}
          <div className="glass-tile p-5 rounded-2xl space-y-3 animate-fade-in-up stagger-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#888888] text-[12px] font-medium">
              <span>{t('overview.minesAtRisk')}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                atRiskMines.length > 0 ? 'bg-[#C98040]/15 text-[#C98040]' : 'bg-[#4F9067]/15 text-[#4F9067]'
              }`}>
                {atRiskMines.length > 0 ? `${atRiskMines.length} ${t('overview.flagged')}` : t('overview.allClean')}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#F5F5F7]">
              <span className={atRiskMines.length > 0 ? 'text-[#C98040]' : 'text-[#4F9067]'}>
                {atRiskMines.length}
              </span>
              <span className="text-[13px] text-[#777777] font-normal"> of {mines.length} {t('overview.units')}</span>
            </div>
            <div className="text-[11px] text-[#777777] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${highRiskCount > 0 ? 'bg-[#D94F4F]' : 'bg-[#4F9067]'}`}></span>
              <span>{highRiskCount} {t('overview.highRisk')}, {atRiskMines.length - highRiskCount} {t('overview.moderateRisk')}</span>
            </div>
          </div>

          {/* Card 3: Total Reserves */}
          <div className="glass-tile p-5 rounded-2xl space-y-3 animate-fade-in-up stagger-3 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#888888] text-[12px] font-medium">
              <span>{t('overview.totalReserves')}</span>
              <span className="text-[#C0BDB8] font-bold text-[11px] bg-white/[0.08] px-2 py-0.5 rounded-md">
                {t('overview.proved111')}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#F5F5F7]">
              {totalReserveOre.toFixed(3)} <span className="text-[13px] text-[#777777] font-normal">MT</span>
            </div>
            <div className="text-[11px] text-[#777777]">
              {t('overview.krigingMesh')}
            </div>
          </div>

          {/* Card 4: Model Accuracy */}
          <div className="glass-tile p-5 rounded-2xl space-y-3 animate-fade-in-up stagger-4 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#888888] text-[12px] font-medium">
              <span>{t('overview.modelReliability')}</span>
              <span className="text-[#4F9067] font-bold text-[11px] bg-[#4F9067]/15 px-2 py-0.5 rounded-md">
                {t('overview.aucScore')}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#4F9067]">
              98.5%
            </div>
            <div className="text-[11px] text-[#777777]">
              {t('overview.deficitsDetected')}
            </div>
          </div>
        </div>

        {/* High Risk Alert Banner */}
        {highRiskCount > 0 && (
          <div className="bg-gradient-to-r from-[#221212]/80 to-[#181216]/80 backdrop-blur-xl border border-[#482424] p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all shadow-lg animate-fade-in-up stagger-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D94F4F]/20 border border-[#D94F4F]/40 flex items-center justify-center text-[#D94F4F] font-bold text-xs flex-shrink-0">
                !
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#EFEFEF]">
                  {highRiskCount} {t('overview.alertBannerTitle')}
                </div>
                <div className="text-[12px] text-[#A08888]">
                  {t('overview.alertBannerDesc')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setFilterTab('RISK')}
              className="bg-[#2E1818] hover:bg-[#3C1E1E] border border-[#582424] text-[#E5A5A5] px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all flex-shrink-0"
            >
              {t('overview.filterFlagged')}
            </button>
          </div>
        )}

        {/* Mine Production Status Section with Live Search & Filter Tabs */}
        <div className="glass-tile-static rounded-3xl overflow-hidden shadow-xl animate-fade-in-up stagger-5">
          {/* Controls Bar: Search + Tabs */}
          <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-wrap justify-between items-center gap-3 bg-white/[0.02]">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('overview.searchPlaceholder')}
                className="w-full bg-[#121216] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2 text-[12px] text-[#EFEFEF] focus:outline-none focus:border-[#4F9067]/70 placeholder-[#666666] transition-all"
              />
              <svg className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#121216] border border-white/[0.08] p-0.5 rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => setFilterTab('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  filterTab === 'ALL'
                    ? 'bg-white/[0.12] text-white shadow-sm font-bold'
                    : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                {t('overview.allTab')} ({mines.length})
              </button>
              <button
                onClick={() => setFilterTab('RISK')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  filterTab === 'RISK'
                    ? 'bg-[#C98040]/20 text-[#C98040] shadow-sm font-bold'
                    : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                {t('overview.needsAttentionTab')} ({atRiskMines.length})
              </button>
              <button
                onClick={() => setFilterTab('OK')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  filterTab === 'OK'
                    ? 'bg-[#4F9067]/20 text-[#4F9067] shadow-sm font-bold'
                    : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                {t('overview.onTrackTab')} ({onTrackMines.length})
              </button>
            </div>
          </div>

          {/* Mine Rows */}
          <div className="divide-y divide-white/[0.04]">
            {filteredMines.length === 0 ? (
              <div className="p-8 text-center text-[#777777] text-[13px]">
                No production units match your search query &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredMines.map((m, idx) => {
                const isHigh = m.risk_level === 'HIGH';
                const isMed = m.risk_level === 'MEDIUM';
                const minePercent = Math.round((m.mtd_actual_tonnes / Math.max(m.target_tonnes, 1)) * 100);

                return (
                  <div
                    key={m.mine_id}
                    style={{ animationDelay: `${idx * 30}ms` }}
                    className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in-up"
                  >
                    {/* Left: Identity */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-[210px]">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#C0BDB8] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {m.mine_id}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#EFEFEF] flex items-center gap-2">
                          <span>{m.mine_name}</span>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isHigh
                                ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                                : isMed
                                ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                                : 'bg-[#4F9067]/15 text-[#4F9067] border-[#4F9067]/30'
                            }`}
                          >
                            {isHigh ? t('overview.highRisk') : isMed ? t('overview.moderateRisk') : t('overview.onTrack')}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#777777] mt-0.5">
                          {t('common.probability')}: <strong className="text-[#CCCCCC]">{m.shortfall_probability.toFixed(0)}%</strong>
                        </div>
                      </div>
                    </div>

                    {/* Center: Extraction Progress */}
                    <div className="w-full md:w-60 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-[#888888]">
                        <span>{t('overview.extracted')} <strong className="text-[#CCCCCC]">{m.mtd_actual_tonnes.toLocaleString()} T</strong></span>
                        <span>{t('overview.targetLabel')} {m.target_tonnes.toLocaleString()} T</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ease-out ${
                            isHigh ? 'bg-[#D94F4F]' : isMed ? 'bg-[#C98040]' : 'bg-[#4F9067]'
                          }`}
                          style={{ width: `${Math.min(minePercent, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-[#666666] flex justify-between">
                        <span>{m.daily_avg_tonnes} {t('overview.tPerDay')}</span>
                        <span className="font-medium text-[#888888]">{minePercent}% {t('overview.achieved')}</span>
                      </div>
                    </div>

                    {/* Right: Driver & Action */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <div className="text-[11px] text-[#888888] max-w-xs hidden lg:block">
                        <span className="text-[#555555]">{t('overview.driver')} </span>
                        <span>{m.main_reason}</span>
                      </div>

                      {/* Quick Inspect Trigger (Pop-up) */}
                      <button
                        onClick={() => setQuickInspectMine(m)}
                        className="bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-[#A0A0A8] hover:text-white px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all"
                        title="Quick snapshot"
                      >
                        {t('overview.preview')}
                      </button>

                      {/* Full Diagnosis Navigation */}
                      <button
                        onClick={() => onSelectMine(m.mine_id)}
                        className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-[#EFEFEF] px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm hover:scale-[1.02]"
                      >
                        <span>{t('overview.diagnose')}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Inspect Pop-up Modal */}
        {quickInspectMine && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#14141A]/95 border border-white/[0.12] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-pop-up">
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] text-[#C0BDB8] font-bold text-xs flex items-center justify-center">
                    {quickInspectMine.mine_id}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#F5F5F7]">{quickInspectMine.mine_name}</h3>
                    <span className="text-[11px] text-[#777777]">Telemetry Snapshot</span>
                  </div>
                </div>
                <button
                  onClick={() => setQuickInspectMine(null)}
                  className="text-[#888888] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs transition-colors"
                >
                  &times; Close
                </button>
              </div>

              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <span className="text-[#777777]">{t('common.probability')}:</span>
                  <span className="font-bold text-[#EFEFEF]">{quickInspectMine.shortfall_probability}% ({quickInspectMine.risk_level})</span>
                </div>
                <div className="flex justify-between p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <span className="text-[#777777]">{t('common.actual')}:</span>
                  <span className="font-bold text-[#EFEFEF]">{quickInspectMine.mtd_actual_tonnes.toLocaleString()} / {quickInspectMine.target_tonnes.toLocaleString()} T</span>
                </div>
                <div className="flex justify-between p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <span className="text-[#777777]">Equipment Downtime:</span>
                  <span className="font-bold text-[#EFEFEF]">{quickInspectMine.equipment_downtime_hrs} hrs/day</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/[0.05] rounded-xl space-y-1">
                  <div className="text-[11px] text-[#777777] font-semibold uppercase tracking-wider">{t('overview.driver')}</div>
                  <div className="text-[#CCCCCC] leading-relaxed">{quickInspectMine.main_reason}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const id = quickInspectMine.mine_id;
                    setQuickInspectMine(null);
                    onSelectMine(id);
                  }}
                  className="flex-1 bg-[#4F9067] hover:bg-[#3D7852] text-white py-2.5 rounded-xl text-[12px] font-bold transition-all"
                >
                  {t('overview.diagnose')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Skeleton>
  );
}
