import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSite, escapeHtml } from '../src/generator/build-site.js';
import { SECTORS } from '../src/generator/templates/sectors.js';

test('generator: escapes HTML characters to protect against XSS', () => {
  const dirty = `<script>alert("xss & 'evil'")</script>`;
  const escaped = escapeHtml(dirty);
  assert.equal(escaped.includes('<script>'), false);
  assert.equal(escaped.includes('&lt;script&gt;'), true);
  assert.equal(escaped.includes('&quot;'), true);
  assert.equal(escaped.includes('&#039;'), true);
  assert.equal(escaped.includes('&amp;'), true);
});

test('generator: builds valid semantic HTML5 for all 10 sectors across 4 languages', () => {
  const sectors = Object.keys(SECTORS);
  assert.equal(sectors.length, 10, 'Must have exactly 10 sectors defined');

  const languages = ['tr', 'en', 'ru', 'es'];

  for (const sector of sectors) {
    for (const lang of languages) {
      const config = {
        name: `Test Business <${sector}>`,
        sector,
        slogan: `Quality & Passion in <${sector}>`,
        services: ['Custom Service 1', 'Premium Service 2', 'Consulting & Advisory'],
        contact: {
          phone: '+1 555 111 2233',
          email: 'test@example.com',
          address: '42 Main St, City'
        },
        layout: 'modern',
        paletteKey: 'ocean',
        fontPairKey: 'modern'
      };

      const result = buildSite(config, lang);

      // Verify presence of core files
      assert.ok(result.html, `HTML output must be present for ${sector}/${lang}`);
      assert.ok(result.css, `CSS output must be present for ${sector}/${lang}`);
      assert.ok(result.readme, `README output must be present for ${sector}/${lang}`);

      // 1. Valid HTML5 skeleton
      assert.ok(result.html.startsWith('<!doctype html>'), `HTML must start with <!doctype html>`);
      assert.ok(result.html.includes(`<html lang="${lang}">`), `HTML must contain <html lang="${lang}">`);
      assert.ok(result.html.includes('<meta charset="utf-8">'), `HTML must contain meta charset`);
      assert.ok(result.html.includes('name="viewport"'), `HTML must contain meta viewport`);
      assert.ok(result.html.includes('<title>'), `HTML must contain title`);
      assert.ok(result.html.includes('<main>'), `HTML must contain main`);
      assert.ok(result.html.includes('</main>'), `HTML must contain closing main`);
      assert.ok(result.html.includes('<footer'), `HTML must contain footer`);
      assert.ok(result.html.includes('</footer>'), `HTML must contain closing footer`);

      // 2. Exactly one <h1> element
      const h1Count = (result.html.match(/<h1[\s>]/g) || []).length;
      assert.equal(h1Count, 1, `HTML must contain exactly one <h1> tag for ${sector}/${lang}`);

      // 3. User inputs are escaped (no unescaped < or > from config name)
      assert.equal(result.html.includes(`<${sector}>`), false, `Unescaped tag found in HTML for ${sector}/${lang}`);
      assert.ok(result.html.includes(`&lt;${sector}&gt;`), `Escaped tag must appear in HTML for ${sector}/${lang}`);

      // 4. CSS contains variables and layout rules
      assert.ok(result.css.includes(':root'), `CSS must include :root`);
      assert.ok(result.css.includes('--primary'), `CSS must define --primary`);
      assert.ok(result.css.includes('--font-heading'), `CSS must define --font-heading`);

      // 5. README contains business name
      assert.ok(result.readme.includes('Test Business'), `README must mention business name`);
    }
  }
});

test('generator: supports custom layout choices (minimal, modern, classic, bold)', () => {
  const layouts = ['minimal', 'modern', 'classic', 'bold'];
  for (const layout of layouts) {
    const res = buildSite({ name: 'Layout Test', layout }, 'tr');
    assert.ok(res.css.includes(layout.charAt(0).toUpperCase() + layout.slice(1) + ' Layout Style'), `CSS should contain ${layout} header comments`);
  }
});
