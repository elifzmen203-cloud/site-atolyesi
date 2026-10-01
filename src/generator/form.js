import { t } from '../i18n/index.js';

export function createGeneratorForm(initialConfig = {}, onUpdate, onDownload) {
  const formWrapper = document.createElement('div');
  formWrapper.className = 'form-panel';

  const sectors = ['cafe', 'restaurant', 'barber', 'lawyer', 'photographer', 'portfolio', 'hotel', 'store', 'clinic', 'agency'];
  const layouts = ['minimal', 'modern', 'classic', 'bold'];
  const palettes = ['ocean', 'warm', 'forest', 'slate', 'sunset', 'berry'];
  const fontPairs = [
    { id: 'modern', label: 'Poppins + Inter' },
    { id: 'classic', label: 'Playfair Display + Source Sans 3' },
    { id: 'bold', label: 'Montserrat + Merriweather' },
    { id: 'editorial', label: 'DM Serif Display + DM Sans' }
  ];
  const allSections = [
    { id: 'hero', key: 'gen.section.hero' },
    { id: 'about', key: 'gen.section.about' },
    { id: 'services', key: 'gen.section.services' },
    { id: 'gallery', key: 'gen.section.gallery' },
    { id: 'reviews', key: 'gen.section.reviews' },
    { id: 'faq', key: 'gen.section.faq' },
    { id: 'contact', key: 'gen.section.contact' }
  ];

  let currentConfig = Object.assign({
    name: '',
    sector: 'cafe',
    slogan: '',
    services: [],
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    layout: 'modern',
    paletteKey: 'ocean',
    fontPairKey: 'modern',
    sections: ['hero', 'about', 'services', 'gallery', 'reviews', 'faq', 'contact']
  }, initialConfig);

  // Check sessionStorage for palette / font transferred from Toolbox
  try {
    const customPalette = sessionStorage.getItem('sa.customPalette');
    if (customPalette) {
      currentConfig.palette = JSON.parse(customPalette);
    }
    const customFont = sessionStorage.getItem('sa.customFont');
    if (customFont) {
      currentConfig.fonts = JSON.parse(customFont);
    }
  } catch (e) {
    // Ignore session errors
  }

  formWrapper.innerHTML = `
    <div class="form-panel-header">
      <h2 data-i18n="gen.title">${t('gen.title')}</h2>
      <p data-i18n="gen.subtitle">${t('gen.subtitle')}</p>
    </div>

    <form id="site-gen-form" onsubmit="return false;">
      <!-- 1. Name -->
      <div class="form-group">
        <label for="field-name" class="form-label" data-i18n="gen.businessName">${t('gen.businessName')}</label>
        <input type="text" id="field-name" class="input" value="${currentConfig.name}" placeholder="${t('gen.businessNamePlaceholder')}">
      </div>

      <!-- 2. Sector -->
      <div class="form-group">
        <label for="field-sector" class="form-label" data-i18n="gen.sector">${t('gen.sector')}</label>
        <select id="field-sector" class="select">
          ${sectors.map(s => `
            <option value="${s}" ${currentConfig.sector === s ? 'selected' : ''} data-i18n="gen.sector.${s}">${t(`gen.sector.${s}`)}</option>
          `).join('')}
        </select>
      </div>

      <!-- 3. Slogan -->
      <div class="form-group">
        <label for="field-slogan" class="form-label" data-i18n="gen.slogan">${t('gen.slogan')}</label>
        <input type="text" id="field-slogan" class="input" value="${currentConfig.slogan}" placeholder="${t('gen.sloganPlaceholder')}">
        <div class="form-hint" data-i18n="gen.sloganPlaceholder">${t('gen.sloganPlaceholder')}</div>
      </div>

      <!-- 4. Services -->
      <div class="form-group">
        <label for="field-services" class="form-label" data-i18n="gen.services">${t('gen.services')}</label>
        <textarea id="field-services" class="textarea" rows="3" placeholder="${t('gen.servicesPlaceholder')}">${currentConfig.services.join('\n')}</textarea>
        <div class="form-hint" data-i18n="gen.servicesPlaceholder">${t('gen.servicesPlaceholder')}</div>
      </div>

      <!-- 5. Contact fields -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div class="form-group">
          <label for="field-phone" class="form-label" data-i18n="gen.phone">${t('gen.phone')}</label>
          <input type="text" id="field-phone" class="input" value="${currentConfig.contact.phone}" placeholder="${t('gen.phonePlaceholder')}">
        </div>
        <div class="form-group">
          <label for="field-email" class="form-label" data-i18n="gen.email">${t('gen.email')}</label>
          <input type="email" id="field-email" class="input" value="${currentConfig.contact.email}" placeholder="${t('gen.emailPlaceholder')}">
        </div>
      </div>

      <div class="form-group">
        <label for="field-address" class="form-label" data-i18n="gen.address">${t('gen.address')}</label>
        <input type="text" id="field-address" class="input" value="${currentConfig.contact.address}" placeholder="${t('gen.addressPlaceholder')}">
      </div>

      <!-- 6. Style & Layout -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div class="form-group">
          <label for="field-layout" class="form-label" data-i18n="gen.layout">${t('gen.layout')}</label>
          <select id="field-layout" class="select">
            ${layouts.map(l => `
              <option value="${l}" ${currentConfig.layout === l ? 'selected' : ''} data-i18n="gen.layout.${l}">${t(`gen.layout.${l}`)}</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="field-palette" class="form-label" data-i18n="gen.palette">${t('gen.palette')}</label>
          <select id="field-palette" class="select">
            ${palettes.map(p => `
              <option value="${p}" ${currentConfig.paletteKey === p ? 'selected' : ''} data-i18n="gen.palette.${p}">${t(`gen.palette.${p}`)}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- 7. Typography -->
      <div class="form-group">
        <label for="field-font" class="form-label" data-i18n="gen.fontPair">${t('gen.fontPair')}</label>
        <select id="field-font" class="select">
          ${fontPairs.map(f => `
            <option value="${f.id}" ${currentConfig.fontPairKey === f.id ? 'selected' : ''}>${f.label}</option>
          `).join('')}
        </select>
      </div>

      <!-- 8. Sections -->
      <div class="form-group">
        <label class="form-label" data-i18n="gen.sections">${t('gen.sections')}</label>
        <div class="checkbox-group">
          ${allSections.map(sec => `
            <label class="checkbox-label">
              <input type="checkbox" name="sections" value="${sec.id}" ${currentConfig.sections.includes(sec.id) ? 'checked' : ''}>
              <span data-i18n="${sec.key}">${t(sec.key)}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;">
        <button type="button" id="btn-update-site" class="btn btn-secondary" style="flex: 1;" data-i18n="gen.buildBtn">
          🔄 ${t('gen.buildBtn')}
        </button>
        <button type="button" id="btn-download-zip" class="btn btn-primary" style="flex: 1;" data-i18n="common.downloadZip">
          📥 ${t('common.downloadZip')}
        </button>
      </div>
    </form>
  `;

  function readConfigFromDom() {
    const name = formWrapper.querySelector('#field-name').value;
    const sector = formWrapper.querySelector('#field-sector').value;
    const slogan = formWrapper.querySelector('#field-slogan').value;
    const rawServices = formWrapper.querySelector('#field-services').value;
    const services = rawServices.split('\n').map(s => s.trim()).filter(Boolean);

    const phone = formWrapper.querySelector('#field-phone').value;
    const email = formWrapper.querySelector('#field-email').value;
    const address = formWrapper.querySelector('#field-address').value;

    const layout = formWrapper.querySelector('#field-layout').value;
    const paletteKey = formWrapper.querySelector('#field-palette').value;
    const fontPairKey = formWrapper.querySelector('#field-font').value;

    const checkedSections = Array.from(formWrapper.querySelectorAll('input[name="sections"]:checked')).map(cb => cb.value);

    currentConfig = Object.assign({}, currentConfig, {
      name,
      sector,
      slogan,
      services,
      contact: { phone, email, address },
      layout,
      paletteKey,
      fontPairKey,
      sections: checkedSections
    });

    return currentConfig;
  }

  // Real-time update listeners on all inputs
  const inputs = formWrapper.querySelectorAll('input, select, textarea');
  inputs.forEach(el => {
    el.addEventListener('input', () => {
      if (onUpdate) onUpdate(readConfigFromDom());
    });
    el.addEventListener('change', () => {
      if (onUpdate) onUpdate(readConfigFromDom());
    });
  });

  formWrapper.querySelector('#btn-update-site')?.addEventListener('click', () => {
    if (onUpdate) onUpdate(readConfigFromDom());
  });

  formWrapper.querySelector('#btn-download-zip')?.addEventListener('click', () => {
    if (onDownload) onDownload(readConfigFromDom());
  });

  // Initial trigger
  setTimeout(() => {
    if (onUpdate) onUpdate(currentConfig);
  }, 10);

  return { element: formWrapper, getConfig: () => currentConfig };
}
