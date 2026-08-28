import React from 'react';
import { useTranslation } from 'react-i18next';

export type PageId =
  | 'landing'
  | 'overview'
  | 'reserve'
  | 'trends'
  | 'risk'
  | 'actions'
  | 'equipment'
  | 'digitalTwin'
  | 'dataHealth';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useTranslation();

  const navItems: { id: PageId; labelKey: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'landing',
      labelKey: 'nav.landing',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'overview',
      labelKey: 'nav.dashboard',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'reserve',
      labelKey: 'nav.reserveMap',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'trends',
      labelKey: 'nav.productionTrends',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      id: 'risk',
      labelKey: 'nav.riskRootCause',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'actions',
      labelKey: 'nav.actions',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'equipment',
      labelKey: 'nav.equipment',
      badge: 'Store',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: 'digitalTwin',
      labelKey: 'nav.digitalTwin',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'dataHealth',
      labelKey: 'nav.dataHealth',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const handleItemClick = (pageId: PageId) => {
    onNavigate(pageId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay with Soft Blur */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 md:hidden animate-fade-in transition-opacity"
        />
      )}

      {/* Sleek Compact Sidebar Exactly Constrained to Viewport Height (h-[calc(100vh-3.5rem)]) */}
      <aside
        style={{
          transition: 'width 320ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 320ms cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}
        className={`fixed md:static inset-y-0 left-0 z-40 h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] bg-[#101014]/95 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col justify-between select-none overflow-hidden flex-shrink-0 ${
          isMobileOpen
            ? 'translate-x-0 w-60 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-56'}`}
      >
        {/* Navigation Section */}
        <div className="pt-3 pb-1 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header Label */}
          <div className="px-3.5 mb-1.5 flex items-center justify-between h-5 flex-shrink-0">
            <div
              className={`text-[10px] font-extrabold uppercase tracking-widest text-[#555555] transition-all duration-200 ${
                isCollapsed ? 'md:opacity-0 md:w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              Menu
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden text-[#888888] hover:text-white p-1 rounded-md bg-white/[0.05]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links (Compact & perfectly fitted to view height) */}
          <nav className="space-y-0.5 px-2 flex-1 overflow-hidden flex flex-col justify-evenly">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const label = t(item.labelKey);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 group relative active:scale-95 flex-shrink-0 ${
                    isActive
                      ? 'bg-white/[0.09] text-white font-bold border border-white/[0.12] shadow-sm scale-[1.01]'
                      : 'text-[#888888] hover:text-white hover:bg-white/[0.04]'
                  } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                >
                  <span
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#C0BDB8]' : 'text-[#666666] group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Label (hidden in collapsed mode with smooth fade) */}
                  <span
                    className={`flex-1 text-left truncate transition-all duration-200 ${
                      isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 block'
                    }`}
                  >
                    {label}
                  </span>

                  {/* Badge */}
                  {item.badge && !isCollapsed && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#4F9067]/20 text-[#4F9067] border border-[#4F9067]/30 flex-shrink-0 animate-pop-up">
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-[#4F9067] ${
                        isCollapsed ? 'md:absolute md:top-1.5 md:right-1.5' : ''
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Compact Footer with Collapse Toggle (Pinned to bottom of view height) */}
        <div className="p-2 border-t border-white/[0.06] bg-[#0C0C0F]/80 space-y-1.5 flex-shrink-0">
          {/* Desktop Collapse / Expand Spring Toggle Button */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="w-full hidden md:flex items-center justify-center gap-2 py-1 px-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[#888888] hover:text-white text-[11px] font-medium transition-all active:scale-95"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180 text-[#4F9067]' : 'rotate-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!isCollapsed && <span className="text-[11px]">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
