import React from 'react';
import { useTranslation } from 'react-i18next';

export type PageId =
  | 'landing'
  | 'overview'
  | 'reserve'
  | 'trends'
  | 'risk'
  | 'actions'
  | 'digitalTwin'
  | 'dataHealth';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  const navItems: { id: PageId; labelKey: string; code: string }[] = [
    { id: 'landing', labelKey: 'nav.landing', code: '00' },
    { id: 'overview', labelKey: 'nav.dashboard', code: '01' },
    { id: 'reserve', labelKey: 'nav.reserveMap', code: '02' },
    { id: 'trends', labelKey: 'nav.productionTrends', code: '03' },
    { id: 'risk', labelKey: 'nav.riskRootCause', code: '04' },
    { id: 'actions', labelKey: 'nav.actions', code: '05' },
    { id: 'digitalTwin', labelKey: 'nav.digitalTwin', code: '06' },
    { id: 'dataHealth', labelKey: 'nav.dataHealth', code: '07' },
  ];

  return (
    <aside className="w-64 bg-[#12151B] border-r border-[#232834] flex flex-col justify-between select-none">
      {/* Navigation List */}
      <div className="py-4">
        <div className="px-5 mb-3 text-[10px] font-mono uppercase tracking-widest text-[#586069]">
          Operational Navigation
        </div>
        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-[12px] font-sans text-left transition-colors ${
                  isActive
                    ? 'bg-[#1D222A] text-[#C8A96E] border-l-2 border-[#C8A96E] font-semibold'
                    : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161A22] border-l-2 border-transparent'
                }`}
              >
                <span className="font-mono text-[10px] text-[#586069]">{item.code}</span>
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Footnote */}
      <div className="p-4 border-t border-[#232834] text-[11px] font-mono text-[#586069] bg-[#0E1015]">
        <div>MOIL MINE DECISION CORE</div>
        <div className="text-[10px] text-[#8B949E] mt-0.5">XGBoost v2.1 | PyKrige v1.7</div>
      </div>
    </aside>
  );
}
