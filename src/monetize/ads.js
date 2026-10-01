import { SITE_CONFIG } from '../config.js';
import { t } from '../i18n/index.js';

/**
 * Google AdSense. Yayıncı kimliği boşsa hiçbir şey yüklenmez.
 * Reklam alanları #app'in DIŞINDA (en üst ve en alt) bir kez kurulur; dil değişiminde yeniden
 * çizilmez, araçların ve butonların yanına girmez. Tatlım bu alanları içerik sayar ve yaklaşmaz
 * (AdSense, reklama tıklamaya teşvik eden her şeyi yasaklar).
 */
let loaded = false;

export function adsEnabled() {
  return /^ca-pub-\d{10,20}$/.test(SITE_CONFIG.adsenseClient || '');
}

function slot(name) {
  const id = SITE_CONFIG.adSlots && SITE_CONFIG.adSlots[name];
  if (!id) return null;
  const box = document.createElement('div');
  box.className = `ad-slot ad-${name}`;
  box.setAttribute('aria-label', t('ads.label'));
  const label = document.createElement('div');
  label.className = 'ad-label';
  label.textContent = t('ads.label');
  const ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.display = 'block';
  ins.dataset.adClient = SITE_CONFIG.adsenseClient;
  ins.dataset.adSlot = id;
  ins.dataset.adFormat = 'auto';
  ins.dataset.fullWidthResponsive = 'true';
  box.append(label, ins);
  return box;
}

export function initAds() {
  if (loaded || typeof document === 'undefined' || !adsEnabled()) return;
  loaded = true;

  // Betik doğrulama için index.html'de de bulunur (Google'ın botu ham HTML'e bakar); iki kez yüklenmez.
  if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.adsenseClient}`;
    document.head.appendChild(script);
  }

  const app = document.getElementById('app');
  const top = slot('top');
  const bottom = slot('bottom');
  if (top) app.before(top);
  if (bottom) app.after(bottom);
  for (const box of [top, bottom]) {
    if (box) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
}
