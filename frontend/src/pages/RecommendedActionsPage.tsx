import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'boneyard-js/react';
import { api, MineRiskSummary, PrescriptiveActionItem } from '../api/client';
import { ActionsSkeleton } from '../components/layout/ViewSkeletons';

export default function RecommendedActionsPage() {
  const { t } = useTranslation();
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [selectedMineId, setSelectedMineId] = useState('MN01');
  const [actions, setActions] = useState<PrescriptiveActionItem[]>([]);
  const [completedRanks, setCompletedRanks] = useState<Record<number, boolean>>({});
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
        setCompletedRanks({});
      } catch (err) { console.error('Failed to load actions', err); }
      finally { setIsLoading(false); }
    }
    loadActions();
  }, [selectedMineId]);

  const activeMine = mines.find((m) => m.mine_id === selectedMineId);

  const toggleComplete = (rank: number) => {
    setCompletedRanks((prev) => ({ ...prev, [rank]: !prev[rank] }));
  };

  return (
    <Skeleton
      name="recommended-actions"
      loading={isLoading && actions.length === 0}
      fallback={<ActionsSkeleton />}
    >
      <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
        {/* Header & Mine Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#EFEFEF] tracking-tight">{t('actions.heading')}</h1>
            <p className="text-[13px] text-[#888888] mt-0.5">{t('actions.subheading')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#888888] text-[12px] font-medium">Select Mine:</span>
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              className="bg-[#16161A] border border-[#24242A] text-[#EFEFEF] px-3 py-1.5 rounded-lg font-semibold text-[13px] focus:outline-none focus:border-[#4F9067]/60 transition-colors shadow-sm"
            >
              {mines.map((m) => (
                <option key={m.mine_id} value={m.mine_id}>{m.mine_name} ({m.mine_id})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ranked Directives List */}
        <div className="bg-[#16161A] border border-[#24242A] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up stagger-1">
          <div className="p-4 border-b border-[#222228] bg-[#18181D] flex justify-between items-center">
            <div className="text-[14px] font-bold text-[#EFEFEF]">
              Action Plan for {activeMine?.mine_name || selectedMineId}
            </div>
            <div className="text-[11px] text-[#777777]">
              Prioritized by expected risk mitigation impact
            </div>
          </div>

          {actions.length === 0 ? (
            <div className="p-8 text-[13px] text-[#4F9067] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
              <span>No corrective actions required. Mine is operating within normal quota tolerance.</span>
            </div>
          ) : (
            <div className="divide-y divide-[#202026]">
              {actions.map((act) => {
                const isCritical = act.priority === 'CRITICAL';
                const isHigh = act.priority === 'HIGH';
                const isDone = !!completedRanks[act.rank];

                return (
                  <div
                    key={act.rank}
                    className={`p-5 hover:bg-[#1A1A20] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isDone ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox for Action Execution */}
                      <button
                        onClick={() => toggleComplete(act.rank)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all mt-1 ${
                          isDone
                            ? 'bg-[#4F9067] border-[#4F9067] text-white'
                            : 'bg-[#121215] border-[#2E2E38] text-transparent hover:border-[#4F9067]'
                        }`}
                        title={isDone ? 'Mark in progress' : 'Mark deployed'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <div className="w-8 h-8 rounded-lg bg-[#202026] border border-[#2C2C34] text-[#C0BDB8] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {act.rank}
                      </div>
                      <div className="space-y-1.5">
                        <div className={`text-[14px] font-bold leading-snug ${isDone ? 'line-through text-[#888888]' : 'text-[#EFEFEF]'}`}>
                          {act.action}
                        </div>
                        <div className="text-[12px] text-[#888888] flex flex-wrap items-center gap-2">
                          <span>Trigger: <strong className="text-[#CCCCCC]">{act.trigger_driver} ({act.trigger_value})</strong></span>
                          <span className="text-[#44444A]">&bull;</span>
                          <span>Expected Impact: <strong className="text-[#4F9067]">{act.expected_impact}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end md:self-center flex-shrink-0 flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border ${
                        isCritical
                          ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                          : isHigh
                          ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                          : 'bg-[#202026] text-[#888888] border-[#2C2C34]'
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

        {/* Rules Threshold Guide */}
        <div className="bg-[#16161A] border border-[#24242A] p-5 space-y-3 rounded-2xl shadow-sm animate-fade-in-up stagger-2">
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
              <div key={idx} className="bg-[#121215] border border-[#202026] p-3.5 rounded-xl space-y-1">
                <div className="text-[#EFEFEF] font-semibold text-[12px]">{rule}</div>
                <div className="text-[#888888] text-[11px]">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
