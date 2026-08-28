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

  const activeMine = mines.find((m) => m.mine_id === selectedMineId);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header & Mine Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#EFEFEF]">{t('actions.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-0.5">{t('actions.subheading')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#888888] text-[12px] font-medium">Select Mine:</span>
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="bg-[#1C1C1C] border border-[#2E2E2E] text-[#EFEFEF] px-3 py-1.5 rounded-md font-semibold text-[13px] focus:outline-none focus:border-[#444444] transition-colors"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>{m.mine_name} ({m.mine_id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranked Directives List */}
      <div className="bg-[#181818] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#242424] bg-[#1C1C1C] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[#EFEFEF]">
            Action Plan for {activeMine?.mine_name || selectedMineId}
          </div>
          <div className="text-[11px] text-[#777777]">
            Prioritized by expected risk mitigation impact
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-[13px] text-[#888888] flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Evaluating action triggers...
          </div>
        ) : actions.length === 0 ? (
          <div className="p-8 text-[13px] text-[#4F9067] flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
            <span>No corrective actions required. Mine is operating within normal quota tolerance.</span>
          </div>
        ) : (
          <div className="divide-y divide-[#242424]">
            {actions.map((act) => {
              const isCritical = act.priority === 'CRITICAL';
              const isHigh = act.priority === 'HIGH';

              return (
                <div key={act.rank} className="p-5 hover:bg-[#1C1C1C] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-md bg-[#222222] border border-[#303030] text-[#C0BDB8] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {act.rank}
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[14px] font-bold text-[#EFEFEF] leading-snug">
                        {act.action}
                      </div>
                      <div className="text-[12px] text-[#888888] flex flex-wrap items-center gap-2">
                        <span>Trigger: <strong className="text-[#CCCCCC]">{act.trigger_driver} ({act.trigger_value})</strong></span>
                        <span className="text-[#444444]">&bull;</span>
                        <span>Expected Impact: <strong className="text-[#4F9067]">{act.expected_impact}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end md:self-center flex-shrink-0">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border ${
                      isCritical
                        ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                        : isHigh
                        ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                        : 'bg-[#222222] text-[#888888] border-[#303030]'
                    }`}>
                      {act.priority} Priority
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simple Rules Trigger Overview */}
      <div className="bg-[#181818] border border-[#2A2A2A] p-5 space-y-3 rounded-lg">
        <div className="text-[13px] font-bold text-[#EFEFEF]">
          Operational Rules Threshold Guide
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
          {[
            { rule: 'Breakdown Hours > 8.0 h/day', action: 'Deploy backup excavator Komatsu PC1250 to active ore face.' },
            { rule: 'Monsoon Rain > 50.0 mm', action: 'Advance blasting before rain front & activate pit pump battery #2.' },
            { rule: 'Extraction Deficit > 5%', action: 'Prioritize high-grade extraction at Zone B (38.6% Mn).' },
            { rule: 'Blasting Delay >= 1 Day', action: 'Reschedule blasting sequence to first available dry window.' },
          ].map(({ rule, action }, idx) => (
            <div key={idx} className="bg-[#141414] border border-[#242424] p-3 rounded-md space-y-1">
              <div className="text-[#EFEFEF] font-semibold text-[12px]">{rule}</div>
              <div className="text-[#888888] text-[11px]">{action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
