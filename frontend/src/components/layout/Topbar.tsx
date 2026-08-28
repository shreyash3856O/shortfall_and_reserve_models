import React from 'react';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  isOffline: boolean;
  lastSync: string | null;
  onOpenChat: () => void;
  onToggleMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Topbar({
  isOffline,
  lastSync,
  onOpenChat,
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  isSidebarCollapsed,
}: TopbarProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="h-14 bg-[#101014]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 flex items-center justify-between select-none z-20">
      {/* Brand Identity & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[#888888] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Quick Toggle */}
        <button
          onClick={onToggleDesktopSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="hidden md:flex p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[#888888] hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </button>

        <div className="bg-white/[0.08] border border-white/[0.12] px-2.5 py-1 rounded-lg text-[12px] font-bold tracking-wider text-[#C0BDB8]">
          MIDAS
        </div>
        <div className="text-[13px] text-[#EFEFEF] font-semibold hidden sm:block">
          {t('common.subtitle')}
        </div>
        <span className="text-[#444444] hidden lg:inline">&bull;</span>
        <div className="text-[12px] text-[#888888] font-normal hidden lg:block">
          {t('common.org')}
        </div>
      </div>

      {/* Right: Live Status & Controls */}
      <div className="flex items-center gap-2.5">
        {/* Live / Offline Status Badge */}
        <div className="flex items-center gap-2 text-[11px] bg-white/[0.04] border border-white/[0.08] px-2.5 sm:px-3 py-1 rounded-lg shadow-sm">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              isOffline ? 'bg-[#C98040]' : 'bg-[#4F9067] animate-pulse'
            }`}
          />
          <span className="text-[#CCCCCC] font-medium hidden sm:inline">
            {isOffline ? t('common.cachedFeed') : t('common.liveFeed')}
          </span>
          {lastSync && (
            <span className="text-[#666666] hidden xl:inline">
              ({new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] text-[11px] rounded-lg p-0.5 font-medium">
          {(['en', 'hi', 'mr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                i18n.language === lang
                  ? 'bg-white/[0.12] text-white font-bold border border-white/[0.15] shadow-sm'
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* AI Chatbot Button */}
        <button
          onClick={onOpenChat}
          className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-[#EFEFEF] px-3 py-1 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
          <span className="hidden sm:inline">{t('nav.chatbot')}</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </header>
  );
}
