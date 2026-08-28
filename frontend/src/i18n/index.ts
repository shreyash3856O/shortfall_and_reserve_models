import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ALL_TRANSLATIONS } from './translations';
import { SUPPORTED_LANGUAGES, isRTL, DEFAULT_LANGUAGE } from './languages';

// Initialize i18next resources with all bundled translation dictionaries
const resources: Record<string, { translation: any }> = {};

// Register pre-defined translations
Object.keys(ALL_TRANSLATIONS).forEach((langCode) => {
  resources[langCode] = {
    translation: ALL_TRANSLATIONS[langCode],
  };
});

// For any supported language without explicit full dictionary, generate fallback overlay with English
SUPPORTED_LANGUAGES.forEach((lang) => {
  if (!resources[lang.code]) {
    resources[lang.code] = {
      translation: {
        ...ALL_TRANSLATIONS.en,
        common: {
          ...ALL_TRANSLATIONS.en.common,
          systemName: 'MIDAS',
          subtitle: `${lang.name} • Mine Decision Support System`,
        },
        chat: {
          ...ALL_TRANSLATIONS.en.chat,
          title: `MIDAS AI Assistant (${lang.name})`,
        },
      },
    };
  }
});

const initialLang =
  (typeof localStorage !== 'undefined' && localStorage.getItem('midas_language')) ||
  DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Apply initial RTL and language attributes on DOM
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = isRTL(initialLang) ? 'rtl' : 'ltr';
}

/**
 * Dynamically switches website language, updates DOM direction,
 * saves to localStorage, and notifies components.
 */
export async function switchLanguage(langCode: string): Promise<void> {
  await i18n.changeLanguage(langCode);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = langCode;
    document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('midas_language', langCode);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('midas_language_changed', { detail: { langCode } })
    );
  }
}

export default i18n;
