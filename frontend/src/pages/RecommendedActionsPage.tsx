import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, MineRiskSummary, PrescriptiveActionItem } from '../api/client';

export default function RecommendedActionsPage() {
  const { t } = useTranslation();
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [selectedMineId, setSelectedMineId] = useState('MN01');
  const [actions, setActions] = useState<PrescriptiveActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMines() {
      try {
        const res = await api.getShortfallMines();
        setMines(res.data);
      } catch (err) { console.error('Failed to load mines', err); }
    }
    loadMines();
  }, []);

  useEffect(() => {
    async function loadActions() {
      setIsLoading(true);
      try {
        const res = await api.getMineActions(selectedMineId);
        setActions(res.data);
      } catch (err) { console.error('Failed to load actions', err); }
      finally { setIsLoading(false); }
    }
    loadActions();
  }, [selectedMineId]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">Prescriptive Decision Engine (midas/rules.py)</div>
          <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('actions.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-1">{t('actions.subheading')}</p>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-[#888888] font-medium">Select Unit:</span>
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2E2E2E] text-[#EFEFEF] px-3 py-1.5 rounded font-semibold focus:outline-none focus:border-[#4A4A4A] transition-colors"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>{m.mine_id} — {m.mine_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranked Directives */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2E2E2E] bg-[#1E1E1E] flex justify-between items-center">
          <div className="text-[13px] font-bold text-[#EFEFEF]">Prioritized Operational Directives &mdash; {selectedMineId}</div>
          <div className="text-[11px] text-[#777777] font-medium">Ranked by SHAP Risk Attribution</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-[13px] text-[#888888] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Evaluating rule triggers and SHAP mitigations...
          </div>
        ) : actions.length === 0 ? (
          <div className="p-8 text-[13px] text-[#4F9067] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
            No corrective actions required. Mine operating within normal mandate tolerance.
          </div>
        ) : (
          <div className="divide-y divide-[#2E2E2E]">
            {actions.map((act) => {
              const isCritical = act.priority === 'CRITICAL';
              const isHigh = act.priority === 'HIGH';
              return (
                <div key={act.rank} className="p-5 hover:bg-[#1E1E1E] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#242424] border border-[#333333] text-[#C0BDB8] font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {act.rank}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-[#EFEFEF] leading-snug">{act.action}</div>
                      <div className="text-[12px] text-[#888888] flex flex-wrap items-center gap-2">
                        <span>Trigger: <strong className="text-[#CCCCCC]">{act.trigger_driver} ({act.trigger_value})</strong></span>
                        <span className="text-[#444444]">&bull;</span>
                        <span>Benefit: <strong className="text-[#4F9067]">{act.expected_impact}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end md:self-center">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded border ${
                      isCritical
                        ? 'bg-[#D94F4F]/10 text-[#D94F4F] border-[#D94F4F]/30'
                        : isHigh
                        ? 'bg-[#C98040]/10 text-[#C98040] border-[#C98040]/30'
                        : 'bg-[#242424] text-[#888888] border-[#2E2E2E]'
                    }`}>
                      {act.priority} PRIORITY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rule Engine Matrix */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] p-5 space-y-4 rounded-lg">
        <div className="text-[13px] font-bold text-[#EFEFEF] border-b border-[#2E2E2E] pb-3">
          Operational Rule Engine Threshold Matrix
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          {[
            { rule: 'Rule 1: Breakdown Hours > 8.0 h/day', directive: 'Deploy backup excavator Komatsu PC1250 to active ore face.' },
            { rule: 'Rule 2: Monsoon Precipitation > 50.0 mm', directive: 'Advance blasting before rain front & activate pit pump battery #2.' },
            { rule: 'Rule 3: Extraction Deficit > 5% Target Pace', directive: 'Prioritize high-grade extraction at Zone B (38.6% Mn).' },
            { rule: 'Rule 4: Stalled Blasting Delay >= 1 Day', directive: 'Reschedule blasting sequence to first available dry window.' },
          ].map(({ rule, directive }, idx) => (
            <div key={idx} className="bg-[#161616] border border-[#2E2E2E] p-3.5 rounded space-y-1.5">
              <div className="text-[#EFEFEF] font-semibold text-[12px]">{rule}</div>
              <div className="text-[#777777] text-[11px] leading-relaxed">{directive}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
