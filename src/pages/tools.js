import { t, getLang } from '../i18n/index.js';
import { generatePalette, contrastRatio, getWcagRating } from '../tools/palette.js';
import { FONT_PAIRS, getFontSnippet } from '../tools/fonts.js';
import { getCopyTemplates } from '../tools/copy-templates.js';
import { CODE_SNIPPETS } from '../tools/snippets.js';
import { PRESET_THEMES, THEME_CATEGORIES } from '../themes/presets.js';
import {
  rollRandomPalette,
  savePalette,
  getSavedPalettes,
  deletePalette,
  exportPalettesJson,
  importPalettesJson
} from '../color/palette-manager.js';
import { ensureWcagAa } from '../color/contrast.js';
import { escapeHtml } from '../generator/build-site.js';

export function renderToolsPage() {
  const container = document.createElement('div');
  container.className = 'container';

  let activeTab = 'palette';
  let baseColor = '#4f46e5';
  let harmonyRule = 'complementary';
  let copySector = 'cafe';
  let selectedCategory = 'all';

  // State for individual color roles
  let activePalette = {
    bg: '#fdfbf7',
    ink: '#292524',
    primary: '#4f46e5',
    accent: '#c2410c',
    muted: '#57534e'
  };

  const lockedRoles = new Set();

  function syncPaletteFromBase() {
    const generated = generatePalette(baseColor, harmonyRule);
    generated.forEach(c => {
      if (!lockedRoles.has(c.name)) {
        activePalette[c.name] = c.hex;
      }
    });
  }

  syncPaletteFromBase();

  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-msg';
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2500);
  }

  function copyToClipboard(text, successMsg = t('common.copied')) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(successMsg);
    });
  }

  function renderContent() {
    container.innerHTML = `
      <header style="margin-bottom: 2rem;">
        <h1 data-i18n="tools.title">${t('tools.title')}</h1>
        <p class="page-lead" data-i18n="tools.subtitle">${t('tools.subtitle')}</p>
      </header>

      <div class="tab-list" role="tablist">
        <button class="tab-btn ${activeTab === 'palette' ? 'active' : ''}" data-tab="palette" role="tab" data-i18n="tools.tab.palette">${t('tools.tab.palette')}</button>
        <button class="tab-btn ${activeTab === 'fonts' ? 'active' : ''}" data-tab="fonts" role="tab" data-i18n="tools.tab.fonts">${t('tools.tab.fonts')}</button>
        <button class="tab-btn ${activeTab === 'copy' ? 'active' : ''}" data-tab="copy" role="tab" data-i18n="tools.tab.copy">${t('tools.tab.copy')}</button>
        <button class="tab-btn ${activeTab === 'snippets' ? 'active' : ''}" data-tab="snippets" role="tab" data-i18n="tools.tab.snippets">${t('tools.tab.snippets')}</button>
      </div>

      <div class="tab-content">
        ${renderTabContent()}
      </div>
    `;

    bindEvents();
  }

  function renderTabContent() {
    if (activeTab === 'palette') {
      const inkBgRatio = contrastRatio(activePalette.ink, activePalette.bg);
      const inkBgRating = getWcagRating(inkBgRatio);

      const primaryBtnRatio = contrastRatio('#ffffff', activePalette.primary);
      const primaryBtnRating = getWcagRating(primaryBtnRatio);

      const hasContrastIssue = !inkBgRating.aaNormal || !primaryBtnRating.aaNormal;

      const roles = [
        { name: 'bg', hex: activePalette.bg },
        { name: 'ink', hex: activePalette.ink },
        { name: 'primary', hex: activePalette.primary },
        { name: 'accent', hex: activePalette.accent },
        { name: 'muted', hex: activePalette.muted }
      ];

      const savedList = getSavedPalettes();
      const filteredPresets = selectedCategory === 'all'
        ? PRESET_THEMES
        : PRESET_THEMES.filter(p => p.category === selectedCategory);

      return `
        <div class="tool-section">
          <!-- Controls row -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 2rem;">
            <div class="form-group" style="margin: 0; min-width: 170px;">
              <label class="form-label" for="palette-base-input" data-i18n="tools.palette.baseColor">${t('tools.palette.baseColor')}</label>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="color" id="palette-color-picker" value="${baseColor}" style="width: 44px; height: 38px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; padding: 2px;">
                <input type="text" id="palette-base-input" class="input" value="${baseColor}" style="max-width: 110px; font-family: monospace;">
              </div>
            </div>

            <div class="form-group" style="margin: 0; min-width: 200px;">
              <label class="form-label" for="palette-rule-select" data-i18n="tools.palette.rule">${t('tools.palette.rule')}</label>
              <select id="palette-rule-select" class="select">
                <option value="complementary" ${harmonyRule === 'complementary' ? 'selected' : ''}>${t('tools.palette.rule.complementary')}</option>
                <option value="analogous" ${harmonyRule === 'analogous' ? 'selected' : ''}>${t('tools.palette.rule.analogous')}</option>
                <option value="triadic" ${harmonyRule === 'triadic' ? 'selected' : ''}>${t('tools.palette.rule.triadic')}</option>
                <option value="monochrome" ${harmonyRule === 'monochrome' ? 'selected' : ''}>${t('tools.palette.rule.monochrome')}</option>
              </select>
            </div>

            <button id="btn-roll-dice" class="btn btn-secondary" style="height: 38px;">
              🎲 <span data-i18n="tools.palette.rollDice">${t('tools.palette.rollDice')}</span>
            </button>
          </div>

          <!-- Color Swatches with Individual Color Pickers and Locks -->
          <div class="palette-swatches">
            ${roles.map(c => `
              <div class="swatch-card">
                <div class="swatch-color" style="background-color: ${c.hex};">
                  ${c.hex}
                </div>
                <div class="swatch-info" style="display: flex; flex-direction: column; gap: 0.35rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="swatch-label" style="font-weight: 700;">${t(`tools.palette.role.${c.name}`)}</p>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; cursor: pointer;">
                      <input type="checkbox" class="lock-role-checkbox" data-role="${c.name}" ${lockedRoles.has(c.name) ? 'checked' : ''}>
                      <span>${lockedRoles.has(c.name) ? '🔒' : '🔓'}</span>
                    </label>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="color" class="swatch-role-picker" data-role="${c.name}" value="${c.hex}" style="width: 32px; height: 28px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; padding: 1px;">
                    <span class="swatch-hex" style="font-size: 12px;">${c.hex}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Contrast Warning & Fix Banner -->
          ${hasContrastIssue ? `
            <div style="margin: 1.5rem 0; padding: 1rem 1.25rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="color: #9f1239; font-weight: 600; font-size: 0.95rem;">
                ⚠️ <span data-i18n="tools.palette.contrastWarning">${t('tools.palette.contrastWarning')}</span>
              </div>
              <button id="btn-fix-contrast" class="btn btn-sm btn-primary">
                ✨ <span data-i18n="tools.palette.fixContrast">${t('tools.palette.fixContrast')}</span>
              </button>
            </div>
          ` : ''}

          <!-- WCAG Contrast Evaluation -->
          <div class="card-box" style="margin: 2rem 0; background: var(--bg);">
            <h3 style="margin-bottom: 1rem;" data-i18n="tools.palette.contrast">${t('tools.palette.contrast')} (WCAG 2.1)</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
              <div style="padding: 1rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-weight: 600; margin-bottom: 0.35rem;">${t('tools.contrast.inkBg')}</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${inkBgRatio}:1</div>
                <span class="contrast-badge ${inkBgRating.aaNormal ? 'pass' : 'fail'}">${t(`tools.contrast.level.${inkBgRating.level}`)} (${t('tools.contrast.bodyText')})</span>
              </div>
              <div style="padding: 1rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-weight: 600; margin-bottom: 0.35rem;">${t('tools.contrast.button')}</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${primaryBtnRatio}:1</div>
                <span class="contrast-badge ${primaryBtnRating.aaNormal ? 'pass' : 'fail'}">${t(`tools.contrast.level.${primaryBtnRating.level}`)} (${t('tools.contrast.whiteButton')})</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem;">
            <button id="btn-copy-palette-css" class="btn btn-secondary">
              📋 <span data-i18n="tools.palette.copyCss">${t('tools.palette.copyCss')}</span>
            </button>
            <button id="btn-apply-palette-gen" class="btn btn-primary">
              ⚡ <span data-i18n="tools.palette.applyToGen">${t('tools.palette.applyToGen')}</span>
            </button>
          </div>

          <!-- Paletlerim (Saved Palettes) Section -->
          <section class="card-box" style="margin-bottom: 3rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
              <h3 data-i18n="tools.palette.myPalettes">${t('tools.palette.myPalettes')} (${savedList.length}/50)</h3>
              <div style="display: flex; gap: 0.5rem;">
                <button id="btn-export-palettes" class="btn btn-outline btn-sm">
                  📤 <span data-i18n="tools.palette.exportJson">${t('tools.palette.exportJson')}</span>
                </button>
                <label class="btn btn-outline btn-sm" style="margin: 0; cursor: pointer;">
                  📥 <span data-i18n="tools.palette.importJson">${t('tools.palette.importJson')}</span>
                  <input type="file" id="import-json-file" accept=".json" style="display: none;">
                </label>
              </div>
            </div>

            <!-- Save Form -->
            <div style="display: flex; gap: 0.75rem; max-width: 440px; margin-bottom: 1.5rem;">
              <input type="text" id="save-palette-name-input" class="input" placeholder="${t('tools.palette.paletteName')}">
              <button id="btn-save-current-palette" class="btn btn-secondary" style="white-space: nowrap;">
                💾 <span data-i18n="tools.palette.saveCurrent">${t('tools.palette.saveCurrent')}</span>
              </button>
            </div>

            <!-- Saved Palettes Grid -->
            ${savedList.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
                ${savedList.map(item => `
                  <div style="border: 1px solid var(--border); border-radius: 8px; padding: 1rem; background: var(--bg); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
                    <div>
                      <div style="font-weight: 700; margin-bottom: 0.5rem;">${escapeHtml(item.name)}</div>
                      <div style="display: flex; height: 28px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border);">
                        <div style="flex:1; background:${item.palette.bg};" title="bg"></div>
                        <div style="flex:1; background:${item.palette.ink};" title="ink"></div>
                        <div style="flex:1; background:${item.palette.primary};" title="primary"></div>
                        <div style="flex:1; background:${item.palette.accent};" title="accent"></div>
                        <div style="flex:1; background:${item.palette.muted};" title="muted"></div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                      <button class="btn btn-outline btn-sm btn-apply-saved-pal" data-id="${item.id}" data-i18n="common.apply">${t('common.apply')}</button>
                      <button class="btn btn-outline btn-sm btn-delete-saved-pal" data-id="${item.id}" style="color: #e11d48;" data-i18n="tools.palette.delete">${t('tools.palette.delete')}</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `<p style="color: var(--muted); font-size: 0.9rem;" data-i18n="tools.palette.noSaved">${t('tools.palette.noSaved')}</p>`}
          </section>

          <!-- Preset Themes (~40 themes) Section -->
          <section class="card-box">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <h3 data-i18n="tools.palette.presets">${t('tools.palette.presets')} (${PRESET_THEMES.length})</h3>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label for="filter-theme-category" class="form-label" style="margin: 0; font-size: 0.85rem;" data-i18n="tools.palette.filterCategory">${t('tools.palette.filterCategory')}:</label>
                <select id="filter-theme-category" class="select" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.85rem;">
                  ${THEME_CATEGORIES.map(cat => `
                    <option value="${cat}" ${selectedCategory === cat ? 'selected' : ''}>${cat === 'all' ? t('tools.palette.all') : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
              ${filteredPresets.map(preset => `
                <div style="border: 1px solid var(--border); border-radius: 8px; padding: 1rem; background: var(--bg); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <strong style="font-size: 0.95rem;">${preset.name}</strong>
                      <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: var(--surface); color: var(--muted); border: 1px solid var(--border);">${preset.category}</span>
                    </div>
                    <div style="display: flex; height: 28px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border);">
                      <div style="flex:1; background:${preset.palette.bg};" title="bg"></div>
                      <div style="flex:1; background:${preset.palette.ink};" title="ink"></div>
                      <div style="flex:1; background:${preset.palette.primary};" title="primary"></div>
                      <div style="flex:1; background:${preset.palette.accent};" title="accent"></div>
                      <div style="flex:1; background:${preset.palette.muted};" title="muted"></div>
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-apply-preset" data-id="${preset.id}" data-i18n="common.apply">
                    ${t('common.apply')}
                  </button>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `;
    }

    if (activeTab === 'fonts') {
      const sample = t('tools.fonts.sampleText');
      return `
        <div class="tool-section">
          <div class="font-cards-grid">
            ${FONT_PAIRS.map(pair => `
              <div class="font-card">
                <div>
                  <div class="font-card-header">
                    <strong>${pair.name}</strong>
                    <span class="font-category">${t(`tools.fonts.cat.${pair.id}`)}</span>
                  </div>
                  <div class="font-preview-heading" style="font-family: ${pair.heading};">
                    ${pair.name.split('+')[0].trim()}
                  </div>
                  <p class="font-preview-body" style="font-family: ${pair.body};">
                    ${sample}
                  </p>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                  <button class="btn btn-outline btn-sm btn-copy-font" data-id="${pair.id}">
                    <span data-i18n="tools.fonts.copyCode">${t('tools.fonts.copyCode')}</span>
                  </button>
                  <button class="btn btn-secondary btn-sm btn-apply-font" data-id="${pair.id}">
                    <span data-i18n="tools.fonts.applyToGen">${t('tools.fonts.applyToGen')}</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (activeTab === 'copy') {
      const lang = getLang();
      const templates = getCopyTemplates(copySector, lang);
      const sectorsList = ['cafe', 'restaurant', 'barber', 'lawyer', 'photographer', 'portfolio', 'hotel', 'store', 'clinic', 'agency'];

      return `
        <div class="tool-section">
          <div class="form-group" style="max-width: 320px; margin-bottom: 2rem;">
            <label class="form-label" for="copy-sector-select" data-i18n="tools.copy.selectSector">${t('tools.copy.selectSector')}</label>
            <select id="copy-sector-select" class="select">
              ${sectorsList.map(s => `
                <option value="${s}" ${copySector === s ? 'selected' : ''} data-i18n="gen.sector.${s}">${t(`gen.sector.${s}`)}</option>
              `).join('')}
            </select>
          </div>

          <div class="copy-group">
            <h3 data-i18n="tools.copy.heroHeadlines">${t('tools.copy.heroHeadlines')}</h3>
            <div class="copy-list">
              ${templates.heroHeadlines.map(text => `
                <div class="copy-item">
                  <span>${text}</span>
                  <button class="btn btn-outline btn-sm btn-copy-text" data-text="${text.replace(/"/g, '&quot;')}" data-i18n="common.copy">${t('common.copy')}</button>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="copy-group">
            <h3 data-i18n="tools.copy.ctas">${t('tools.copy.ctas')}</h3>
            <div class="copy-list">
              ${templates.ctas.map(text => `
                <div class="copy-item">
                  <span>${text}</span>
                  <button class="btn btn-outline btn-sm btn-copy-text" data-text="${text.replace(/"/g, '&quot;')}" data-i18n="common.copy">${t('common.copy')}</button>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="copy-group">
            <h3 data-i18n="tools.copy.aboutSentences">${t('tools.copy.aboutSentences')}</h3>
            <div class="copy-list">
              ${templates.aboutSentences.map(text => `
                <div class="copy-item">
                  <span>${text}</span>
                  <button class="btn btn-outline btn-sm btn-copy-text" data-text="${text.replace(/"/g, '&quot;')}" data-i18n="common.copy">${t('common.copy')}</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    if (activeTab === 'snippets') {
      const snippets = Object.values(CODE_SNIPPETS);
      return `
        <div class="tool-section">
          <div class="snippet-grid">
            ${snippets.map(s => `
              <div class="snippet-card">
                <div class="snippet-preview">
                  ${s.id === 'button' ? `<button class="btn btn-primary" style="margin-right:8px;">${t('tools.snippets.demo.start')}</button><button class="btn btn-outline">${t('tools.snippets.demo.details')}</button>` : ''}
                  ${s.id === 'card' ? `<div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; width:220px;"><div style="font-weight:700;">${t('tools.snippets.demo.cardTitle')}</div><p style="font-size:0.85rem; color:#64748b; margin:0.5rem 0;">${t('tools.snippets.demo.cardText')}</p><span style="color:#3b5bdb; font-size:0.85rem; font-weight:600;">${t('tools.snippets.demo.cardLink')} &rarr;</span></div>` : ''}
                  ${s.id === 'navbar' ? `<div style="background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 1rem; width:100%; display:flex; justify-content:space-between; align-items:center;"><strong>Logo</strong><span style="font-size:0.8rem; color:#64748b;">${t('tools.snippets.demo.navLinks')}</span></div>` : ''}
                  ${s.id === 'footer' ? `<div style="background:#1f2430; color:#fff; border-radius:6px; padding:1rem; width:100%; text-align:center; font-size:0.85rem;">© ${new Date().getFullYear()} ${t('tools.snippets.demo.footer')}</div>` : ''}
                </div>
                <div class="snippet-body">
                  <h3 style="margin-bottom: 0.5rem;">${t(`tools.snippets.${s.id}`)}</h3>
                  <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button class="btn btn-outline btn-sm btn-copy-html" data-id="${s.id}" data-i18n="tools.snippets.copyHtml">${t('tools.snippets.copyHtml')}</button>
                    <button class="btn btn-outline btn-sm btn-copy-css" data-id="${s.id}" data-i18n="tools.snippets.copyCss">${t('tools.snippets.copyCss')}</button>
                  </div>
                  <pre class="code-box"><code>${escapeCode(s.html)}</code></pre>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }

  function escapeCode(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindEvents() {
    // Tabs
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        renderContent();
      });
    });

    if (activeTab === 'palette') {
      const picker = container.querySelector('#palette-color-picker');
      const input = container.querySelector('#palette-base-input');
      const ruleSelect = container.querySelector('#palette-rule-select');

      picker?.addEventListener('input', (e) => {
        baseColor = e.target.value;
        if (input) input.value = baseColor;
      });

      picker?.addEventListener('change', (e) => {
        baseColor = e.target.value;
        if (input) input.value = baseColor;
        syncPaletteFromBase();
        renderContent();
      });

      input?.addEventListener('change', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          baseColor = val;
          syncPaletteFromBase();
          renderContent();
        }
      });

      ruleSelect?.addEventListener('change', (e) => {
        harmonyRule = e.target.value;
        syncPaletteFromBase();
        renderContent();
      });

      // Individual color pickers: update swatch DOM on input, re-render only on change
      container.querySelectorAll('.swatch-role-picker').forEach(el => {
        el.addEventListener('input', (e) => {
          const role = el.getAttribute('data-role');
          activePalette[role] = e.target.value;
          const card = el.closest('.swatch-card');
          if (card) {
            const colorBox = card.querySelector('.swatch-color');
            if (colorBox) {
              colorBox.style.backgroundColor = e.target.value;
              colorBox.textContent = e.target.value;
            }
            const hexSpan = card.querySelector('.swatch-hex');
            if (hexSpan) hexSpan.textContent = e.target.value;
          }
        });

        el.addEventListener('change', () => {
          renderContent();
        });
      });

      // Locks
      container.querySelectorAll('.lock-role-checkbox').forEach(el => {
        el.addEventListener('change', (e) => {
          const role = el.getAttribute('data-role');
          if (e.target.checked) {
            lockedRoles.add(role);
          } else {
            lockedRoles.delete(role);
          }
          renderContent();
        });
      });

      // Zar At (Roll dice)
      container.querySelector('#btn-roll-dice')?.addEventListener('click', () => {
        activePalette = rollRandomPalette(activePalette, Array.from(lockedRoles));
        baseColor = activePalette.primary;
        renderContent();
      });

      // Düzelt (Auto-fix contrast)
      container.querySelector('#btn-fix-contrast')?.addEventListener('click', () => {
        activePalette.ink = ensureWcagAa(activePalette.ink, activePalette.bg, 4.5);
        activePalette.primary = ensureWcagAa(activePalette.primary, '#ffffff', 4.5);
        renderContent();
      });

      // Copy CSS
      container.querySelector('#btn-copy-palette-css')?.addEventListener('click', () => {
        const cssLines = Object.entries(activePalette).map(([k, hex]) => `  --${k}: ${hex};`).join('\n');
        const css = `:root {\n${cssLines}\n}`;
        copyToClipboard(css);
      });

      // Apply to Generator
      container.querySelector('#btn-apply-palette-gen')?.addEventListener('click', () => {
        sessionStorage.setItem('sa.customPalette', JSON.stringify(activePalette));
        showToast(t('tools.appliedToGen'));
        window.location.hash = '#/';
      });

      // Save Current Palette
      container.querySelector('#btn-save-current-palette')?.addEventListener('click', () => {
        const nameInput = container.querySelector('#save-palette-name-input');
        const name = nameInput ? nameInput.value : '';
        const defaultName = t('tools.palette.defaultName');
        const res = savePalette(name, activePalette, localStorage, defaultName);
        if (res.success) {
          showToast(t('common.copied'));
          renderContent();
        } else {
          const errMsg = res.errorCode === 'limitReached' ? t('tools.palette.limitReached') : res.error;
          showToast(errMsg);
        }
      });

      // Apply Saved Palette
      container.querySelectorAll('.btn-apply-saved-pal').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const saved = getSavedPalettes().find(p => p.id === id);
          if (saved) {
            activePalette = Object.assign({}, saved.palette);
            baseColor = activePalette.primary || baseColor;
            renderContent();
          }
        });
      });

      // Delete Saved Palette
      container.querySelectorAll('.btn-delete-saved-pal').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          deletePalette(id);
          renderContent();
        });
      });

      // Export JSON
      container.querySelector('#btn-export-palettes')?.addEventListener('click', () => {
        const json = exportPalettesJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'paletlerim.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // Import JSON
      container.querySelector('#import-json-file')?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const defaultImportName = t('tools.palette.importedName');
          const res = importPalettesJson(event.target.result, localStorage, defaultImportName);
          if (res.success) {
            showToast(t('tools.palette.importSuccess'));
            renderContent();
          } else {
            showToast(res.error);
          }
        };
        reader.readAsText(file);
      });

      // Filter category
      container.querySelector('#filter-theme-category')?.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        renderContent();
      });

      // Apply preset
      container.querySelectorAll('.btn-apply-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const preset = PRESET_THEMES.find(p => p.id === id);
          if (preset) {
            activePalette = Object.assign({}, preset.palette);
            baseColor = activePalette.primary || baseColor;
            renderContent();
          }
        });
      });
    }

    if (activeTab === 'fonts') {
      container.querySelectorAll('.btn-copy-font').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const pair = FONT_PAIRS.find(p => p.id === id);
          if (pair) {
            copyToClipboard(getFontSnippet(pair));
          }
        });
      });

      container.querySelectorAll('.btn-apply-font').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const pair = FONT_PAIRS.find(p => p.id === id);
          if (pair) {
            sessionStorage.setItem('sa.customFont', JSON.stringify({
              heading: pair.heading,
              body: pair.body,
              googleUrl: pair.googleUrl
            }));
            showToast(t('gen.buildBtn'));
            window.location.hash = '#/';
          }
        });
      });
    }

    if (activeTab === 'copy') {
      const sectorSelect = container.querySelector('#copy-sector-select');
      sectorSelect?.addEventListener('change', (e) => {
        copySector = e.target.value;
        renderContent();
      });

      container.querySelectorAll('.btn-copy-text').forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-text');
          copyToClipboard(text);
        });
      });
    }

    if (activeTab === 'snippets') {
      container.querySelectorAll('.btn-copy-html').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const snippet = CODE_SNIPPETS[id];
          if (snippet) copyToClipboard(snippet.html);
        });
      });

      container.querySelectorAll('.btn-copy-css').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const snippet = CODE_SNIPPETS[id];
          if (snippet) copyToClipboard(snippet.css);
        });
      });
    }
  }

  renderContent();
  return container;
}
