import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, ReserveGridBlock, ReservePredictResponse, ReserveSummaryItem } from '../api/client';

export default function ReserveMapPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<ReserveSummaryItem[]>([]);
  const [blocks, setBlocks] = useState<ReserveGridBlock[]>([]);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [page, setPage] = useState(1);
  const [minGradeFilter, setMinGradeFilter] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Point predictor states
  const [easting, setEasting] = useState(430);
  const [northing, setNorthing] = useState(340);
  const [depth, setDepth] = useState(125);
  const [ndvi, setNdvi] = useState(0.48);
  const [moisture, setMoisture] = useState(0.22);
  const [prediction, setPrediction] = useState<ReservePredictResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [sumRes, gridRes] = await Promise.all([
          api.getReserveSummary(),
          api.getReserveGrid(page, 15, minGradeFilter),
        ]);
        setSummary(sumRes.data);
        setBlocks(gridRes.data.blocks);
        setTotalBlocks(gridRes.data.total_blocks);
      } catch (err) {
        console.error('Failed to load reserve map data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [page, minGradeFilter]);

  const handlePredictPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await api.predictReservePoint({ easting, northing, depth_m: depth, ndvi, moisture });
      setPrediction(res);
    } catch (err) {
      console.error('Point prediction failed', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const inputClass = "w-full bg-[#141414] border border-[#2A2A2A] rounded-md px-3 py-2 text-[#EFEFEF] text-[12px] focus:outline-none focus:border-[#444444] transition-colors";

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('reserve.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-0.5">{t('reserve.subheading')}</p>
      </div>

      {/* 3 Clear Deposit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((item) => {
          const isHigh = item.zone_id === 2;
          const isMed = item.zone_id === 1;
          const isTotal = item.zone_id === -1;

          return (
            <div
              key={item.zone_id}
              className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className={`text-[12px] font-bold ${
                  isHigh ? 'text-[#4F9067]' : isMed ? 'text-[#C98040]' : 'text-[#C0BDB8]'
                }`}>
                  {item.zone}
                </span>
                <span className="text-[11px] text-[#777777]">
                  {isHigh ? '&ge;38% Mn' : isMed ? '32-38% Mn' : 'All Grades'}
                </span>
              </div>
              <div className="text-2xl font-bold text-[#EFEFEF]">
                {item.tonnage_mt.toFixed(3)} <span className="text-[13px] text-[#666666] font-normal">Million Tonnes</span>
              </div>
              <div className="pt-2 border-t border-[#242424] text-[#777777] text-[11px] flex justify-between">
                <span>Mean Grade: <strong className="text-[#CCCCCC]">{item.mean_grade_mn_pct.toFixed(1)}% Mn</strong></span>
                <span>Seam: <strong className="text-[#CCCCCC]">{item.mean_thickness_m.toFixed(1)} m</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Estimator Tool + Spatial Block Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Estimator */}
        <div className="lg:col-span-5 bg-[#181818] border border-[#2A2A2A] p-5 space-y-4 rounded-lg">
          <div className="border-b border-[#242424] pb-2.5">
            <h2 className="text-[14px] font-bold text-[#EFEFEF]">{t('reserve.pointInspector')}</h2>
            <p className="text-[11px] text-[#777777] mt-0.5">Enter coordinates to estimate ore grade and thickness</p>
          </div>

          <form onSubmit={handlePredictPoint} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">Easting (m)</label>
                <input type="number" value={easting} onChange={(e) => setEasting(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">Northing (m)</label>
                <input type="number" value={northing} onChange={(e) => setNorthing(Number(e.target.value))} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-[#888888] text-[11px] font-medium mb-1">Drill Depth (m)</label>
              <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">NDVI Index</label>
                <input type="number" step="0.01" value={ndvi} onChange={(e) => setNdvi(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">Moisture Index</label>
                <input type="number" step="0.01" value={moisture} onChange={(e) => setMoisture(Number(e.target.value))} className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className="w-full bg-[#242424] hover:bg-[#2F2F2F] disabled:opacity-40 border border-[#353535] text-[#EFEFEF] py-2.5 rounded-md text-[12px] font-semibold transition-colors mt-2"
            >
              {isPredicting ? 'Calculating...' : 'Run Spatial Estimation &rarr;'}
            </button>
          </form>

          {/* Clean Prediction Result Box */}
          {prediction && (
            <div className="mt-3 p-4 bg-[#141414] border border-[#2A2A2A] rounded-md space-y-2 text-[12px]">
              <div className="flex justify-between items-center border-b border-[#242424] pb-2">
                <span className="text-[#888888] font-medium">Estimated Grade</span>
                <span className="text-[14px] font-bold text-[#EFEFEF]">{prediction.grade_pct.toFixed(2)}% Mn</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>95% Confidence</span>
                <span className="text-[#CCCCCC]">[{prediction.grade_ci_lower.toFixed(1)}% – {prediction.grade_ci_upper.toFixed(1)}%]</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Seam Thickness</span>
                <span className="text-[#CCCCCC]">{prediction.thickness_m.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>100m Block Tonnage</span>
                <span className="text-[#CCCCCC]">{prediction.tonnage_mt_per_100m_block.toFixed(3)} MT</span>
              </div>
              <div className="flex justify-between text-[#888888] pt-1">
                <span>Ore Classification</span>
                <span className="text-[#4F9067] font-bold">{prediction.zone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spatial Block Table */}
        <div className="lg:col-span-7 bg-[#181818] border border-[#2A2A2A] rounded-lg flex flex-col overflow-hidden">
          {/* Table Header & Zone Filters */}
          <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap justify-between items-center gap-3 bg-[#1C1C1C]">
            <div className="text-[13px] font-bold text-[#EFEFEF]">
              Spatial Blocks <span className="text-[#777777] font-normal">({totalBlocks} total)</span>
            </div>
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2E2E2E] p-0.5 rounded-md text-[11px] font-semibold">
              <button
                onClick={() => { setMinGradeFilter(undefined); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  minGradeFilter === undefined ? 'bg-[#282828] text-[#EFEFEF]' : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setMinGradeFilter(32); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  minGradeFilter === 32 ? 'bg-[#282828] text-[#C98040]' : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                &ge;32% Mn
              </button>
              <button
                onClick={() => { setMinGradeFilter(38); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  minGradeFilter === 38 ? 'bg-[#282828] text-[#4F9067]' : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                &ge;38% Mn
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#141414] border-b border-[#242424] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5">Location (E, N)</th>
                  <th className="py-2.5 px-3.5">Depth</th>
                  <th className="py-2.5 px-3.5">Grade</th>
                  <th className="py-2.5 px-3.5">Thickness</th>
                  <th className="py-2.5 px-3.5">Tonnage</th>
                  <th className="py-2.5 px-3.5">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-[#CCCCCC]">
                {blocks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#1C1C1C] transition-colors">
                    <td className="py-2.5 px-3.5 text-[#AAAAAA]">{b.easting.toFixed(0)}m, {b.northing.toFixed(0)}m</td>
                    <td className="py-2.5 px-3.5">{b.depth_m.toFixed(0)}m</td>
                    <td className="py-2.5 px-3.5 font-bold text-[#EFEFEF]">{b.grade_pct.toFixed(1)}% Mn</td>
                    <td className="py-2.5 px-3.5">{b.thickness_m.toFixed(1)}m</td>
                    <td className="py-2.5 px-3.5">{b.tonnage_mt.toFixed(3)} MT</td>
                    <td className="py-2.5 px-3.5">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                        b.zone_id === 2
                          ? 'bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30'
                          : b.zone_id === 1
                          ? 'bg-[#C98040]/15 text-[#C98040] border border-[#C98040]/30'
                          : 'bg-[#D94F4F]/15 text-[#D94F4F] border border-[#D94F4F]/30'
                      }`}>
                        {b.zone_id === 2 ? 'High Grade' : b.zone_id === 1 ? 'Med Grade' : 'Low Grade'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#242424] flex justify-between items-center bg-[#1C1C1C] text-[11px]">
            <span className="text-[#777777]">Page {page} of {Math.ceil(totalBlocks / 15) || 1}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1 bg-[#222222] border border-[#2E2E2E] text-[#888888] rounded disabled:opacity-40 hover:text-[#EFEFEF] transition-colors"
              >
                &larr; Prev
              </button>
              <button
                disabled={page * 15 >= totalBlocks}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 bg-[#222222] border border-[#2E2E2E] text-[#CCCCCC] rounded disabled:opacity-40 hover:text-[#EFEFEF] transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
