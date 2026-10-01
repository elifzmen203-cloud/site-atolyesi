import { t, getLang } from '../i18n/index.js';
import {
  getSiteConfig,
  updateSiteConfig,
  toBuildSiteConfig,
  AVAILABLE_SECTION_TYPES,
  SECTION_VARIANTS
} from '../state/siteConfig.js';
import { PRESET_THEMES } from '../themes/presets.js';
import { buildSite } from '../generator/build-site.js';
import { makeZip, triggerDownload } from '../generator/zip.js';
import { triggerConfetti } from '../mascot/confetti.js';

export function renderWizardPage() {
  const container = document.createElement('div');
  container.className = 'container wizard-container';

  let currentStep = 1;
  const totalSteps = 5;
  const sectorsList = ['cafe', 'restaurant', 'barber', 'lawyer', 'photographer', 'portfolio', 'hotel', 'store', 'clinic', 'agency'];

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

  function render() {
    const config = getSiteConfig();
    const progressPercent = Math.round((currentStep / totalSteps) * 100);

    container.innerHTML = `
      <header class="wizard-header" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
          <h1 data-i18n="wizard.title">${t('wizard.title')}</h1>
          <span style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">
            ${t('wizard.step')} ${currentStep} / ${totalSteps}
          </span>
        </div>
        <p class="page-lead" data-i18n="wizard.subtitle">${t('wizard.subtitle')}</p>

        <!-- Progress bar -->
        <div style="width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 1rem;">
          <div style="width: ${progressPercent}%; height: 100%; background: var(--primary); transition: width 0.3s ease;"></div>
        </div>
      </header>

      <main class="wizard-body card-box" style="padding: 2rem; margin-bottom: 2rem;">
        ${renderStepContent(config)}
      </main>

      <footer class="wizard-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <button id="btn-wizard-prev" class="btn btn-outline" ${currentStep === 1 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
          &larr; <span data-i18n="wizard.prev">${t('wizard.prev')}</span>
        </button>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="#/atolye" class="btn btn-secondary">
            🛠 <span data-i18n="wizard.openInStudio">${t('wizard.openInStudio')}</span>
          </a>

          ${currentStep < totalSteps ? `
            <button id="btn-wizard-next" class="btn btn-primary">
              <span data-i18n="wizard.next">${t('wizard.next')}</span> &rarr;
            </button>
          ` : `
            <button id="btn-wizard-download" class="btn btn-primary">
              📦 <span data-i18n="wizard.downloadZip">${t('wizard.downloadZip')}</span>
            </button>
          `}
        </div>
      </footer>
    `;

    bindEvents();
  }

  function renderStepContent(config) {
    if (currentStep === 1) {
      return `
        <div class="wizard-step">
          <h3 style="margin-bottom: 1.25rem;" data-i18n="wizard.step1.title">${t('wizard.step1.title')}</h3>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" for="wiz-name-input" data-i18n="gen.businessName">${t('gen.businessName')}</label>
            <input type="text" id="wiz-name-input" class="input" value="${config.name || ''}" placeholder="${t('gen.businessNamePlaceholder')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="wiz-slogan-input" data-i18n="gen.slogan">${t('gen.slogan')}</label>
            <input type="text" id="wiz-slogan-input" class="input" value="${config.slogan || ''}" placeholder="${t('gen.sloganPlaceholder')}">
          </div>
        </div>
      `;
    }

    if (currentStep === 2) {
      return `
        <div class="wizard-step">
          <h3 style="margin-bottom: 1.25rem;" data-i18n="wizard.step2.title">${t('wizard.step2.title')}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem;">
            ${sectorsList.map(sec => `
              <div class="card wiz-sector-card ${config.sector === sec ? 'active' : ''}" data-sector="${sec}" style="cursor: pointer; padding: 1.25rem; border: 2px solid ${config.sector === sec ? 'var(--primary)' : 'var(--border)'}; border-radius: 8px; text-align: center; transition: all 0.15s ease;">
                <div style="font-weight: 700; margin-bottom: 0.25rem;">${t(`gen.sector.${sec}`)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (currentStep === 3) {
      return `
        <div class="wizard-step">
          <h3 style="margin-bottom: 1.25rem;" data-i18n="wizard.step3.title">${t('wizard.step3.title')}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; max-height: 440px; overflow-y: auto; padding: 4px;">
            ${PRESET_THEMES.slice(0, 16).map(theme => `
              <div class="card wiz-theme-card" data-id="${theme.id}" style="cursor: pointer; padding: 1rem; border: 2px solid ${config.palette && config.palette.primary === theme.palette.primary ? 'var(--primary)' : 'var(--border)'}; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="font-size: 0.9rem;">${theme.name}</strong>
                </div>
                <div style="display: flex; height: 24px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border);">
                  <div style="flex:1; background:${theme.palette.bg};"></div>
                  <div style="flex:1; background:${theme.palette.ink};"></div>
                  <div style="flex:1; background:${theme.palette.primary};"></div>
                  <div style="flex:1; background:${theme.palette.accent};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (currentStep === 4) {
      const activeTypes = config.sections.map(s => s.type);

      return `
        <div class="wizard-step">
          <h3 style="margin-bottom: 1.25rem;" data-i18n="wizard.step4.title">${t('wizard.step4.title')}</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${AVAILABLE_SECTION_TYPES.map(type => {
              const isChecked = activeTypes.includes(type);
              const currentSec = config.sections.find(s => s.type === type);
              const variants = SECTION_VARIANTS[type] || [];

              return `
                <div style="border: 1px solid var(--border); border-radius: 8px; padding: 1rem; background: var(--bg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; margin: 0;">
                    <input type="checkbox" class="wiz-section-toggle" data-type="${type}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px;">
                    <strong style="text-transform: capitalize;">${t(`wizard.section.${type}`)}</strong>
                  </label>

                  ${isChecked && variants.length > 1 ? `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 0.85rem; color: var(--muted);">${t('wizard.variant')}:</span>
                      <select class="select wiz-variant-select" data-type="${type}" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.85rem;">
                        ${variants.map(v => `
                          <option value="${v}" ${currentSec && currentSec.variant === v ? 'selected' : ''}>${t(`wizard.variant.${v}`)}</option>
                        `).join('')}
                      </select>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (currentStep === 5) {
      const lang = getLang();
      const rawConfig = toBuildSiteConfig(config);
      const generated = buildSite(rawConfig, lang);

      return `
        <div class="wizard-step">
          <h3 style="margin-bottom: 1rem;" data-i18n="wizard.step5.title">${t('wizard.step5.title')}</h3>
          <p style="color: var(--muted); margin-bottom: 1.5rem;" data-i18n="wizard.step5.desc">${t('wizard.step5.desc')}</p>
          
          <div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #ffffff; height: 420px; box-shadow: var(--shadow);">
            <iframe id="wiz-preview-frame" style="width: 100%; height: 100%; border: none;" srcdoc="${generated.html.replace(/"/g, '&quot;')}" title="${t('common.previewTitle')}"></iframe>
          </div>
        </div>
      `;
    }

    return '';
  }

  function bindEvents() {
    // Keyboard navigation
    function onKeyDown(e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        goNext();
      } else if (e.altKey && e.key === 'ArrowRight') {
        goNext();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        goPrev();
      }
    }

    container.removeEventListener('keydown', onKeyDown);
    container.addEventListener('keydown', onKeyDown);

    // Step 1 inputs
    const nameInput = container.querySelector('#wiz-name-input');
    nameInput?.addEventListener('input', (e) => {
      updateSiteConfig({ name: e.target.value });
    });

    const sloganInput = container.querySelector('#wiz-slogan-input');
    sloganInput?.addEventListener('input', (e) => {
      updateSiteConfig({ slogan: e.target.value });
    });

    // Step 2 sector cards
    container.querySelectorAll('.wiz-sector-card').forEach(card => {
      card.addEventListener('click', () => {
        const sector = card.getAttribute('data-sector');
        updateSiteConfig({ sector });
        render();
      });
    });

    // Step 3 theme cards
    container.querySelectorAll('.wiz-theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const theme = PRESET_THEMES.find(t => t.id === id);
        if (theme) {
          updateSiteConfig({ palette: Object.assign({}, theme.palette) });
          render();
        }
      });
    });

    // Step 4 section toggles and variants
    container.querySelectorAll('.wiz-section-toggle').forEach(chk => {
      chk.addEventListener('change', () => {
        const type = chk.getAttribute('data-type');
        const config = getSiteConfig();
        let sections = config.sections;

        if (chk.checked) {
          if (!sections.some(s => s.type === type)) {
            const variants = SECTION_VARIANTS[type] || ['center'];
            sections.push({
              id: `sec-${type}-${Date.now().toString(36)}`,
              type,
              title: type.charAt(0).toUpperCase() + type.slice(1),
              subtitle: '',
              variant: variants[0],
              bgStyle: 'default'
            });
          }
        } else {
          sections = sections.filter(s => s.type !== type);
        }

        updateSiteConfig({ sections });
        render();
      });
    });

    container.querySelectorAll('.wiz-variant-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const type = sel.getAttribute('data-type');
        const config = getSiteConfig();
        const sec = config.sections.find(s => s.type === type);
        if (sec) {
          sec.variant = sel.value;
          updateSiteConfig({ sections: config.sections });
        }
      });
    });

    // Prev / Next
    container.querySelector('#btn-wizard-prev')?.addEventListener('click', goPrev);
    container.querySelector('#btn-wizard-next')?.addEventListener('click', goNext);

    // Download Zip
    container.querySelector('#btn-wizard-download')?.addEventListener('click', async () => {
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

  function goPrev() {
    if (currentStep > 1) {
      currentStep--;
      render();
    }
  }

  function goNext() {
    if (currentStep < totalSteps) {
      currentStep++;
      render();
    }
  }

  render();
  return container;
}
