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
      } catch (err) {
        console.error('Failed to load mines', err);
      }
    }
    loadMines();
  }, []);

  useEffect(() => {
    async function loadActions() {
      setIsLoading(true);
      try {
        const res = await api.getMineActions(selectedMineId);
        setActions(res.data);
      } catch (err) {
        console.error('Failed to load actions', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActions();
  }, [selectedMineId]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header & Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
            Prescriptive Decision Engine (midas/rules.py)
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('actions.heading')}</h1>
          <p className="text-[13px] text-[#8B949E] mt-1">{t('actions.subheading')}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span className="text-[#8B949E]">Select Unit:</span>
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="bg-[#12151B] border border-[#232834] text-[#C8A96E] px-3 py-1.5 font-bold focus:outline-none focus:border-[#C8A96E]"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>
                {m.mine_id} — {m.mine_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranked Action Directives List */}
      <div className="bg-[#12151B] border border-[#232834]">
        <div className="p-4 border-b border-[#232834] bg-[#161A22] font-mono text-[12px] font-bold text-[#E6EDF3] flex justify-between items-center">
          <span>PRIORITIZED OPERATIONAL DIRECTIVES FOR {selectedMineId}</span>
          <span className="text-[10px] text-[#8B949E] font-normal">Ranked by SHAP Risk Attribution</span>
        </div>

        {isLoading ? (
          <div className="p-8 font-mono text-[12px] text-[#8B949E]">
            Evaluating rule triggers and SHAP mitigations...
          </div>
        ) : actions.length === 0 ? (
          <div className="p-8 font-mono text-[12px] text-[#4E9F6E]">
            No corrective actions required. Mine operating within normal mandate tolerance.
          </div>
        ) : (
          <div className="divide-y divide-[#232834]">
            {actions.map((act) => {
              const isCritical = act.priority === 'CRITICAL';
              const isHigh = act.priority === 'HIGH';

              return (
                <div key={act.rank} className="p-5 hover:bg-[#161A22] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px]">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1D222A] border border-[#2E3544] text-[#C8A96E] font-bold text-sm w-8 h-8 flex items-center justify-center">
                      {act.rank}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[13px] font-sans font-bold text-[#E6EDF3]">
                        {act.action}
                      </div>
                      <div className="text-[10px] text-[#8B949E] flex items-center gap-3">
                        <span>Trigger: <strong className="text-[#E6EDF3]">{act.trigger_driver} ({act.trigger_value})</strong></span>
                        <span>|</span>
                        <span>Expected Benefit: <strong className="text-[#4E9F6E]">{act.expected_impact}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold ${
                        isCritical
                          ? 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                          : isHigh
                          ? 'bg-[#E09B3D]/20 text-[#E09B3D] border border-[#E09B3D]/40'
                          : 'bg-[#1D222A] text-[#8B949E] border border-[#232834]'
                      }`}
                    >
                      {act.priority} PRIORITY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rules Engine Reference Table */}
      <div className="bg-[#12151B] border border-[#232834] p-5 font-mono text-[11px] space-y-3">
        <div className="text-[#C8A96E] font-bold border-b border-[#232834] pb-2 text-[12px]">
          OPERATIONAL RULE ENGINE THRESHOLD MATRIX
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#8B949E] text-[10px]">
          <div className="bg-[#0E1015] border border-[#232834] p-3 space-y-1">
            <div className="text-[#E6EDF3] font-bold">[RULE 1] Breakdown Hours &gt; 8.0 h/day</div>
            <div>Directive: Deploy backup excavator Komatsu PC1250 to active ore face.</div>
          </div>
          <div className="bg-[#0E1015] border border-[#232834] p-3 space-y-1">
            <div className="text-[#E6EDF3] font-bold">[RULE 2] Monsoon Precipitation &gt; 50.0 mm</div>
            <div>Directive: Advance blasting before rain front &amp; activate pit pump battery #2.</div>
          </div>
          <div className="bg-[#0E1015] border border-[#232834] p-3 space-y-1">
            <div className="text-[#E6EDF3] font-bold">[RULE 3] Extraction Deficit &gt; 5% Target Pace</div>
            <div>Directive: Prioritize high-grade extraction at Zone B (38.6% Mn).</div>
          </div>
          <div className="bg-[#0E1015] border border-[#232834] p-3 space-y-1">
            <div className="text-[#E6EDF3] font-bold">[RULE 4] Stalled Blasting Delay &gt;= 1 Day</div>
            <div>Directive: Reschedule blasting sequence to first available dry window.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
