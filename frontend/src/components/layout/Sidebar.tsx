import React, { useState, useEffect } from 'react';
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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems: { id: PageId; labelKey: string; badge?: string; icon: React.ReactNode }[] = [
    {
      id: 'landing',
      labelKey: 'nav.landing',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'overview',
      labelKey: 'nav.dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'reserve',
      labelKey: 'nav.reserveMap',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'trends',
      labelKey: 'nav.productionTrends',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      id: 'risk',
      labelKey: 'nav.riskRootCause',
      badge: 'SHAP',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'actions',
      labelKey: 'nav.actions',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'digitalTwin',
      labelKey: 'nav.digitalTwin',
      badge: 'GIS',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'dataHealth',
      labelKey: 'nav.dataHealth',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const hourStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <aside className="w-60 flex flex-col justify-between select-none border-r border-white/[0.05]"
      style={{
        background: 'linear-gradient(180deg, rgba(16,16,20,0.98) 0%, rgba(12,12,15,0.99) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo & Brand */}
      <div>
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F9067]/30 to-[#3D7852]/20 border border-[#4F9067]/25 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#4F9067]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-extrabold tracking-tight text-[#F0F0F0]">MIDAS</div>
              <div className="text-[10px] text-[#555566] font-medium">Mine Intelligence Core</div>
            </div>
          </div>
        </div>

        {/* Live Clock & Status Strip */}
        <div className="px-5 py-3 border-b border-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#4F9067] inline-block"></span>
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#4F9067] animate-ping opacity-60"></span>
              </div>
              <span className="text-[11px] text-[#4F9067] font-semibold">LIVE</span>
            </div>
            <div className="text-[11px] font-mono text-[#888888] tracking-wider">{hourStr}</div>
          </div>
          <div className="text-[10px] text-[#444450] mt-1">IST &bull; Shift A Active</div>
        </div>

        {/* Navigation Section */}
        <div className="py-4">
          <div className="px-5 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#444450]">
            Modules
          </div>
          <nav className="space-y-0.5 px-2.5">
            {navItems.map((item, idx) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 group relative animate-fade-in-up ${
                    isActive
                      ? 'text-[#F0F0F0] font-semibold'
                      : 'text-[#666672] hover:text-[#C8C8D4]'
                  }`}
                  style={{
                    animationDelay: `${idx * 30}ms`,
                    ...(isActive ? {
                      background: 'linear-gradient(90deg, rgba(79,144,103,0.14) 0%, rgba(79,144,103,0.04) 100%)',
                      borderLeft: '2px solid rgba(79,144,103,0.6)',
                      paddingLeft: '10px',
                    } : {}),
                  }}
                >

                  {/* Active glow blob */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#4F9067] rounded-r-full opacity-80 blur-[1px]" />
                  )}

                  <span className={`transition-colors duration-200 ${isActive ? 'text-[#4F9067]' : 'text-[#444450] group-hover:text-[#888888]'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left truncate">{t(item.labelKey)}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                      isActive
                        ? 'bg-[#4F9067]/20 text-[#4F9067] border border-[#4F9067]/30'
                        : 'bg-white/[0.04] text-[#555560] border border-white/[0.06]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-white/[0.05]"
        style={{ background: 'rgba(10,10,13,0.8)' }}
      >
        <div className="space-y-2.5">
          {/* Model Health */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#888888]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
              AI Models Healthy
            </div>
            <span className="text-[10px] text-[#555560]">2/2</span>
          </div>
          {/* SCADA Feed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#888888]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
              SCADA Feed
            </div>
            <span className="text-[10px] text-[#4F9067]">Synced</span>
          </div>
          {/* Build version */}
          <div className="text-[9px] text-[#333340] font-mono pt-1 border-t border-white/[0.04]">
            MIDAS v2.4.1 &bull; MOIL Production
          </div>
        </div>
      </div>
    </aside>
  );
}
