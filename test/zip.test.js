import { test } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { makeZip } from '../src/generator/zip.js';
import { buildSite } from '../src/generator/build-site.js';

test('zip: generates a valid ZIP archive containing index.html, style.css, and README.txt', async () => {
  const generated = buildSite({
    name: 'Zip Test Boutique',
    sector: 'store',
    layout: 'modern'
  }, 'en');

  const zipOutput = await makeZip(generated);
  assert.ok(zipOutput, 'Zip output must be defined');

  // Verify archive structure with JSZip
  const loaded = await JSZip.loadAsync(zipOutput);

  const htmlFile = loaded.file('index.html');
  const cssFile = loaded.file('style.css');
  const readmeFile = loaded.file('README.txt');

  assert.ok(htmlFile, 'Archive must contain index.html');
  assert.ok(cssFile, 'Archive must contain style.css');
  assert.ok(readmeFile, 'Archive must contain README.txt');

  const htmlText = await htmlFile.async('text');
  const cssText = await cssFile.async('text');
  const readmeText = await readmeFile.async('text');

  assert.ok(htmlText.includes('<!doctype html>'), 'index.html in zip must contain <!doctype html>');
  assert.ok(htmlText.includes('Zip Test Boutique'), 'index.html in zip must contain business name');
  assert.ok(cssText.includes(':root'), 'style.css in zip must contain :root variables');
  assert.ok(readmeText.includes('Website Package'), 'README.txt in zip must contain guide content');
});
