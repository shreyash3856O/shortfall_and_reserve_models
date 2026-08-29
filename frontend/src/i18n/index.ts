import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ALL_TRANSLATIONS } from './translations';
import { SUPPORTED_LANGUAGES, isRTL, DEFAULT_LANGUAGE } from './languages';
import { applyGoogleTranslate, initGoogleTranslate } from './googleTranslate';

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

// Apply initial RTL, language attributes, and Google Translate on load
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = isRTL(initialLang) ? 'rtl' : 'ltr';

  // Initialize Google Translate & apply saved language if not English
  initGoogleTranslate();
  if (initialLang !== 'en') {
    setTimeout(() => {
      applyGoogleTranslate(initialLang);
    }, 500);
  }
}

/**
 * Dynamically switches website language, invokes Google Translator
 * to translate the entire DOM (every element across vw/vh),
 * updates DOM direction, saves to localStorage, and notifies components.
 */
export async function switchLanguage(langCode: string): Promise<void> {
  // 1. Change React i18n state
  await i18n.changeLanguage(langCode);

  // 2. Set DOM attributes & RTL direction
  if (typeof document !== 'undefined') {
    document.documentElement.lang = langCode;
    document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
  }

  // 3. Save to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('midas_language', langCode);
  }

  // 4. Trigger Google Website Translator to translate the entire DOM across the viewport
  applyGoogleTranslate(langCode);

  // 5. Emit custom event for active listeners & chatbot drawer
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('midas_language_changed', { detail: { langCode } })
    );
  }
}

export default i18n;
