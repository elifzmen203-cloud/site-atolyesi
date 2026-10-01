import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { currencyForLocale, formatApprox } from '../src/monetize/currency.js';
import { SITE_CONFIG } from '../src/config.js';

test('donate: visitor currency comes from locale region, then language', () => {
  assert.equal(currencyForLocale('tr-TR'), 'TRY');
  assert.equal(currencyForLocale('es-MX'), 'MXN');
  assert.equal(currencyForLocale('es-ES'), 'EUR');
  assert.equal(currencyForLocale('ru'), 'RUB');
  assert.equal(currencyForLocale('en-US'), 'USD');
  assert.equal(currencyForLocale('xx'), 'USD');
});

test('donate: approximate local amount is formatted, USD or missing rate gives null', () => {
  const tl = formatApprox(1, 41.2, 'TRY', 'tr-TR');
  assert.ok(tl && tl.includes('41'), `TRY formatted: ${tl}`);
  assert.equal(formatApprox(1, 1, 'USD', 'en-US'), null);
  assert.equal(formatApprox(1, undefined, 'EUR', 'es-ES'), null);
});

test('config: only public identifiers, AdSense id format when set', () => {
  const src = fs.readFileSync(new URL('../src/config.js', import.meta.url), 'utf-8');
  assert.ok(!/(api[_-]?key|secret|password|token)\s*:/i.test(src), 'config must not hold secrets');
  if (SITE_CONFIG.adsenseClient) {
    assert.match(SITE_CONFIG.adsenseClient, /^ca-pub-\d{10,20}$/);
  }
  if (SITE_CONFIG.donateUrl) assert.match(SITE_CONFIG.donateUrl, /^https:\/\//);
});
