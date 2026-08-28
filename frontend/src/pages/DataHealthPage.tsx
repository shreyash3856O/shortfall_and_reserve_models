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
      } catch (err) {
        console.error('Failed to load data health', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHealth();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
          System Administration &amp; Feeds
        </div>
        <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('dataHealth.heading')}</h1>
        <p className="text-[13px] text-[#8B949E] mt-1">{t('dataHealth.subheading')}</p>
      </div>

      {/* System Status Banner */}
      <div className="bg-[#12151B] border border-[#232834] p-5 font-mono text-[11px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[10px] text-[#8B949E] uppercase">OVERALL INGESTION POSTURE</div>
          <div className="text-xl font-bold text-[#4E9F6E] mt-0.5">
            {dataHealth?.overall_status || 'ALL_SYSTEMS_OPERATIONAL'}
          </div>
        </div>
        <div className="text-[#8B949E] text-[10px] bg-[#161A22] border border-[#232834] px-3 py-1.5">
          System Time: <strong className="text-[#E6EDF3]">{dataHealth?.system_time_utc || 'LIVE'}</strong>
        </div>
      </div>

      {/* Data Feeds Table */}
      <div className="bg-[#12151B] border border-[#232834] font-mono text-[11px]">
        <div className="p-4 border-b border-[#232834] bg-[#161A22] font-bold text-[#E6EDF3]">
          ACTIVE TELEMETRY, SATELLITE &amp; GEOLOGICAL INGESTION FEEDS
        </div>

        {isLoading || !dataHealth ? (
          <div className="p-8 text-[#8B949E]">Verifying feed handshake and socket status...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0E1015] border-b border-[#232834] text-[#8B949E] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Feed Name</th>
                  <th className="py-2.5 px-4">Data Source / Origin</th>
                  <th className="py-2.5 px-4">Active Records</th>
                  <th className="py-2.5 px-4">Cadence</th>
                  <th className="py-2.5 px-4">Last Sync Timestamp</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232834] text-[#E6EDF3]">
                {dataHealth.sources.map((src, idx) => (
                  <tr key={idx} className="hover:bg-[#161A22] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#C8A96E]">{src.feed_name}</td>
                    <td className="py-3 px-4 text-[#8B949E]">{src.source_origin}</td>
                    <td className="py-3 px-4">{src.record_count.toLocaleString()}</td>
                    <td className="py-3 px-4">{src.cadence}</td>
                    <td className="py-3 px-4 text-[#8B949E]">{src.last_sync}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-[#4E9F6E]/20 text-[#4E9F6E] border border-[#4E9F6E]/40">
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

      {/* Model Integrity Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
        <div className="bg-[#12151B] border border-[#232834] p-4 space-y-2">
          <div className="text-[#C8A96E] font-bold">[MODEL 1] GEOLOGICAL RESERVE ESTIMATOR</div>
          <div className="text-[10px] text-[#8B949E] space-y-1">
            <div className="flex justify-between">
              <span>Model File:</span>
              <span className="text-[#E6EDF3]">artifacts/reserve_model.pkl</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Blocks:</span>
              <span className="text-[#E6EDF3]">10,000 blocks (100x100m)</span>
            </div>
            <div className="flex justify-between">
              <span>Kriging Variogram:</span>
              <span className="text-[#4E9F6E]">Spherical Fitted</span>
            </div>
          </div>
        </div>

        <div className="bg-[#12151B] border border-[#232834] p-4 space-y-2">
          <div className="text-[#C8A96E] font-bold">[MODEL 2] PRODUCTION SHORTFALL EARLY-WARNING</div>
          <div className="text-[10px] text-[#8B949E] space-y-1">
            <div className="flex justify-between">
              <span>Model File:</span>
              <span className="text-[#E6EDF3]">artifacts/shortfall_model.pkl</span>
            </div>
            <div className="flex justify-between">
              <span>SHAP Explainer:</span>
              <span className="text-[#E6EDF3]">artifacts/shap_explainer.pkl</span>
            </div>
            <div className="flex justify-between">
              <span>Decision Threshold:</span>
              <span className="text-[#4E9F6E]">0.080 (F1-Optimal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
