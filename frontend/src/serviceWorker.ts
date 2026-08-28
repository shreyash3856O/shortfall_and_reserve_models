/**
 * PWA Service Worker Registration & Cache Management.
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[MIDAS SW] Registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[MIDAS SW] Registration failed:', err);
        });
    });
  }
}
