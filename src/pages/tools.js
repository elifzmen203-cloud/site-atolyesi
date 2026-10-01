import { t, getLang } from '../i18n/index.js';
import { generatePalette, contrastRatio, getWcagRating } from '../tools/palette.js';
import { FONT_PAIRS, getFontSnippet } from '../tools/fonts.js';
import { getCopyTemplates } from '../tools/copy-templates.js';
import { CODE_SNIPPETS } from '../tools/snippets.js';

export function renderToolsPage() {
  const container = document.createElement('div');
  container.className = 'container';

  let activeTab = 'palette';
  let baseColor = '#3b5bdb';
  let harmonyRule = 'complementary';
  let copySector = 'cafe';

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
      const colors = generatePalette(baseColor, harmonyRule);
      const bgHex = colors.find(c => c.name === 'bg').hex;
      const inkHex = colors.find(c => c.name === 'ink').hex;
      const primaryHex = colors.find(c => c.name === 'primary').hex;

      const inkBgRatio = contrastRatio(inkHex, bgHex);
      const inkBgRating = getWcagRating(inkBgRatio);

      const primaryBtnRatio = contrastRatio('#ffffff', primaryHex);
      const primaryBtnRating = getWcagRating(primaryBtnRatio);

      return `
        <div class="tool-section">
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 2rem;">
            <div class="form-group" style="margin: 0; min-width: 180px;">
              <label class="form-label" for="palette-base-input" data-i18n="tools.palette.baseColor">${t('tools.palette.baseColor')}</label>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="color" id="palette-color-picker" value="${baseColor}" style="width: 44px; height: 38px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; padding: 2px;">
                <input type="text" id="palette-base-input" class="input" value="${baseColor}" style="max-width: 130px; font-family: monospace;">
              </div>
            </div>

            <div class="form-group" style="margin: 0; min-width: 220px;">
              <label class="form-label" for="palette-rule-select" data-i18n="tools.palette.rule">${t('tools.palette.rule')}</label>
              <select id="palette-rule-select" class="select">
                <option value="complementary" ${harmonyRule === 'complementary' ? 'selected' : ''}>${t('tools.palette.rule.complementary')}</option>
                <option value="analogous" ${harmonyRule === 'analogous' ? 'selected' : ''}>${t('tools.palette.rule.analogous')}</option>
                <option value="triadic" ${harmonyRule === 'triadic' ? 'selected' : ''}>${t('tools.palette.rule.triadic')}</option>
                <option value="monochrome" ${harmonyRule === 'monochrome' ? 'selected' : ''}>${t('tools.palette.rule.monochrome')}</option>
              </select>
            </div>
          </div>

          <div class="palette-swatches">
            ${colors.map(c => `
              <div class="swatch-card">
                <div class="swatch-color" style="background-color: ${c.hex};">
                  ${c.hex}
                </div>
                <div class="swatch-info">
                  <p class="swatch-label">${c.label}</p>
                  <p class="swatch-hex">${c.hex}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card-box" style="margin: 2rem 0; background: var(--bg);">
            <h3 style="margin-bottom: 1rem;" data-i18n="tools.palette.contrast">${t('tools.palette.contrast')} (WCAG 2.1)</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
              <div style="padding: 1rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-weight: 600; margin-bottom: 0.35rem;">Yazı / Zemin Kontrastı</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${inkBgRatio}:1</div>
                <span class="contrast-badge ${inkBgRating.aaNormal ? 'pass' : 'fail'}">${inkBgRating.badge} (Gövde Metni)</span>
              </div>
              <div style="padding: 1rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-weight: 600; margin-bottom: 0.35rem;">Buton Metni / Buton Zemini</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${primaryBtnRatio}:1</div>
                <span class="contrast-badge ${primaryBtnRating.aaNormal ? 'pass' : 'fail'}">${primaryBtnRating.badge} (Beyaz Buton)</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button id="btn-copy-palette-css" class="btn btn-secondary">
              📋 <span data-i18n="tools.palette.copyCss">${t('tools.palette.copyCss')}</span>
            </button>
            <button id="btn-apply-palette-gen" class="btn btn-primary">
              ⚡ <span data-i18n="tools.palette.applyToGen">${t('tools.palette.applyToGen')}</span>
            </button>
          </div>
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
                    <span class="font-category">${pair.category}</span>
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
                <option value="${s}" ${copySector === s ? 'selected' : ''}>${t(`gen.sector.${s}`)}</option>
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
                  ${s.id === 'button' ? '<button class="btn btn-primary" style="margin-right:8px;">Hemen Başlayın</button><button class="btn btn-outline">Detaylar</button>' : ''}
                  ${s.id === 'card' ? '<div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; width:220px;"><div style="font-weight:700;">Hizmet Kartı</div><p style="font-size:0.85rem; color:#64748b; margin:0.5rem 0;">Modern ve estetik web arayüzleri.</p><span style="color:#3b5bdb; font-size:0.85rem; font-weight:600;">İncele &rarr;</span></div>' : ''}
                  ${s.id === 'navbar' ? '<div style="background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 1rem; width:100%; display:flex; justify-content:space-between; align-items:center;"><strong>Logo</strong><span style="font-size:0.8rem; color:#64748b;">Menü • İletişim</span></div>' : ''}
                  ${s.id === 'footer' ? '<div style="background:#1f2430; color:#fff; border-radius:6px; padding:1rem; width:100%; text-align:center; font-size:0.85rem;">© 2026 Atölye. Tüm hakları saklıdır.</div>' : ''}
                </div>
                <div class="snippet-body">
                  <h3 style="margin-bottom: 0.5rem;">${s.name}</h3>
                  <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button class="btn btn-outline btn-sm btn-copy-html" data-id="${s.id}">HTML Kopyala</button>
                    <button class="btn btn-outline btn-sm btn-copy-css" data-id="${s.id}">CSS Kopyala</button>
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
        renderContent();
      });

      input?.addEventListener('change', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          baseColor = val;
          renderContent();
        }
      });

      ruleSelect?.addEventListener('change', (e) => {
        harmonyRule = e.target.value;
        renderContent();
      });

      container.querySelector('#btn-copy-palette-css')?.addEventListener('click', () => {
        const colors = generatePalette(baseColor, harmonyRule);
        const cssLines = colors.map(c => `  --${c.name}: ${c.hex};`).join('\n');
        const css = `:root {\n${cssLines}\n}`;
        copyToClipboard(css);
      });

      container.querySelector('#btn-apply-palette-gen')?.addEventListener('click', () => {
        const colors = generatePalette(baseColor, harmonyRule);
        const paletteObj = {};
        colors.forEach(c => { paletteObj[c.name] = c.hex; });
        sessionStorage.setItem('sa.customPalette', JSON.stringify(paletteObj));
        showToast(t('gen.buildBtn'));
        window.location.hash = '#/';
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
