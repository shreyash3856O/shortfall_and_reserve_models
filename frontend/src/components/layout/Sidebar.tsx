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

  const navItems: { id: PageId; labelKey: string }[] = [
    { id: 'landing', labelKey: 'nav.landing' },
    { id: 'overview', labelKey: 'nav.dashboard' },
    { id: 'reserve', labelKey: 'nav.reserveMap' },
    { id: 'trends', labelKey: 'nav.productionTrends' },
    { id: 'risk', labelKey: 'nav.riskRootCause' },
    { id: 'actions', labelKey: 'nav.actions' },
    { id: 'digitalTwin', labelKey: 'nav.digitalTwin' },
    { id: 'dataHealth', labelKey: 'nav.dataHealth' },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] border-r border-[#2E2E2E] flex flex-col justify-between select-none">
      {/* Navigation List */}
      <div className="py-5">
        <div className="px-5 mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#585858]">
          Operational Navigation
        </div>
        <nav className="space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#272727] text-[#EFEFEF] font-semibold border border-[#3A3A3A]'
                    : 'text-[#888888] hover:text-[#CCCCCC] hover:bg-[#222222]'
                }`}
              >
                <span>{t(item.labelKey)}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C0BDB8]"></span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Footnote */}
      <div className="p-4 border-t border-[#2E2E2E] text-[11px] text-[#555555] bg-[#141414]">
        <div className="font-semibold text-[#7A7A7A]">MOIL Mine Decision Core</div>
        <div className="text-[10px] text-[#4A4A4A] mt-0.5">XGBoost &bull; Ordinary Kriging &bull; SHAP</div>
      </div>
    </aside>
  );
}
