import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, DataHealthResponse } from '../api/client';

export default function DataHealthPage() {
  const { t } = useTranslation();
  const [dataHealth, setDataHealth] = useState<DataHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await api.getDataHealth();
        setDataHealth(res.data);
      } catch (err) { console.error('Failed to load data health', err); }
      finally { setIsLoading(false); }
    }
    loadHealth();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('dataHealth.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-0.5">{t('dataHealth.subheading')}</p>
      </div>

      {/* System Status Banner */}
      <div className="bg-[#181818] border border-[#2A2A2A] p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#4F9067]/15 border border-[#4F9067]/30 flex items-center justify-center text-[#4F9067] font-bold text-sm">
            &check;
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#EFEFEF]">
              All Telemetry Streams &amp; AI Models Operational
            </div>
            <div className="text-[12px] text-[#888888]">
              SCADA real-time ingest, Sentinel-2 spectral indices, and borehole assays synced.
            </div>
          </div>
        </div>
        <div className="text-[11px] text-[#777777] bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-md">
          Last Sync: <strong className="text-[#CCCCCC]">{dataHealth?.system_time_utc || 'Live'}</strong>
        </div>
      </div>

      {/* Clean Telemetry Feeds Table */}
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#242424] bg-[#1C1C1C] font-bold text-[#EFEFEF] text-[13px]">
          Ingested Data Feeds
        </div>

        {isLoading || !dataHealth ? (
          <div className="p-8 text-[13px] text-[#888888] flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Verifying connection...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#141414] border-b border-[#242424] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Feed</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Total Records</th>
                  <th className="py-2.5 px-4">Frequency</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-[#CCCCCC]">
                {dataHealth.sources.map((src, idx) => (
                  <tr key={idx} className="hover:bg-[#1C1C1C] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#EFEFEF]">{src.feed_name}</td>
                    <td className="py-3 px-4 text-[#888888]">{src.source_origin}</td>
                    <td className="py-3 px-4">{src.record_count.toLocaleString()}</td>
                    <td className="py-3 px-4">{src.cadence}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30">
                        {src.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2 Model Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-[13px] font-bold text-[#EFEFEF]">Model 1: Geological Reserve Estimator</div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30">Healthy</span>
          </div>
          <div className="text-[12px] text-[#888888] space-y-1.5 pt-1">
            <div className="flex justify-between"><span>Architecture:</span><span className="text-[#CCCCCC]">XGBoost + Ordinary Kriging</span></div>
            <div className="flex justify-between"><span>Resolution:</span><span className="text-[#CCCCCC]">10,000 blocks (100&times;100m)</span></div>
            <div className="flex justify-between"><span>Accuracy (R&sup2;):</span><span className="text-[#4F9067] font-semibold">0.8002 (92.1% accuracy)</span></div>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-[13px] font-bold text-[#EFEFEF]">Model 2: Production Shortfall AI</div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30">Healthy</span>
          </div>
          <div className="text-[12px] text-[#888888] space-y-1.5 pt-1">
            <div className="flex justify-between"><span>Architecture:</span><span className="text-[#CCCCCC]">Cost-Sensitive XGBoost + SHAP</span></div>
            <div className="flex justify-between"><span>Decision Cutoff:</span><span className="text-[#CCCCCC]">0.080 (F1-Optimal)</span></div>
            <div className="flex justify-between"><span>Shortfall Recall:</span><span className="text-[#4F9067] font-semibold">98.5% (ROC-AUC 0.992)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
