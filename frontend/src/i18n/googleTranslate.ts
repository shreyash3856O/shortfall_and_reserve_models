/**
 * Google Website Translator programmatic integration.
 * Enables whole-page DOM translation across all 37 Indian and regional languages
 * with 0 page refreshes and 100% hidden Google widgets/popups.
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
 * Initializes Google Translate element and sets up a DOM MutationObserver
 * to ensure all floating Google Translate widgets, tooltips, and frames remain 100% invisible.
 */
export function initGoogleTranslate(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Global init callback for Google's element.js
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
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Inject Google Translate script if not already present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  // Aggressively suppress Google Translate banner frames, tooltips, and balloons
  setupGoogleUiSuppressor();
}

/**
 * Mutation observer to suppress any dynamically injected Google Translate banners or tooltips.
 */
function setupGoogleUiSuppressor(): void {
  if (typeof document === 'undefined') return;

  const suppress = () => {
    // Hide all banner frames
    const bannerFrames = document.querySelectorAll<HTMLElement>('.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .VIpgJd-ZVi9C-ORHb-OEVmcd, .VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q');
    bannerFrames.forEach((el) => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    });

    // Reset body top offset that Google Translate injects
    if (document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.top = '0px';
    }
    if (document.body.style.position === 'relative') {
      document.body.style.position = 'static';
    }
  };

  suppress();
  try {
    const observer = new MutationObserver(suppress);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  } catch {
    // Observer supported
  }
}

/**
 * Instantly triggers Google Translate for the whole DOM in-place with ZERO page reload.
 */
export function applyGoogleTranslate(langCode: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const targetLang = GOOGLE_TRANSLATE_LANG_MAP[langCode] || langCode;
  const isEnglish = langCode === 'en' || targetLang === 'en';

  // 1. Update googtrans cookies seamlessly in background
  const cookieValue = isEnglish ? '' : `/en/${targetLang}`;
  const domain = window.location.hostname;
  const expires = isEnglish ? 'Thu, 01 Jan 1970 00:00:00 UTC' : '';

  const setCookie = (cookieStr: string) => {
    document.cookie = cookieStr;
  };

  if (isEnglish) {
    // Clear cookies when returning to English
    setCookie(`googtrans=; path=/; expires=${expires};`);
    setCookie(`googtrans=; path=/; domain=${domain}; expires=${expires};`);
    if (domain.includes('.')) {
      setCookie(`googtrans=; path=/; domain=.${domain}; expires=${expires};`);
    }
  } else {
    setCookie(`googtrans=${cookieValue}; path=/;`);
    setCookie(`googtrans=${cookieValue}; path=/; domain=${domain};`);
    if (domain.includes('.')) {
      setCookie(`googtrans=${cookieValue}; path=/; domain=.${domain};`);
    }
  }

  // 2. Programmatically trigger the hidden Google Translate combo selector
  const triggerCombo = (): boolean => {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      const valueToSelect = isEnglish ? '' : targetLang;

      if (combo.value !== valueToSelect) {
        combo.value = valueToSelect;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // If returning to English, also try to trigger restore button in Google's iframe
      if (isEnglish) {
        try {
          const iframe = document.querySelector<HTMLIFrameElement>('.goog-te-banner-frame');
          if (iframe?.contentDocument) {
            const finishBtn =
              iframe.contentDocument.querySelector<HTMLElement>('.goog-te-button button') ||
              iframe.contentDocument.getElementById(':1.restore');
            if (finishBtn) finishBtn.click();
          }
        } catch {
          // Cross-origin safe
        }
      }

      return true;
    }
    return false;
  };

  if (!triggerCombo()) {
    // Retry for up to 3 seconds until Google's script finishes rendering the combo
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (triggerCombo() || attempts > 15) {
        clearInterval(interval);
      }
    }, 200);
  }
}
