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
    <header className="h-14 bg-[#12151B] border-b border-[#232834] px-5 flex items-center justify-between select-none">
      {/* System Identification */}
      <div className="flex items-center gap-3">
        <div className="bg-[#1D222A] border border-[#2E3544] px-2.5 py-1 text-[12px] font-mono font-bold tracking-wider text-[#C8A96E]">
          MIDAS
        </div>
        <div className="text-[13px] text-[#E6EDF3] font-medium hidden sm:block">
          {t('common.subtitle')}
        </div>
        <span className="text-[#586069] hidden sm:inline">|</span>
        <div className="text-[12px] text-[#8B949E] font-mono hidden md:block">
          {t('common.org')}
        </div>
      </div>

      {/* Center/Right Status & Controls */}
      <div className="flex items-center gap-4">
        {/* Sync / Offline Posture Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#161A22] border border-[#232834] px-3 py-1.5">
          <span
            className={`w-2 h-2 rounded-none inline-block ${
              isOffline ? 'bg-[#E09B3D]' : 'bg-[#4E9F6E]'
            }`}
          />
          <span className="text-[#8B949E]">
            {isOffline ? t('common.cachedFeed') : t('common.liveFeed')}
          </span>
          {lastSync && (
            <span className="text-[#586069] hidden lg:inline">
              ({new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          )}
        </div>

        {/* Language Selector (EN / HI / MR) */}
        <div className="flex items-center bg-[#161A22] border border-[#232834] text-[11px] font-mono p-0.5">
          {(['en', 'hi', 'mr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-2 py-1 transition-colors ${
                i18n.language === lang
                  ? 'bg-[#232834] text-[#C8A96E] font-bold'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* NLP Assistant Toggle Button */}
        <button
          onClick={onOpenChat}
          className="bg-[#1D222A] hover:bg-[#232834] border border-[#2E3544] text-[#C8A96E] px-3 py-1.5 text-[12px] font-mono font-medium flex items-center gap-2 transition-colors"
        >
          <span>[?]</span>
          <span className="hidden sm:inline">{t('nav.chatbot')}</span>
        </button>
      </div>
    </header>
  );
}
