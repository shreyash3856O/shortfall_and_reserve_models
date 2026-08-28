import React from 'react';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  isOffline: boolean;
  lastSync: string | null;
  onOpenChat: () => void;
}

export default function Topbar({ isOffline, lastSync, onOpenChat }: TopbarProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="h-14 bg-[#161616] border-b border-[#262626] px-6 flex items-center justify-between select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="bg-[#242424] border border-[#333333] px-2.5 py-1 rounded text-[12px] font-bold tracking-wider text-[#C0BDB8]">
          MIDAS
        </div>
        <div className="text-[13px] text-[#D8D8D8] font-semibold hidden sm:block">
          {t('common.subtitle')}
        </div>
        <span className="text-[#444444] hidden sm:inline">&bull;</span>
        <div className="text-[12px] text-[#888888] font-normal hidden md:block">
          {t('common.org')}
        </div>
      </div>

      {/* Right: Live Status & Controls */}
      <div className="flex items-center gap-3">
        {/* Live / Offline Status Badge */}
        <div className="flex items-center gap-2 text-[11px] bg-[#1C1C1C] border border-[#2A2A2A] px-2.5 py-1 rounded-md">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              isOffline ? 'bg-[#C98040]' : 'bg-[#4F9067] animate-pulse'
            }`}
          />
          <span className="text-[#CCCCCC] font-medium">
            {isOffline ? t('common.cachedFeed') : t('common.liveFeed')}
          </span>
          {lastSync && (
            <span className="text-[#666666] hidden lg:inline">
              ({new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-[#1C1C1C] border border-[#2A2A2A] text-[11px] rounded-md p-0.5 font-medium">
          {(['en', 'hi', 'mr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-2 py-0.5 rounded transition-all ${
                i18n.language === lang
                  ? 'bg-[#282828] text-[#EFEFEF] font-bold border border-[#383838]'
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
          className="bg-[#242424] hover:bg-[#2C2C2C] border border-[#353535] text-[#C0BDB8] px-3 py-1 rounded-md text-[12px] font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
          <span>{t('nav.chatbot')}</span>
        </button>
      </div>
    </header>
  );
}
