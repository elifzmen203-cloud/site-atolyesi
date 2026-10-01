export const TRANSITION_DURATION = 60000; // 60 seconds transition animation

/**
 * Determines whether an hour or Date falls into 'day' (08:00 - 19:59)
 * or 'night' (20:00 - 07:59).
 * @param {Date|number} dateOrHour - Date instance or hour (0-24)
 * @returns {'day'|'night'}
 */
export function modeForHour(dateOrHour) {
  let hour;
  if (dateOrHour instanceof Date) {
    hour = dateOrHour.getHours() + (dateOrHour.getMinutes() / 60) + (dateOrHour.getSeconds() / 3600);
  } else if (typeof dateOrHour === 'number') {
    hour = dateOrHour;
  } else {
    const now = new Date();
    hour = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
  }

  // 08:00 <= hour < 20:00 is Day, otherwise Night
  if (hour >= 8 && hour < 20) {
    return 'day';
  }
  return 'night';
}

let activeInterval = null;
let currentMode = null;
const modeListeners = new Set();

export function onDayNightChange(fn) {
  modeListeners.add(fn);
  return () => modeListeners.delete(fn);
}

export function getCurrentMode() {
  return currentMode || modeForHour(new Date());
}

/**
 * Creates and triggers the 60-second sky transition animation layer.
 * Will not block pointer events (pointer-events: none).
 */
export function playTransitionAnimation(fromMode, toMode) {
  if (typeof document === 'undefined') return;

  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = isReducedMotion ? 400 : TRANSITION_DURATION;

  let layer = document.getElementById('sky-transition-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'sky-transition-layer';
    layer.className = 'sky-transition';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }

  layer.className = `sky-transition active transition-${fromMode}-to-${toMode}`;
  layer.style.animationDuration = `${duration}ms`;

  setTimeout(() => {
    if (layer && layer.parentNode) {
      layer.className = 'sky-transition';
    }
  }, duration);
}

/**
 * Initializes the Day/Night cycle.
 * Called once during application bootstrap (initApp).
 */
export function initDayNightCycle(options = {}) {
  if (typeof document === 'undefined') return;

  const now = options.date || new Date();
  const initialMode = modeForHour(now);
  currentMode = initialMode;

  // Immediate initial application without animation
  document.documentElement.setAttribute('data-mode', initialMode);

  // Periodic check every 30 seconds
  if (activeInterval) clearInterval(activeInterval);

  activeInterval = setInterval(() => {
    const checkDate = new Date();
    const newMode = modeForHour(checkDate);

    if (newMode !== currentMode) {
      const oldMode = currentMode;
      currentMode = newMode;
      playTransitionAnimation(oldMode, newMode);
      document.documentElement.setAttribute('data-mode', newMode);
      modeListeners.forEach(fn => fn(newMode, oldMode));
    }
  }, 30000);

  return {
    getCurrentMode,
    stop: () => clearInterval(activeInterval)
  };
}
