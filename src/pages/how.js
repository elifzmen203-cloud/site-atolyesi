import { t } from '../i18n/index.js';

export function renderHowPage() {
  const container = document.createElement('div');
  container.className = 'container';

  container.innerHTML = `
    <header style="margin-bottom: 2.5rem;">
      <h1 data-i18n="how.title">${t('how.title')}</h1>
      <p class="page-lead" data-i18n="how.subtitle">${t('how.subtitle')}</p>
    </header>

    <div class="info-grid">
      <div class="info-card">
        <h3 data-i18n="how.step1.title">${t('how.step1.title')}</h3>
        <p data-i18n="how.step1.desc">${t('how.step1.desc')}</p>
      </div>

      <div class="info-card">
        <h3 data-i18n="how.step2.title">${t('how.step2.title')}</h3>
        <p data-i18n="how.step2.desc">${t('how.step2.desc')}</p>
      </div>

      <div class="info-card">
        <h3 data-i18n="how.step3.title">${t('how.step3.title')}</h3>
        <p data-i18n="how.step3.desc">${t('how.step3.desc')}</p>
      </div>
    </div>

    <section class="card-box" style="margin-top: 3rem;">
      <h2 style="margin-bottom: 1.5rem;" data-i18n="how.features.title">${t('how.features.title')}</h2>
      <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <li data-i18n="how.features.f1"><strong>${t('how.features.f1').split(':')[0]}:</strong> ${t('how.features.f1').split(':')[1] || ''}</li>
        <li data-i18n="how.features.f2"><strong>${t('how.features.f2').split(':')[0]}:</strong> ${t('how.features.f2').split(':')[1] || ''}</li>
        <li data-i18n="how.features.f3"><strong>${t('how.features.f3').split(':')[0]}:</strong> ${t('how.features.f3').split(':')[1] || ''}</li>
      </ul>
      <div style="margin-top: 2rem;">
        <a href="#/" class="btn btn-primary" data-i18n="nav.generator">${t('nav.generator')}</a>
      </div>
    </section>
  `;

  return container;
}
