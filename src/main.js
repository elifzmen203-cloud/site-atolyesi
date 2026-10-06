import './styles/base.css';
import './styles/app.css';

import { t, getLang, setLang, onLangChange, SUPPORTED_LANGS, applyI18n } from './i18n/index.js';
import { renderHomePage } from './pages/home.js';
import { renderToolsPage } from './pages/tools.js';
import { renderWizardPage } from './pages/wizard.js';
import { renderStudioPage } from './pages/studio.js';
import { renderHowPage } from './pages/how.js';
import { renderPrivacyPage } from './pages/privacy.js';
import { renderAboutPage } from './pages/about.js';
import { renderContactPage } from './pages/contact.js';
import { initDayNightCycle } from './theme/daynight.js';
import { initMascot } from './mascot/cat.js';
import { initAds } from './monetize/ads.js';
import { renderDonateButton } from './monetize/donate.js';

const app = document.getElementById('app');

function renderHeader() {
  const currentLang = getLang();
  const langLabels = {
    tr: 'Türkçe',
    en: 'English',
    ru: 'Русский',
    es: 'Español'
  };

  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="container app-header-inner">
      <a href="#/" class="brand">
        <span class="brand-icon">✦</span>
        <span data-i18n="app.title">${t('app.title')}</span>
      </a>

      <nav class="nav-menu" aria-label="${t('nav.aria')}">
        <a href="#/" class="nav-link" data-route="#/" data-i18n="nav.generator">${t('nav.generator')}</a>
        <a href="#/sihirbaz" class="nav-link" data-route="#/sihirbaz" data-i18n="nav.wizard">${t('nav.wizard')}</a>
        <a href="#/atolye" class="nav-link" data-route="#/atolye" data-i18n="nav.studio">${t('nav.studio')}</a>
        <a href="#/araclar" class="nav-link" data-route="#/araclar" data-i18n="nav.tools">${t('nav.tools')}</a>
        <a href="#/nasil" class="nav-link" data-route="#/nasil" data-i18n="nav.how">${t('nav.how')}</a>
        <a href="#/gizlilik" class="nav-link" data-route="#/gizlilik" data-i18n="nav.privacy">${t('nav.privacy')}</a>
      </nav>

      <div class="header-actions">
        <label for="app-lang-select" class="sr-only" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);">${t('app.langSelect')}</label>
        <select id="app-lang-select" class="lang-selector" aria-label="${t('app.langSelect')}">
          ${SUPPORTED_LANGS.map(code => `
            <option value="${code}" ${currentLang === code ? 'selected' : ''}>${langLabels[code] || code.toUpperCase()}</option>
          `).join('')}
        </select>
      </div>
    </div>
  `;

  const donate = renderDonateButton('donate-header');
  if (donate) header.querySelector('.header-actions').prepend(donate);

  const langSelect = header.querySelector('#app-lang-select');
  langSelect.addEventListener('change', (e) => {
    setLang(e.target.value);
  });

  return header;
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('data-route');
    if (target === route || (route === '' && target === '#/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function routeTo() {
  const hash = window.location.hash || '#/';
  const cleanRoute = hash.split('?')[0];

  const mainContainer = document.getElementById('main-view');
  if (!mainContainer) return;

  mainContainer.innerHTML = '';

  if (cleanRoute === '#/sihirbaz') {
    mainContainer.appendChild(renderWizardPage());
  } else if (cleanRoute === '#/atolye') {
    mainContainer.appendChild(renderStudioPage());
  } else if (cleanRoute === '#/araclar') {
    mainContainer.appendChild(renderToolsPage());
  } else if (cleanRoute === '#/nasil') {
    mainContainer.appendChild(renderHowPage());
  } else if (cleanRoute === '#/gizlilik') {
    mainContainer.appendChild(renderPrivacyPage());
  } else if (cleanRoute === '#/hakkinda') {
    mainContainer.appendChild(renderAboutPage());
  } else if (cleanRoute === '#/iletisim') {
    mainContainer.appendChild(renderContactPage());
  } else {
    mainContainer.appendChild(renderHomePage());
  }

  updateActiveNav(cleanRoute);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Dil değişince yalnız DOM yeniden çizilir; dinleyiciler initApp'te bir kez kurulur.
// (Önceden her dil değişiminde dinleyiciler yeniden ekleniyor, sayıları ikiye katlanıp sayfayı kilitliyordu.)
function renderApp() {
  app.innerHTML = '';

  const header = renderHeader();
  app.appendChild(header);

  const main = document.createElement('main');
  main.id = 'main-view';
  main.className = 'main-content';
  app.appendChild(main);

  const footer = document.createElement('footer');
  footer.style.cssText = 'border-top: 1px solid var(--border); background: var(--surface); padding: 2rem 0; font-size: 0.9rem; color: var(--muted); text-align: center;';
  footer.innerHTML = `
    <div class="container">
      <nav class="footer-links" aria-label="${t('footer.aria')}">
        <a href="#/hakkinda" class="nav-link" data-route="#/hakkinda" data-i18n="nav.about">${t('nav.about')}</a>
        <a href="#/iletisim" class="nav-link" data-route="#/iletisim" data-i18n="nav.contact">${t('nav.contact')}</a>
        <a href="#/gizlilik" class="nav-link" data-route="#/gizlilik" data-i18n="nav.privacy">${t('nav.privacy')}</a>
      </nav>
      <p>&copy; ${new Date().getFullYear()} <strong data-i18n="app.title">${t('app.title')}</strong> — <span data-i18n="app.tagline">${t('app.tagline')}</span></p>
    </div>
  `;
  const footerDonate = renderDonateButton('donate-footer');
  if (footerDonate) footer.querySelector('.container').appendChild(footerDonate);
  app.appendChild(footer);

  routeTo();
}

function initApp() {
  window.addEventListener('hashchange', routeTo);
  onLangChange(renderApp);
  initDayNightCycle();
  initMascot();
  renderApp();
  initAds();
}

initApp();
