import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ALL_TRANSLATIONS } from './translations';
import { SUPPORTED_LANGUAGES, isRTL, DEFAULT_LANGUAGE } from './languages';
import { executeWholePageTranslation } from './autoTranslator';

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
          systemName: 'CaveKrave',
          subtitle: `${lang.name} • Mine Decision Support System`,
        },
        chat: {
          ...ALL_TRANSLATIONS.en.chat,
          title: `CaveKrave AI Assistant (${lang.name})`,
        },
      },
    };
  }
});

const initialLang =
  (typeof localStorage !== 'undefined' && localStorage.getItem('cavekrave_language')) ||
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

// Apply initial RTL, language attributes, and Whole-DOM Translate on load
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = isRTL(initialLang) ? 'rtl' : 'ltr';

  if (initialLang !== 'en') {
    setTimeout(() => {
      executeWholePageTranslation(initialLang);
    }, 400);
  }
}

/**
 * Dynamically switches website language, executes In-DOM text translation
 * + Google Website Translator to translate the entire DOM (every element across vw/vh),
 * updates DOM direction, saves to localStorage, and notifies components.
 */
export async function switchLanguage(langCode: string): Promise<void> {
  // 1. Change React i18n state across all React components
  await i18n.changeLanguage(langCode);

  // 2. Set DOM attributes & RTL direction
  if (typeof document !== 'undefined') {
    document.documentElement.lang = langCode;
    document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
  }

  // 3. Save to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cavekrave_language', langCode);
  }

  // 4. Trigger In-DOM translation + Google Website Translator across the entire viewport
  executeWholePageTranslation(langCode);

  // 5. Emit custom event for active listeners & chatbot drawer
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cavekrave_language_changed', { detail: { langCode } })
    );
  }
}

export default i18n;
