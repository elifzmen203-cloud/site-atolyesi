import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generatePalette, contrastRatio, getWcagRating, hexToRgb, rgbToHex } from '../src/tools/palette.js';

test('palette: color conversions between hex and rgb work reliably', () => {
  assert.deepEqual(hexToRgb('#ffffff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.equal(rgbToHex(255, 255, 255), '#ffffff');
  assert.equal(rgbToHex(0, 0, 0), '#000000');
  assert.equal(rgbToHex(59, 91, 219), '#3b5bdb');
});

test('palette: contrast ratio follows standard WCAG 2.1 relative luminance formula', () => {
  // Pure black on pure white is exactly 21:1
  const maxRatio = contrastRatio('#000000', '#ffffff');
  assert.equal(maxRatio, 21);

  // Symmetry: white on black is also 21:1
  const reverseRatio = contrastRatio('#ffffff', '#000000');
  assert.equal(reverseRatio, 21);

  // Identical colors have ratio 1:1
  const minRatio = contrastRatio('#ffffff', '#ffffff');
  assert.equal(minRatio, 1);

  const sameBlue = contrastRatio('#3b5bdb', '#3b5bdb');
  assert.equal(sameBlue, 1);

  // WCAG rating check
  const highRating = getWcagRating(21);
  assert.equal(highRating.aaNormal, true);
  assert.equal(highRating.aaaNormal, true);
  assert.equal(highRating.badge, 'AAA');

  const lowRating = getWcagRating(2.5);
  assert.equal(lowRating.aaNormal, false);
  assert.equal(lowRating.aaaNormal, false);
  assert.equal(lowRating.badge, 'Yetersiz');
});

test('palette: generates 5 valid hex colors across all 4 harmony rules', () => {
  const rules = ['complementary', 'analogous', 'triadic', 'monochrome'];
  const testBases = ['#3b5bdb', '#e11d48', '#059669', '#d97706', '#8b5cf6'];
  const hexRegex = /^#[0-9a-fA-F]{6}$/;

  for (const base of testBases) {
    for (const rule of rules) {
      const palette = generatePalette(base, rule);
      assert.equal(palette.length, 5, `Must return 5 colors for ${base} / ${rule}`);

      const names = palette.map(p => p.name);
      assert.deepEqual(names, ['bg', 'ink', 'primary', 'accent', 'muted']);

      for (const color of palette) {
        assert.ok(
          hexRegex.test(color.hex),
          `Color "${color.name}" has invalid hex format: "${color.hex}" with rule ${rule}`
        );
      }
    }
  }
});
