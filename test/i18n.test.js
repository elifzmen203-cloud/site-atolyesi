import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const i18nDir = path.resolve(__dirname, '../src/i18n');

test('i18n: tr, en, ru, es translation files have identical keys and non-empty values', () => {
  const languages = ['tr', 'en', 'ru', 'es'];
  const data = {};

  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    assert.ok(fs.existsSync(filePath), `Translation file exists: ${lang}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data[lang] = content;
  }

  const baseKeys = Object.keys(data.tr).sort();
  assert.ok(baseKeys.length > 20, 'Has sufficient base keys in tr.json');

  for (const lang of ['en', 'ru', 'es']) {
    const langKeys = Object.keys(data[lang]).sort();

    const missingInLang = baseKeys.filter(k => !(k in data[lang]));
    const extraInLang = langKeys.filter(k => !(k in data.tr));

    assert.deepEqual(
      missingInLang,
      [],
      `[${lang}.json] is missing keys present in [tr.json]: ${missingInLang.join(', ')}`
    );

    assert.deepEqual(
      extraInLang,
      [],
      `[${lang}.json] has extra keys not in [tr.json]: ${extraInLang.join(', ')}`
    );

    // Verify non-empty strings
    for (const key of baseKeys) {
      const val = data[lang][key];
      assert.equal(typeof val, 'string', `[${lang}.json] key "${key}" must be a string`);
      assert.ok(val.trim().length > 0, `[${lang}.json] key "${key}" must not be empty`);
    }
  }
});
