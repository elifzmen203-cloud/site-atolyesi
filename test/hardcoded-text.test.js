import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../src');

// Arayüzü çizen dosyalar: görünen metin yalnız t() ile gelmeli (PROJE_KURALLARI: kodda sabit metin olmaz).
const uiFiles = [
  'main.js',
  ...fs.readdirSync(path.join(src, 'pages')).filter(f => f.endsWith('.js')).map(f => `pages/${f}`),
  'generator/form.js'
];

// Bilerek sabit kalan satırlar: dil seçicide dilin kendi adı ve örnek işletme verisi.
const allowed = [/tr: 'Türkçe'/, /address: 'Moda Caddesi/];

const read = rel => fs.readFileSync(path.join(src, rel), 'utf-8');

test('UI files contain no hardcoded Turkish text (use t() keys)', () => {
  const offenders = [];
  for (const rel of uiFiles) {
    read(rel).split('\n').forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      if (/[çğıöşüÇĞİÖŞÜ]/.test(line) && !allowed.some(re => re.test(line))) {
        offenders.push(`${rel}:${i + 1}: ${trimmed.slice(0, 100)}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `Hardcoded Turkish text found:\n${offenders.join('\n')}`);
});

test('every static t() key used in UI files exists in tr.json', () => {
  const tr = JSON.parse(fs.readFileSync(path.join(src, 'i18n/tr.json'), 'utf-8'));
  const missing = [];
  for (const rel of uiFiles) {
    for (const m of read(rel).matchAll(/\bt\(\s*(['"`])([^'"`$]+)\1/g)) {
      if (!(m[2] in tr)) missing.push(`${rel}: ${m[2]}`);
    }
  }
  assert.deepEqual(missing, [], `Missing i18n keys:\n${missing.join('\n')}`);
});
