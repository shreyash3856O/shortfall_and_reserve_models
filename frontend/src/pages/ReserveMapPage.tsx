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

  // Point predictor form states
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
          api.getReserveGrid(page, 20, minGradeFilter),
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
      const res = await api.predictReservePoint({
        easting,
        northing,
        depth_m: depth,
        ndvi,
        moisture,
      });
      setPrediction(res);
    } catch (err) {
      console.error('Point prediction failed', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
          Geological Reserve Model (Model 1)
        </div>
        <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('reserve.heading')}</h1>
        <p className="text-[13px] text-[#8B949E] mt-1">{t('reserve.subheading')}</p>
      </div>

      {/* Zone Summary Rollup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-[11px]">
        {summary.map((item) => {
          const isTotal = item.zone_id === -1;
          const isGreen = item.zone_id === 2;
          const isYellow = item.zone_id === 1;

          return (
            <div
              key={item.zone_id}
              className={`p-4 border bg-[#12151B] ${
                isTotal
                  ? 'border-[#C8A96E]/50'
                  : isGreen
                  ? 'border-[#3D8C5A]/50'
                  : isYellow
                  ? 'border-[#C4A238]/50'
                  : 'border-[#232834]'
              }`}
            >
              <div className="text-[#8B949E] uppercase tracking-wider text-[10px]">{item.zone}</div>
              <div className="text-2xl font-bold text-[#E6EDF3] mt-1">
                {item.tonnage_mt.toFixed(3)} <span className="text-[12px] text-[#586069]">MT</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#232834] text-[#8B949E] space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span>Mean Ore Grade:</span>
                  <span className="text-[#E6EDF3]">{item.mean_grade_mn_pct.toFixed(2)}% Mn</span>
                </div>
                <div className="flex justify-between">
                  <span>Mean Thickness:</span>
                  <span className="text-[#E6EDF3]">{item.mean_thickness_m.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Area:</span>
                  <span>{item.area_km2.toFixed(4)} km²</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Point Predictor vs Spatial Grid Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Point Coordinate Estimator */}
        <div className="lg:col-span-4 bg-[#12151B] border border-[#232834] p-5 space-y-4 font-mono text-[11px]">
          <div className="border-b border-[#232834] pb-2 text-[12px] font-bold text-[#C8A96E]">
            [1] {t('reserve.pointInspector')}
          </div>
          <form onSubmit={handlePredictPoint} className="space-y-3">
            <div>
              <label className="block text-[#8B949E] mb-1">EASTING (0-1200 m):</label>
              <input
                type="number"
                value={easting}
                onChange={(e) => setEasting(Number(e.target.value))}
                className="w-full bg-[#0B0D10] border border-[#232834] px-3 py-1.5 text-[#E6EDF3]"
              />
            </div>
            <div>
              <label className="block text-[#8B949E] mb-1">NORTHING (0-800 m):</label>
              <input
                type="number"
                value={northing}
                onChange={(e) => setNorthing(Number(e.target.value))}
                className="w-full bg-[#0B0D10] border border-[#232834] px-3 py-1.5 text-[#E6EDF3]"
              />
            </div>
            <div>
              <label className="block text-[#8B949E] mb-1">DRILL DEPTH (m):</label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full bg-[#0B0D10] border border-[#232834] px-3 py-1.5 text-[#E6EDF3]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#8B949E] mb-1">NDVI (0-1):</label>
                <input
                  type="number"
                  step="0.01"
                  value={ndvi}
                  onChange={(e) => setNdvi(Number(e.target.value))}
                  className="w-full bg-[#0B0D10] border border-[#232834] px-2 py-1.5 text-[#E6EDF3]"
                />
              </div>
              <div>
                <label className="block text-[#8B949E] mb-1">NDMI (0-1):</label>
                <input
                  type="number"
                  step="0.01"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full bg-[#0B0D10] border border-[#232834] px-2 py-1.5 text-[#E6EDF3]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full bg-[#1D222A] hover:bg-[#232834] border border-[#2E3544] text-[#C8A96E] py-2 font-bold tracking-wider transition-colors"
            >
              {isPredicting ? 'ESTIMATING KRIGING RESIDUALS...' : 'RUN SPATIAL REGRESSION &rarr;'}
            </button>
          </form>

          {/* Prediction Result Display */}
          {prediction && (
            <div className="mt-4 p-3 bg-[#161A22] border border-[#2E3544] space-y-1.5">
              <div className="text-[#C8A96E] font-bold border-b border-[#232834] pb-1">
                PREDICTION RESULT
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Ore Grade:</span>
                <span className="text-[#E6EDF3] font-bold">{prediction.grade_pct.toFixed(2)}% Mn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">95% CI:</span>
                <span>[{prediction.grade_ci_lower.toFixed(1)}% - {prediction.grade_ci_upper.toFixed(1)}%]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Seam Thickness:</span>
                <span className="text-[#E6EDF3]">{prediction.thickness_m.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">100m Block Tonnage:</span>
                <span className="text-[#E6EDF3]">{prediction.tonnage_mt_per_100m_block.toFixed(3)} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Classification:</span>
                <span className="text-[#C8A96E] font-bold">{prediction.zone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Spatial Block Grid Table */}
        <div className="lg:col-span-8 bg-[#12151B] border border-[#232834] flex flex-col font-mono text-[11px]">
          <div className="p-4 border-b border-[#232834] flex flex-wrap justify-between items-center gap-3 bg-[#161A22]">
            <div className="font-bold text-[#E6EDF3]">
              [2] 100x100m Spatial Block Grid ({totalBlocks} blocks)
            </div>
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 text-[10px]">
              <button
                onClick={() => { setMinGradeFilter(undefined); setPage(1); }}
                className={`px-2 py-1 border ${
                  minGradeFilter === undefined
                    ? 'bg-[#232834] text-[#C8A96E] border-[#2E3544]'
                    : 'bg-[#12151B] text-[#8B949E] border-[#232834]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setMinGradeFilter(32); setPage(1); }}
                className={`px-2 py-1 border ${
                  minGradeFilter === 32
                    ? 'bg-[#232834] text-[#C8A96E] border-[#2E3544]'
                    : 'bg-[#12151B] text-[#8B949E] border-[#232834]'
                }`}
              >
                &gt;=32% Mn
              </button>
              <button
                onClick={() => { setMinGradeFilter(38); setPage(1); }}
                className={`px-2 py-1 border ${
                  minGradeFilter === 38
                    ? 'bg-[#232834] text-[#C8A96E] border-[#2E3544]'
                    : 'bg-[#12151B] text-[#8B949E] border-[#232834]'
                }`}
              >
                &gt;=38% Mn
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-[#0E1015] border-b border-[#232834] text-[#8B949E] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Easting</th>
                  <th className="py-2.5 px-3">Northing</th>
                  <th className="py-2.5 px-3">Depth</th>
                  <th className="py-2.5 px-3">Grade % Mn</th>
                  <th className="py-2.5 px-3">Thickness</th>
                  <th className="py-2.5 px-3">Tonnage</th>
                  <th className="py-2.5 px-3">Zone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232834] text-[#E6EDF3]">
                {blocks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#161A22] transition-colors">
                    <td className="py-2 px-3">{b.easting.toFixed(0)}m</td>
                    <td className="py-2 px-3">{b.northing.toFixed(0)}m</td>
                    <td className="py-2 px-3">{b.depth_m.toFixed(0)}m</td>
                    <td className="py-2 px-3 font-bold text-[#C8A96E]">{b.grade_pct.toFixed(2)}%</td>
                    <td className="py-2 px-3">{b.thickness_m.toFixed(2)}m</td>
                    <td className="py-2 px-3">{b.tonnage_mt.toFixed(3)} MT</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[9px] font-bold ${
                          b.zone_id === 2
                            ? 'bg-[#3D8C5A]/20 text-[#3D8C5A] border border-[#3D8C5A]/40'
                            : b.zone_id === 1
                            ? 'bg-[#C4A238]/20 text-[#C4A238] border border-[#C4A238]/40'
                            : 'bg-[#B84343]/20 text-[#B84343] border border-[#B84343]/40'
                        }`}
                      >
                        {b.zone_id === 2 ? 'HIGH >=38%' : b.zone_id === 1 ? 'MED 32-38%' : 'LOW <32%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#232834] flex justify-between items-center bg-[#161A22] text-[10px]">
            <span className="text-[#8B949E]">
              Showing page {page} of {Math.ceil(totalBlocks / 20) || 1}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-1 bg-[#12151B] border border-[#232834] text-[#8B949E] disabled:opacity-40"
              >
                &larr; PREV
              </button>
              <button
                disabled={page * 20 >= totalBlocks}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-1 bg-[#12151B] border border-[#232834] text-[#E6EDF3] disabled:opacity-40"
              >
                NEXT &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
