/**
 * Google Website Translator programmatic integration.
 * Enables whole-page DOM translation across all 37 Indian and regional languages.
 */

// Mapping of internal 37 language codes to Google Translate supported language codes
export const GOOGLE_TRANSLATE_LANG_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  mr: 'mr',
  te: 'te',
  ta: 'ta',
  gu: 'gu',
  ur: 'ur',
  kn: 'kn',
  or: 'or',
  ml: 'ml',
  pa: 'pa',
  as: 'as',
  mai: 'mai',
  sa: 'sa',
  kok: 'gom', // Konkani (gom)
  ks: 'ks',
  ne: 'ne',
  sd: 'sd',
  doi: 'doi',
  mni: 'mni-Mtei',
  brx: 'brx',
  sat: 'sat',
  bho: 'bho',
  raj: 'hi',
  mag: 'bho',
  cgg: 'hi',
  bgc: 'hi',
  awa: 'hi',
  tcy: 'kn',
  gbm: 'hi',
  kfy: 'hi',
  mtr: 'hi',
  mwr: 'hi',
  bfy: 'hi',
  bge: 'hi',
  kha: 'en',
};

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

/**
 * Initializes Google Translate element script if not already present.
 */
export function initGoogleTranslate(): void {
  if (typeof window === 'undefined') return;

  // Define global init callback
  window.googleTranslateElementInit = function () {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
        },
        'google_translate_element'
      );
    }
  };

  // Inject hidden translate container if missing
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Inject Google Translate script
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}

/**
 * Sets the googtrans cookie and triggers Google Translate for the entire page.
 */
export function applyGoogleTranslate(langCode: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const targetLang = GOOGLE_TRANSLATE_LANG_MAP[langCode] || langCode;

  // 1. Set Google Translate cookies for whole page
  const cookieValue = `/en/${targetLang}`;
  const domain = window.location.hostname;

  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
  if (domain.includes('.')) {
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
  }

  // 2. Programmatically select in Google Translate combo element
  const triggerCombo = () => {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      if (combo.value !== targetLang) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event('change'));
      }
      return true;
    }
    return false;
  };

  if (!triggerCombo()) {
    // Retry periodically if Google Translate combo element is still loading
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerCombo() || attempts > 20) {
        clearInterval(interval);
      }
    }, 200);
  }
}
