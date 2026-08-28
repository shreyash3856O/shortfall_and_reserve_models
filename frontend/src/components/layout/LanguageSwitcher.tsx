import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, getLanguageConfig, LanguageConfig } from '../../i18n/languages';
import { switchLanguage } from '../../i18n';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = getLanguageConfig(i18n.language);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = async (lang: LanguageConfig) => {
    await switchLanguage(lang.code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Popular languages for fast top-row selection
  const popularCodes = ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'bho', 'raj'];
  const popularLanguages = SUPPORTED_LANGUAGES.filter((l) => popularCodes.includes(l.code));

  // Filter languages by search query
  const filteredLanguages = SUPPORTED_LANGUAGES.filter((l) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      l.name.toLowerCase().includes(query) ||
      l.nameEn.toLowerCase().includes(query) ||
      l.code.toLowerCase().includes(query) ||
      l.script.toLowerCase().includes(query) ||
      l.region.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button replacing the old EN/HI/MR segmented button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all select-none active:scale-95 ${
          isOpen
            ? 'bg-white/[0.12] border-white/[0.2] text-white shadow-md'
            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-[#CCCCCC] hover:text-white'
        }`}
        title="Switch Website Language (37 Supported Languages)"
        aria-label="Switch Language"
        aria-expanded={isOpen}
      >
        {/* Globe Icon */}
        <svg className="w-3.5 h-3.5 text-[#4F9067]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Current Active Language Name */}
        <span className="font-semibold text-white tracking-wide">
          {currentConfig.name}
        </span>
        <span className="text-[10px] text-[#888888] hidden xl:inline">
          ({currentConfig.code.toUpperCase()})
        </span>

        {/* Dropdown Chevron */}
        <svg
          className={`w-3 h-3 text-[#888888] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Language Switcher Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[480px] md:w-[560px] max-h-[520px] bg-[#14141A]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-pop-up">
          {/* Header & Search Bar */}
          <div className="p-3.5 border-b border-white/[0.08] bg-white/[0.02] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
                <span className="text-[13px] font-bold text-white">
                  {t('common.selectLanguage')}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30">
                  37 Languages
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#888888] hover:text-white p-1 rounded-lg hover:bg-white/[0.06] text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchLanguage')}
                autoFocus
                className="w-full bg-[#0E0E12] border border-white/[0.08] focus:border-[#4F9067] rounded-xl px-3.5 py-2 pl-9 text-[12px] text-white placeholder-[#666666] focus:outline-none transition-colors"
              />
              <svg
                className="w-4 h-4 text-[#666666] absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#888888] hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Popular Languages Quick Bar (when not searching) */}
            {!searchQuery && (
              <div className="pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                  {t('common.popular')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {popularLanguages.map((lang) => {
                    const isSelected = i18n.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#4F9067] text-white font-bold shadow-sm'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#CCCCCC] hover:text-white border border-white/[0.05]'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {lang.rtl && <span className="text-[9px] opacity-70">RTL</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Language Grid */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[340px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#666666] px-2 py-1">
              {searchQuery
                ? `Search Results (${filteredLanguages.length})`
                : t('common.allLanguages')}
            </div>

            {filteredLanguages.length === 0 ? (
              <div className="text-center py-8 text-[#888888] text-[12px]">
                No languages matching &ldquo;{searchQuery}&rdquo; found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredLanguages.map((lang) => {
                  const isSelected = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all group ${
                        isSelected
                          ? 'bg-white/[0.12] border border-white/[0.2] text-white shadow-sm'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] text-[#BBBBCC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Selected Indicator Checkmark */}
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                            isSelected
                              ? 'bg-[#4F9067] text-white'
                              : 'border border-white/[0.1] text-transparent group-hover:border-white/[0.3]'
                          }`}
                        >
                          ✓
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-white truncate">
                              {lang.name}
                            </span>
                            {lang.rtl && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-[#C98040]/20 text-[#C98040] border border-[#C98040]/30 font-semibold">
                                RTL
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#777788] truncate flex items-center gap-1">
                            <span>{lang.nameEn}</span>
                            <span>&bull;</span>
                            <span>{lang.region}</span>
                          </div>
                        </div>
                      </div>

                      {/* Script Tag */}
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-[#888899] border border-white/[0.04] flex-shrink-0">
                        {lang.script}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Info */}
          <div className="p-2.5 px-4 bg-white/[0.01] border-t border-white/[0.06] text-[10px] text-[#666666] flex items-center justify-between">
            <span>Instant sync across all dashboard views and AI chat</span>
            <span className="text-[#888888] font-mono">{currentConfig.locale}</span>
          </div>
        </div>
      )}
    </div>
  );
}
