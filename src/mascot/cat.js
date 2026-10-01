import { t, onLangChange } from '../i18n/index.js';
import { createCatMachine } from './cat-machine.js';
import { onDayNightChange, getCurrentMode } from '../theme/daynight.js';

let initialized = false;

export function initMascot() {
  if (typeof document === 'undefined' || initialized) return;
  initialized = true;

  const STORAGE_KEY = 'sa.catSleep';
  let isManuallyAsleep = false;
  try {
    isManuallyAsleep = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) {
    // Ignore storage issues
  }

  const machine = createCatMachine({
    initialState: isManuallyAsleep || getCurrentMode() === 'night' ? 'sleep' : 'sit'
  });

  // Create UI Container
  const wrapper = document.createElement('div');
  wrapper.id = 'cat-mascot-wrapper';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 800; overflow: hidden;';

  const catEl = document.createElement('div');
  catEl.id = 'tatlim-cat';
  catEl.className = 'cat-entity state-sit';
  catEl.style.cssText = 'position: absolute; bottom: 16px; left: 60px; width: 64px; height: 64px; pointer-events: none; transition: transform 0.3s ease, left 0.6s ease, bottom 0.6s ease;';

  catEl.innerHTML = `
    <div class="cat-bubble" style="position: absolute; top: -28px; left: 16px; background: var(--surface); color: var(--ink); border: 1px solid var(--border); border-radius: 12px; padding: 2px 8px; font-size: 11px; font-weight: 700; opacity: 0; transition: opacity 0.2s ease; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"></div>
    <svg viewBox="0 0 64 64" width="64" height="64" class="cat-svg">
      <!-- Tail -->
      <path class="cat-tail" d="M16 48 C 8 46, 4 36, 10 30 C 12 28, 16 32, 14 36" fill="none" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round" />
      <!-- Body -->
      <ellipse class="cat-body" cx="30" cy="44" rx="16" ry="12" fill="#f59e0b" />
      <!-- Paws -->
      <circle class="cat-paw-l" cx="22" cy="54" r="4" fill="#fbbf24" />
      <circle class="cat-paw-r" cx="36" cy="54" r="4" fill="#fbbf24" />
      <!-- Head -->
      <circle class="cat-head" cx="38" cy="30" r="13" fill="#f59e0b" />
      <!-- Ears -->
      <polygon class="cat-ear-l" points="28,24 33,14 36,22" fill="#d97706" />
      <polygon class="cat-ear-r" points="40,22 43,14 48,24" fill="#d97706" />
      <!-- Eyes Open -->
      <ellipse class="cat-eye-l" cx="35" cy="28" rx="2" ry="2.5" fill="#1f2937" />
      <ellipse class="cat-eye-r" cx="43" cy="28" rx="2" ry="2.5" fill="#1f2937" />
      <!-- Eyes Closed (Hidden by default) -->
      <path class="cat-eye-sleep-l" d="M33 29 Q 35 32 37 29" fill="none" stroke="#1f2937" stroke-width="1.5" stroke-linecap="round" style="display: none;" />
      <path class="cat-eye-sleep-r" d="M41 29 Q 43 32 45 29" fill="none" stroke="#1f2937" stroke-width="1.5" stroke-linecap="round" style="display: none;" />
      <!-- Nose & Mouth -->
      <polygon points="38,32 40,32 39,33.5" fill="#ef4444" />
      <!-- Whiskers -->
      <line x1="28" y1="31" x2="22" y2="30" stroke="#78350f" stroke-width="1" />
      <line x1="28" y1="33" x2="22" y2="34" stroke="#78350f" stroke-width="1" />
      <line x1="48" y1="31" x2="54" y2="30" stroke="#78350f" stroke-width="1" />
      <line x1="48" y1="33" x2="54" y2="34" stroke="#78350f" stroke-width="1" />
    </svg>
  `;

  // Toggle button (bottom left)
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'cat-sleep-toggle';
  toggleBtn.className = 'btn btn-outline btn-sm cat-sleep-toggle-btn';
  toggleBtn.style.cssText = 'position: fixed; bottom: 12px; left: 12px; z-index: 850; pointer-events: auto; font-size: 11px; padding: 4px 8px; border-radius: 20px; background: var(--surface); opacity: 0.85; box-shadow: 0 2px 6px rgba(0,0,0,0.06);';
  
  function updateToggleBtnText() {
    toggleBtn.textContent = machine.getState() === 'sleep' ? `🐱 ${t('mascot.wake')}` : `💤 ${t('mascot.sleep')}`;
  }
  updateToggleBtnText();

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (machine.getState() === 'sleep') {
      isManuallyAsleep = false;
      try { localStorage.setItem(STORAGE_KEY, 'false'); } catch (err) {}
      machine.setState('stretch');
      setTimeout(() => machine.setState('sit'), 1200);
    } else {
      isManuallyAsleep = true;
      try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (err) {}
      machine.setState('sleep');
    }
    updateToggleBtnText();
  });

  wrapper.appendChild(catEl);
  document.body.appendChild(wrapper);
  document.body.appendChild(toggleBtn);

  // Bubble helper
  const bubble = catEl.querySelector('.cat-bubble');
  function showBubble(text, duration = 2500) {
    if (!bubble) return;
    bubble.textContent = text;
    bubble.style.opacity = '1';
    setTimeout(() => {
      bubble.style.opacity = '0';
    }, duration);
  }

  // Eye toggle helper
  const eyeOpenL = catEl.querySelector('.cat-eye-l');
  const eyeOpenR = catEl.querySelector('.cat-eye-r');
  const eyeSleepL = catEl.querySelector('.cat-eye-sleep-l');
  const eyeSleepR = catEl.querySelector('.cat-eye-sleep-r');

  function setEyesClosed(closed) {
    if (closed) {
      if (eyeOpenL) eyeOpenL.style.display = 'none';
      if (eyeOpenR) eyeOpenR.style.display = 'none';
      if (eyeSleepL) eyeSleepL.style.display = 'block';
      if (eyeSleepR) eyeSleepR.style.display = 'block';
    } else {
      if (eyeOpenL) eyeOpenL.style.display = 'block';
      if (eyeOpenR) eyeOpenR.style.display = 'block';
      if (eyeSleepL) eyeSleepL.style.display = 'none';
      if (eyeSleepR) eyeSleepR.style.display = 'none';
    }
  }

  // Positional coordinates
  let posX = 80;
  let posY = 16;
  let lastJumpTime = 0;
  let targetX = 80;
  let targetY = 16;

  // Track cursor position for playful jumps
  let cursorX = 200;
  let cursorY = 300;
  let cursorIdleTimer = null;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = window.innerHeight - e.clientY;

    if (cursorIdleTimer) clearTimeout(cursorIdleTimer);
    cursorIdleTimer = setTimeout(() => {
      // If cursor has stayed still for 4 seconds, cat notices and may aim
      const now = Date.now();
      if (!isManuallyAsleep && machine.getState() === 'sit' && now - lastJumpTime > 25000) {
        machine.transition('aim');
      }
    }, 4000);
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      cursorX = e.touches[0].clientX;
      cursorY = window.innerHeight - e.touches[0].clientY;
      const now = Date.now();
      if (!isManuallyAsleep && machine.getState() === 'sit' && now - lastJumpTime > 20000) {
        machine.transition('aim');
      }
    }
  }, { passive: true });

  // Handle state animations
  machine.onStateChange((state) => {
    updateToggleBtnText();
    catEl.className = `cat-entity state-${state}`;

    if (state === 'sleep') {
      setEyesClosed(true);
      showBubble('Zzz...', 3000);
    } else {
      setEyesClosed(false);
    }

    if (state === 'purr') {
      showBubble(t('mascot.purr'), 2200);
    }

    if (state === 'groom') {
      catEl.style.transform = 'scale(1.05) rotate(-3deg)';
      setTimeout(() => { catEl.style.transform = 'none'; }, 1000);
    }

    if (state === 'walk') {
      const maxX = Math.max(120, window.innerWidth - 100);
      posX = Math.max(40, Math.min(maxX, posX + (Math.random() > 0.5 ? 90 : -90)));
      catEl.style.left = `${posX}px`;
    }

    if (state === 'aim') {
      catEl.style.transform = 'scaleY(0.8) scaleX(1.1)';
      setTimeout(() => {
        if (machine.getState() === 'aim') {
          machine.transition('jump');
        }
      }, 1400);
    }

    if (state === 'jump') {
      lastJumpTime = Date.now();
      const maxX = Math.max(120, window.innerWidth - 100);
      const jumpDestX = Math.max(40, Math.min(maxX, cursorX - 32));
      const jumpPeakY = Math.min(180, Math.max(70, cursorY));

      // Jump trajectory
      catEl.style.transition = 'left 0.5s ease-out, bottom 0.25s cubic-bezier(0,0,0.2,1)';
      catEl.style.bottom = `${jumpPeakY}px`;
      catEl.style.left = `${jumpDestX}px`;
      catEl.style.transform = 'rotate(-10deg) scale(1.1)';

      setTimeout(() => {
        // Fall back down
        catEl.style.transition = 'bottom 0.25s cubic-bezier(0.8,0,1,1), transform 0.2s ease';
        catEl.style.bottom = '16px';
        catEl.style.transform = 'none';
        posX = jumpDestX;

        setTimeout(() => {
          catEl.style.transition = 'transform 0.3s ease, left 0.6s ease, bottom 0.6s ease';
          machine.transition('sit');
        }, 260);
      }, 250);
    }
  });

  // Natural state tick loop
  let tickInterval = setInterval(() => {
    if (document.hidden || isManuallyAsleep) return;
    const isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const st = machine.getState();
    if (st !== 'aim' && st !== 'jump' && st !== 'sleep') {
      machine.tickNatural();
    }
  }, 6000);

  // Day/Night tie-in
  onDayNightChange((mode) => {
    if (isManuallyAsleep) return;
    if (mode === 'night') {
      machine.setState('sleep');
    } else {
      machine.setState('stretch');
      setTimeout(() => machine.setState('sit'), 1500);
    }
  });

  // Celebrate event (ZIP ready / site completed)
  window.addEventListener('site:celebrate', () => {
    if (isManuallyAsleep) return;
    machine.setState('purr');
    showBubble(`🎉 ${t('mascot.purr')}`, 3000);
    catEl.style.transform = 'scale(1.15) translateY(-8px)';
    setTimeout(() => {
      catEl.style.transform = 'none';
      setTimeout(() => machine.setState('sit'), 2000);
    }, 1000);
  });

  onLangChange(() => {
    updateToggleBtnText();
  });
}

