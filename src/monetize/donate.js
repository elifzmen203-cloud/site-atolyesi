import { SITE_CONFIG } from '../config.js';
import { t } from '../i18n/index.js';
import { currencyForLocale, formatApprox } from './currency.js';

/**
 * "Bana kahve ısmarla" butonu. Ödemeyi bağış platformu alır; ziyaretçinin kartı tutarı kendi para
 * birimine kendisi çevirir. Biz yalnız "1 $ ≈ 41 ₺" gibi yaklaşık tutarı gösteririz.
 * Kur, anahtarsız ücretsiz bir servisten (open.er-api.com) günde en çok bir kez alınır ve tarayıcıda saklanır.
 */
const RATE_KEY = 'sa.usdRates';
const RATE_TTL = 12 * 60 * 60 * 1000;
let ratesPromise = null;

function cachedRates() {
  try {
    const saved = JSON.parse(localStorage.getItem(RATE_KEY) || 'null');
    if (saved && Date.now() - saved.time < RATE_TTL) return saved.rates;
  } catch (e) {
    // yoksay
  }
  return null;
}

function loadRates() {
  const cached = cachedRates();
  if (cached) return Promise.resolve(cached);
  if (!ratesPromise) {
    ratesPromise = fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const rates = data && data.rates;
        if (rates) {
          try {
            localStorage.setItem(RATE_KEY, JSON.stringify({ time: Date.now(), rates }));
          } catch (e) {
            // yoksay
          }
        }
        return rates || null;
      })
      .catch(() => null);
  }
  return ratesPromise;
}

export function renderDonateButton(extraClass = '') {
  if (!SITE_CONFIG.donateUrl) return null;
  const usd = SITE_CONFIG.donateUsd || 1;
  const a = document.createElement('a');
  a.className = `donate-btn ${extraClass}`.trim();
  a.href = SITE_CONFIG.donateUrl;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.title = t('donate.hint');
  const base = `☕ ${t('donate.cta')} · ${usd} $`;
  a.textContent = base;

  const locale = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
  const currency = currencyForLocale(locale);
  if (currency !== 'USD') {
    loadRates().then(rates => {
      const approx = formatApprox(usd, rates && rates[currency], currency, locale);
      if (approx) a.textContent = `${base} (≈ ${approx})`;
    });
  }
  return a;
}
