import { t, getLang } from '../i18n/index.js';
import {
  getSiteConfig,
  updateSiteConfig,
  addSection,
  removeSection,
  moveSection,
  updateSection,
  resetSiteConfig,
  toBuildSiteConfig,
  AVAILABLE_SECTION_TYPES,
  SECTION_VARIANTS,
  SECTION_BG_STYLES
} from '../state/siteConfig.js';
import { buildSite, escapeHtml } from '../generator/build-site.js';
import { makeZip, triggerDownload } from '../generator/zip.js';
import { triggerConfetti } from '../mascot/confetti.js';

export function renderStudioPage() {
  const container = document.createElement('div');
  container.className = 'container studio-container';

  let previewDevice = 'desktop'; // desktop, tablet, mobile
  let draggedIndex = null;

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

  function getIframeWidth() {
    if (previewDevice === 'mobile') return '360px';
    if (previewDevice === 'tablet') return '768px';
    return '100%';
  }

  function render() {
    const config = getSiteConfig();
    const lang = getLang();
    const rawConfig = toBuildSiteConfig(config);
    const generated = buildSite(rawConfig, lang);

    container.innerHTML = `
      <header style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 data-i18n="studio.title">${t('studio.title')}</h1>
          <p class="page-lead" data-i18n="studio.subtitle">${t('studio.subtitle')}</p>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <a href="#/sihirbaz" class="btn btn-outline btn-sm">
            ✨ <span data-i18n="nav.wizard">${t('nav.wizard')}</span>
          </a>
          <button id="btn-studio-reset" class="btn btn-outline btn-sm" style="color: #e11d48;">
            ↺ <span data-i18n="studio.reset">${t('studio.reset')}</span>
          </button>
          <button id="btn-studio-download" class="btn btn-primary btn-sm">
            📦 <span data-i18n="wizard.downloadZip">${t('wizard.downloadZip')}</span>
          </button>
        </div>
      </header>

      <div class="studio-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; align-items: start;">
        <!-- Left: Sections Manager -->
        <section class="studio-sections card-box" style="padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 data-i18n="studio.sectionsTitle">${t('studio.sectionsTitle')}</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="select-add-section-type" class="select" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.85rem;">
                ${AVAILABLE_SECTION_TYPES.map(type => `
                  <option value="${type}">${t(`wizard.section.${type}`)}</option>
                `).join('')}
              </select>
              <button id="btn-add-section" class="btn btn-secondary btn-sm" style="white-space: nowrap;">
                + <span data-i18n="studio.addSection">${t('studio.addSection')}</span>
              </button>
            </div>
          </div>

          <!-- Section cards list -->
          <div id="studio-section-list" style="display: flex; flex-direction: column; gap: 1rem;">
            ${config.sections.map((sec, idx) => {
              const variants = SECTION_VARIANTS[sec.type] || ['center'];

              return `
                <div class="studio-section-item" data-id="${sec.id}" data-index="${idx}" draggable="true" style="border: 1px solid var(--border); border-radius: 8px; background: var(--bg); padding: 1rem; cursor: grab; transition: border-color 0.15s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="cursor: grab; color: var(--muted);" title="Drag to reorder">⠿</span>
                      <strong style="text-transform: capitalize; font-size: 0.95rem;">${t(`wizard.section.${sec.type}`)}</strong>
                    </div>

                    <!-- Up / Down / Delete controls -->
                    <div style="display: flex; gap: 0.25rem;">
                      <button class="btn btn-outline btn-sm btn-move-sec-up" data-index="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''} title="Move Up" aria-label="Move Up">↑</button>
                      <button class="btn btn-outline btn-sm btn-move-sec-down" data-index="${idx}" ${idx === config.sections.length - 1 ? 'disabled style="opacity:0.3;"' : ''} title="Move Down" aria-label="Move Down">↓</button>
                      <button class="btn btn-outline btn-sm btn-remove-sec" data-id="${sec.id}" style="color: #e11d48;" title="${t('tools.palette.delete')}" aria-label="Delete">✕</button>
                    </div>
                  </div>

                  <!-- Inline text edits -->
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <input type="text" class="input sec-title-input" data-id="${sec.id}" value="${escapeHtml(sec.title)}" placeholder="${t('studio.sectionTitlePlaceholder')}" style="font-size: 0.9rem; padding: 0.4rem 0.6rem;">
                    <input type="text" class="input sec-sub-input" data-id="${sec.id}" value="${escapeHtml(sec.subtitle)}" placeholder="${t('studio.sectionSubPlaceholder')}" style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                  </div>

                  <!-- Variant and BG Style Row -->
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; font-size: 0.85rem;">
                    ${variants.length > 1 ? `
                      <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <span style="color: var(--muted);">${t('wizard.variant')}:</span>
                        <select class="select sec-variant-select" data-id="${sec.id}" style="width: auto; padding: 0.2rem 0.4rem; font-size: 0.8rem;">
                          ${variants.map(v => `
                            <option value="${v}" ${sec.variant === v ? 'selected' : ''}>${t(`wizard.variant.${v}`)}</option>
                          `).join('')}
                        </select>
                      </div>
                    ` : ''}

                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                      <span style="color: var(--muted);">${t('studio.bgStyle')}:</span>
                      <select class="select sec-bg-select" data-id="${sec.id}" style="width: auto; padding: 0.2rem 0.4rem; font-size: 0.8rem;">
                        ${SECTION_BG_STYLES.map(bg => `
                          <option value="${bg}" ${sec.bgStyle === bg ? 'selected' : ''}>${t(`studio.bgStyle.${bg}`)}</option>
                        `).join('')}
                      </select>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Right: Live Preview Panel -->
        <section class="studio-preview card-box" style="padding: 1.5rem; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 data-i18n="tools.snippets.preview">${t('tools.snippets.preview')}</h3>
            <div class="device-selector" role="group" aria-label="${t('common.deviceGroup')}" style="display: flex; gap: 0.25rem;">
              <button class="btn btn-sm ${previewDevice === 'desktop' ? 'btn-primary' : 'btn-outline'} btn-device" data-device="desktop">🖥</button>
              <button class="btn btn-sm ${previewDevice === 'tablet' ? 'btn-primary' : 'btn-outline'} btn-device" data-device="tablet">📱</button>
              <button class="btn btn-sm ${previewDevice === 'mobile' ? 'btn-primary' : 'btn-outline'} btn-device" data-device="mobile">📲</button>
            </div>
          </div>

          <div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #ffffff; height: 560px; display: flex; justify-content: center; box-shadow: var(--shadow);">
            <iframe id="studio-preview-frame" style="width: ${getIframeWidth()}; height: 100%; border: none; transition: width 0.2s ease;" srcdoc="${generated.html.replace(/"/g, '&quot;')}" title="${t('common.previewTitle')}"></iframe>
          </div>
        </section>
      </div>
    `;

    bindEvents();
  }

  function updatePreview() {
    const config = getSiteConfig();
    const lang = getLang();
    const rawConfig = toBuildSiteConfig(config);
    const generated = buildSite(rawConfig, lang);

    const frame = container.querySelector('#studio-preview-frame');
    if (frame) {
      frame.srcdoc = generated.html;
    }
  }

  function bindEvents() {
    // Add section
    container.querySelector('#btn-add-section')?.addEventListener('click', () => {
      const typeSelect = container.querySelector('#select-add-section-type');
      const type = typeSelect ? typeSelect.value : 'services';
      addSection(type);
      render();
    });

    // Reset config
    container.querySelector('#btn-studio-reset')?.addEventListener('click', () => {
      const lang = getLang();
      resetSiteConfig('cafe', lang);
      showToast(t('common.copied'));
      render();
    });

    // Device toggles
    container.querySelectorAll('.btn-device').forEach(btn => {
      btn.addEventListener('click', () => {
        previewDevice = btn.getAttribute('data-device');
        const frame = container.querySelector('#studio-preview-frame');
        if (frame) frame.style.width = getIframeWidth();
        container.querySelectorAll('.btn-device').forEach(b => {
          b.className = `btn btn-sm ${b === btn ? 'btn-primary' : 'btn-outline'} btn-device`;
        });
      });
    });

    // Inline text edits (debounced/eventually updating preview)
    container.querySelectorAll('.sec-title-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.getAttribute('data-id');
        updateSection(id, { title: e.target.value });
        updatePreview();
      });
    });

    container.querySelectorAll('.sec-sub-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.getAttribute('data-id');
        updateSection(id, { subtitle: e.target.value });
        updatePreview();
      });
    });

    // Variant select
    container.querySelectorAll('.sec-variant-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        updateSection(id, { variant: e.target.value });
        updatePreview();
      });
    });

    // BG style select
    container.querySelectorAll('.sec-bg-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        updateSection(id, { bgStyle: e.target.value });
        updatePreview();
      });
    });

    // Move Up
    container.querySelectorAll('.btn-move-sec-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (idx > 0) {
          moveSection(idx, idx - 1);
          render();
        }
      });
    });

    // Move Down
    container.querySelectorAll('.btn-move-sec-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const config = getSiteConfig();
        if (idx < config.sections.length - 1) {
          moveSection(idx, idx + 1);
          render();
        }
      });
    });

    // Remove Section
    container.querySelectorAll('.btn-remove-sec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        removeSection(id);
        render();
      });
    });

    // Drag and Drop reordering
    container.querySelectorAll('.studio-section-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedIndex = parseInt(item.getAttribute('data-index'), 10);
        e.dataTransfer.effectAllowed = 'move';
        item.style.opacity = '0.5';
      });

      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
        draggedIndex = null;
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        item.style.borderColor = 'var(--primary)';
      });

      item.addEventListener('dragleave', () => {
        item.style.borderColor = 'var(--border)';
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.style.borderColor = 'var(--border)';
        const targetIndex = parseInt(item.getAttribute('data-index'), 10);
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
          moveSection(draggedIndex, targetIndex);
          render();
        }
      });
    });

    // Download ZIP
    container.querySelector('#btn-studio-download')?.addEventListener('click', async () => {
      const config = getSiteConfig();
      const lang = getLang();
      const rawConfig = toBuildSiteConfig(config);
      const generated = buildSite(rawConfig, lang);

      try {
        const blob = await makeZip({
          html: generated.html,
          css: generated.css,
          readme: generated.readme
        });
        triggerDownload(blob, `${(config.name || 'site').toLowerCase().replace(/\s+/g, '-')}.zip`);
        triggerConfetti();
        showToast(t('common.copied'));
      } catch (err) {
        showToast(t('gen.downloadError'));
      }
    });
  }

  render();
  return container;
}
