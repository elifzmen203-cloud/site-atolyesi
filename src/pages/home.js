import { t, getLang } from '../i18n/index.js';
import { createGeneratorForm } from '../generator/form.js';
import { buildSite } from '../generator/build-site.js';
import { makeZip, triggerDownload } from '../generator/zip.js';

export function renderHomePage() {
  const container = document.createElement('div');
  container.className = 'container';

  let currentConfig = {
    name: 'Luna Kahve Evi',
    sector: 'cafe',
    slogan: '',
    services: [],
    contact: {
      phone: '+90 555 123 45 67',
      email: 'merhaba@lunakahve.com',
      address: 'Moda Caddesi No: 42, Kadıköy, İstanbul'
    },
    layout: 'modern',
    paletteKey: 'ocean',
    fontPairKey: 'modern',
    sections: ['hero', 'about', 'services', 'gallery', 'reviews', 'faq', 'contact']
  };

  function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-msg';
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2500);
  }

  // Split view grid
  const grid = document.createElement('div');
  grid.className = 'generator-view';

  // Preview Panel
  const previewPanel = document.createElement('div');
  previewPanel.className = 'preview-panel';
  previewPanel.innerHTML = `
    <div class="preview-bar">
      <div class="preview-title-box">
        <h3 data-i18n="common.preview">${t('common.preview')}</h3>
      </div>
      <div class="preview-devices" role="group" aria-label="Ekran boyutu seçimi">
        <button class="device-btn active" data-device="desktop" data-i18n="common.desktop">${t('common.desktop')}</button>
        <button class="device-btn" data-device="tablet" data-i18n="common.tablet">${t('common.tablet')}</button>
        <button class="device-btn" data-device="mobile" data-i18n="common.mobile">${t('common.mobile')}</button>
      </div>
    </div>
    <div class="iframe-wrapper">
      <iframe id="preview-iframe" class="site-iframe" title="Web Sitesi Canlı Önizleme" sandbox="allow-same-origin allow-scripts"></iframe>
    </div>
  `;

  const iframe = previewPanel.querySelector('#preview-iframe');

  function updatePreview(config) {
    currentConfig = config;
    const lang = getLang();
    const result = buildSite(config, lang);

    // Combine HTML with inline stylesheet for srcdoc rendering
    const srcDocContent = result.html.replace(
      '<link rel="stylesheet" href="style.css">',
      `<style>${result.css}</style>`
    );

    if (iframe) {
      iframe.srcdoc = srcDocContent;
    }
  }

  async function handleDownload(config) {
    try {
      showToast(t('common.loading'));
      const lang = getLang();
      const files = buildSite(config, lang);
      const zipBlob = await makeZip(files);
      const safeName = (config.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      triggerDownload(zipBlob, `${safeName || 'site'}-atolyesi.zip`);
      showToast(t('gen.downloadSuccess'));
    } catch (err) {
      console.error('ZIP compilation error:', err);
      showToast('İndirme sırasında bir hata oluştu.');
    }
  }

  // Device switcher
  previewPanel.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      previewPanel.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.getAttribute('data-device');
      iframe.className = `site-iframe ${device}`;
    });
  });

  // Form initialization
  const formComponent = createGeneratorForm(currentConfig, updatePreview, handleDownload);

  grid.appendChild(formComponent.element);
  grid.appendChild(previewPanel);
  container.appendChild(grid);

  return container;
}
