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
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">System Administration &amp; Feeds</div>
        <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('dataHealth.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-1">{t('dataHealth.subheading')}</p>
      </div>

      {/* Status Banner */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] text-[#777777] uppercase font-semibold tracking-wider">Overall Ingestion Posture</div>
          <div className="text-xl font-bold text-[#4F9067] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
            {dataHealth?.overall_status || 'ALL_SYSTEMS_OPERATIONAL'}
          </div>
        </div>
        <div className="text-[12px] text-[#888888] bg-[#1E1E1E] border border-[#2E2E2E] px-3 py-2 rounded font-medium">
          System Time: <strong className="text-[#EFEFEF]">{dataHealth?.system_time_utc || 'Live'}</strong>
        </div>
      </div>

      {/* Feeds Table */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2E2E2E] bg-[#1E1E1E] font-bold text-[#EFEFEF] text-[13px]">
          Active Telemetry, Satellite &amp; Geological Ingestion Feeds
        </div>

        {isLoading || !dataHealth ? (
          <div className="p-8 text-[13px] text-[#888888] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Verifying feed handshake and socket status...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#161616] border-b border-[#2E2E2E] text-[#777777] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Feed Name</th>
                  <th className="py-2.5 px-4">Data Source / Origin</th>
                  <th className="py-2.5 px-4">Active Records</th>
                  <th className="py-2.5 px-4">Cadence</th>
                  <th className="py-2.5 px-4">Last Sync</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2E2E] text-[#CCCCCC]">
                {dataHealth.sources.map((src, idx) => (
                  <tr key={idx} className="hover:bg-[#1E1E1E] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#C0BDB8]">{src.feed_name}</td>
                    <td className="py-3 px-4 text-[#888888]">{src.source_origin}</td>
                    <td className="py-3 px-4 font-medium">{src.record_count.toLocaleString()}</td>
                    <td className="py-3 px-4">{src.cadence}</td>
                    <td className="py-3 px-4 text-[#888888]">{src.last_sync}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded bg-[#4F9067]/10 text-[#4F9067] border border-[#4F9067]/30">
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

      {/* Model Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Model 1: Geological Reserve Estimator',
            rows: [
              { label: 'Model File:', val: 'artifacts/reserve_model.pkl' },
              { label: 'Grid Blocks:', val: '10,000 blocks (100x100m)' },
              { label: 'Kriging Variogram:', val: 'Spherical Fitted', highlight: true },
              { label: 'Grade Accuracy (Test):', val: '92.10% (R² 0.8002)', highlight: true },
            ],
          },
          {
            title: 'Model 2: Production Shortfall Early-Warning',
            rows: [
              { label: 'Model File:', val: 'artifacts/shortfall_model.pkl' },
              { label: 'SHAP Explainer:', val: 'artifacts/shap_explainer.pkl' },
              { label: 'Decision Threshold:', val: '0.080 (F1-Optimal)' },
              { label: 'Shortfall Recall (Test):', val: '98.52% (ROC-AUC 0.9921)', highlight: true },
            ],
          },
        ].map(({ title, rows }) => (
          <div key={title} className="bg-[#1A1A1A] border border-[#2E2E2E] p-5 space-y-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C0BDB8]"></span>
              <div className="text-[13px] font-bold text-[#EFEFEF]">{title}</div>
            </div>
            <div className="space-y-2 text-[12px] text-[#888888]">
              {rows.map(({ label, val, highlight }) => (
                <div key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span className={highlight ? 'text-[#4F9067] font-semibold' : 'text-[#EFEFEF] font-medium'}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
