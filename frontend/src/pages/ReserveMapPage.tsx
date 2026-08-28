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
      const res = await api.predictReservePoint({ easting, northing, depth_m: depth, ndvi, moisture });
      setPrediction(res);
    } catch (err) {
      console.error('Point prediction failed', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const inputClass = "w-full bg-[#111111] border border-[#2E2E2E] rounded px-3 py-2 text-[#EFEFEF] text-[12px] focus:outline-none focus:border-[#4A4A4A] transition-colors";

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">
          Geological Reserve Model (Model 1)
        </div>
        <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('reserve.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-1">{t('reserve.subheading')}</p>
      </div>

      {/* Zone Rollup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#2E2E2E] bg-[#1A1A1A] rounded-lg overflow-hidden divide-x divide-y lg:divide-y-0 divide-[#2E2E2E]">
        {summary.map((item) => (
          <div key={item.zone_id} className="p-5">
            <div className={`text-[11px] font-semibold uppercase tracking-wider ${
              item.zone_id === 2 ? 'text-[#4F9067]' : item.zone_id === 1 ? 'text-[#C98040]' : item.zone_id === -1 ? 'text-[#C0BDB8]' : 'text-[#D94F4F]'
            }`}>
              {item.zone}
            </div>
            <div className="text-2xl font-bold text-[#EFEFEF] mt-1">
              {item.tonnage_mt.toFixed(3)} <span className="text-[13px] text-[#555555] font-normal">MT</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#2E2E2E] text-[#777777] space-y-1 text-[11px]">
              <div className="flex justify-between"><span>Mean Grade:</span><span className="text-[#EFEFEF] font-medium">{item.mean_grade_mn_pct.toFixed(2)}% Mn</span></div>
              <div className="flex justify-between"><span>Thickness:</span><span className="text-[#EFEFEF] font-medium">{item.mean_thickness_m.toFixed(2)} m</span></div>
              <div className="flex justify-between"><span>Area:</span><span>{item.area_km2.toFixed(4)} km&sup2;</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Point Estimator */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#2E2E2E] p-5 space-y-4 rounded-lg">
          <div className="border-b border-[#2E2E2E] pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0BDB8]"></span>
            <span className="text-[13px] font-bold text-[#EFEFEF]">{t('reserve.pointInspector')}</span>
          </div>
          <form onSubmit={handlePredictPoint} className="space-y-3">
            <div>
              <label className="block text-[#888888] text-[11px] font-medium mb-1">Easting (0–1200 m)</label>
              <input type="number" value={easting} onChange={(e) => setEasting(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-[#888888] text-[11px] font-medium mb-1">Northing (0–800 m)</label>
              <input type="number" value={northing} onChange={(e) => setNorthing(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-[#888888] text-[11px] font-medium mb-1">Drill Depth (m)</label>
              <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">NDVI (0–1)</label>
                <input type="number" step="0.01" value={ndvi} onChange={(e) => setNdvi(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[#888888] text-[11px] font-medium mb-1">NDMI (0–1)</label>
                <input type="number" step="0.01" value={moisture} onChange={(e) => setMoisture(Number(e.target.value))} className={inputClass} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full bg-[#252525] hover:bg-[#303030] disabled:opacity-40 border border-[#3A3A3A] text-[#EFEFEF] py-2.5 rounded text-[12px] font-bold tracking-wide transition-all"
            >
              {isPredicting ? 'Running Spatial Regression...' : 'Run Spatial Regression &rarr;'}
            </button>
          </form>

          {prediction && (
            <div className="mt-2 p-4 bg-[#161616] border border-[#2E2E2E] rounded-lg space-y-2 text-[12px]">
              <div className="text-[11px] font-semibold text-[#C0BDB8] uppercase tracking-wider border-b border-[#2E2E2E] pb-1.5 mb-1.5">
                Estimation Result
              </div>
              <div className="flex justify-between text-[#AAAAAA]"><span className="text-[#777777]">Ore Grade:</span><span className="text-[#EFEFEF] font-bold">{prediction.grade_pct.toFixed(2)}% Mn</span></div>
              <div className="flex justify-between text-[#AAAAAA]"><span className="text-[#777777]">95% CI:</span><span>[{prediction.grade_ci_lower.toFixed(1)}% &ndash; {prediction.grade_ci_upper.toFixed(1)}%]</span></div>
              <div className="flex justify-between text-[#AAAAAA]"><span className="text-[#777777]">Thickness:</span><span className="text-[#EFEFEF] font-medium">{prediction.thickness_m.toFixed(2)} m</span></div>
              <div className="flex justify-between text-[#AAAAAA]"><span className="text-[#777777]">Block Tonnage:</span><span className="text-[#EFEFEF] font-medium">{prediction.tonnage_mt_per_100m_block.toFixed(3)} MT</span></div>
              <div className="flex justify-between text-[#AAAAAA]"><span className="text-[#777777]">Zone:</span><span className="text-[#4F9067] font-bold">{prediction.zone}</span></div>
            </div>
          )}
        </div>

        {/* Grid Table */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#2E2E2E] flex flex-wrap justify-between items-center gap-3 bg-[#1E1E1E]">
            <div className="text-[13px] font-bold text-[#EFEFEF]">
              100&times;100m Spatial Block Grid <span className="text-[#777777] font-normal">({totalBlocks} blocks)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              {[
                { label: 'All Zones', val: undefined },
                { label: '≥32% Mn', val: 32 },
                { label: '≥38% Mn', val: 38 },
              ].map(({ label, val }) => (
                <button
                  key={String(val)}
                  onClick={() => { setMinGradeFilter(val); setPage(1); }}
                  className={`px-3 py-1 rounded border transition-all ${
                    minGradeFilter === val
                      ? 'bg-[#272727] text-[#EFEFEF] border-[#3C3C3C]'
                      : 'bg-[#1E1E1E] text-[#888888] border-[#2E2E2E] hover:text-[#CCCCCC]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#161616] border-b border-[#2E2E2E] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
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
              <tbody className="divide-y divide-[#2E2E2E] text-[#CCCCCC]">
                {blocks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#1E1E1E] transition-colors">
                    <td className="py-2 px-3">{b.easting.toFixed(0)}m</td>
                    <td className="py-2 px-3">{b.northing.toFixed(0)}m</td>
                    <td className="py-2 px-3">{b.depth_m.toFixed(0)}m</td>
                    <td className="py-2 px-3 font-bold text-[#EFEFEF]">{b.grade_pct.toFixed(2)}%</td>
                    <td className="py-2 px-3">{b.thickness_m.toFixed(2)}m</td>
                    <td className="py-2 px-3">{b.tonnage_mt.toFixed(3)} MT</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                        b.zone_id === 2
                          ? 'bg-[#4F9067]/10 text-[#4F9067] border border-[#4F9067]/30'
                          : b.zone_id === 1
                          ? 'bg-[#C98040]/10 text-[#C98040] border border-[#C98040]/30'
                          : 'bg-[#D94F4F]/10 text-[#D94F4F] border border-[#D94F4F]/30'
                      }`}>
                        {b.zone_id === 2 ? 'High ≥38%' : b.zone_id === 1 ? 'Med 32-38%' : 'Low <32%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#2E2E2E] flex justify-between items-center bg-[#1E1E1E] text-[11px]">
            <span className="text-[#777777] font-medium">Page {page} of {Math.ceil(totalBlocks / 20) || 1}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-[#888888] rounded disabled:opacity-40 hover:text-[#EFEFEF] transition-colors">&larr; Prev</button>
              <button disabled={page * 20 >= totalBlocks} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-[#CCCCCC] rounded disabled:opacity-40 hover:text-[#EFEFEF] transition-colors">Next &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
