/** Ziyaretçinin diline/bölgesine göre para birimi ve yaklaşık tutar (saf fonksiyonlar, testli). */

const EURO = ['AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK'];

const REGION_CURRENCY = {
  TR: 'TRY', US: 'USD', GB: 'GBP', RU: 'RUB', UA: 'UAH', BY: 'BYN', KZ: 'KZT', AZ: 'AZN', GE: 'GEL',
  MX: 'MXN', AR: 'ARS', CO: 'COP', CL: 'CLP', PE: 'PEN', UY: 'UYU', VE: 'VES', BR: 'BRL',
  CA: 'CAD', AU: 'AUD', NZ: 'NZD', IN: 'INR', JP: 'JPY', KR: 'KRW', CN: 'CNY',
  CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN'
};
for (const r of EURO) REGION_CURRENCY[r] = 'EUR';

// Bölgesiz dil kodu için varsayılan ('tr' → TRY gibi).
const LANG_CURRENCY = { tr: 'TRY', ru: 'RUB', es: 'EUR', en: 'USD', de: 'EUR', fr: 'EUR', it: 'EUR', uk: 'UAH', ja: 'JPY' };

export function currencyForLocale(locale = 'en-US') {
  const [lang, region] = String(locale).replace('_', '-').split('-');
  if (region && REGION_CURRENCY[region.toUpperCase()]) return REGION_CURRENCY[region.toUpperCase()];
  return LANG_CURRENCY[(lang || '').toLowerCase()] || 'USD';
}

/** "1 $ ≈ 41 ₺" kısmındaki yerel tutar. Kur yoksa ya da para birimi USD ise null. */
export function formatApprox(usd, rate, currency, locale) {
  if (!rate || currency === 'USD' || !(rate > 0)) return null;
  const amount = usd * rate;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount < 10 ? 2 : 0
    }).format(amount);
  } catch (e) {
    return null;
  }
}
