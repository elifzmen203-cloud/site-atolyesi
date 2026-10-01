import { t, onLangChange } from '../i18n/index.js';
import { createCatMachine } from './cat-machine.js';
import { onDayNightChange, getCurrentMode } from '../theme/daynight.js';
import { catSvg } from './cat-art.js';
import { scanSpots, nearestSpot, isFree } from './spots.js';
import '../styles/cat.css';

/**
 * Tatlım: sayfanın her yerinde, kartların ve panellerin üst kenarlarında dolaşan kedi.
 *
 * - Konum belge koordinatındadır (sayfa kayınca bulunduğu kartla birlikte kayar).
 * - Yalnız `spots.js`'in "boş" bulduğu yerlere yürür/zıplar; yazıyı, butonu, alanları kapatmaz.
 * - Tıklamayı asla yutmaz (pointer-events: none); sekme gizliyken durur; hareket azaltma tercihine uyar.
 * - Yürüme ve zıplama rAF ile, karar döngüsü seyrek setTimeout ile çalışır (ana iş parçacığını kasmaz).
 */

let initialized = false;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export function initMascot() {
  if (typeof document === 'undefined' || initialized) return;
  initialized = true;

  const STORAGE_KEY = 'sa.catSleep';
  let manualSleep = false;
  try {
    manualSleep = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) {
    // Depolama kapalıysa varsayılan: uyanık
  }

  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isNight = () => getCurrentMode() === 'night';
  const size = () => (window.innerWidth < 600 ? { w: 62, h: 50 } : { w: 86, h: 69 });

  const machine = createCatMachine({ initialState: 'sit' });

  // ---------- DOM ----------
  const layer = document.createElement('div');
  layer.id = 'cat-mascot-wrapper';
  layer.setAttribute('aria-hidden', 'true');

  const cat = document.createElement('div');
  cat.id = 'tatlim-cat';
  cat.className = 'cat-entity st-sit';

  const bubble = document.createElement('div');
  bubble.className = 'cat-bubble';
  const art = document.createElement('div');
  art.className = 'cat-art';
  cat.append(bubble, art);
  layer.append(cat);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'cat-sleep-toggle';
  toggleBtn.type = 'button';
  toggleBtn.className = 'btn btn-outline btn-sm cat-sleep-toggle-btn';

  document.body.append(layer, toggleBtn);

  // ---------- durum ----------
  let pos = { x: -200, y: -200 };   // x: merkez, y: zemin (belge koordinatı)
  let facing = 1;
  let busy = false;                 // yürüyor/zıplıyor
  let anim = null;
  let actId = 0;                    // eski zamanlayıcıların yeni hareketi bozmasını önler
  let timer = null;
  let typingUntil = 0;
  let lastPounce = 0;

  function render() {
    const { w, h } = size();
    cat.style.width = `${w}px`;
    cat.style.height = `${h}px`;
    cat.style.transform = `translate3d(${pos.x - w / 2}px, ${pos.y - h}px, 0)`;
    art.style.transform = `scaleX(${facing})`;
  }

  function drawPose(state) {
    art.innerHTML = catSvg(state, { night: isNight() });
    cat.className = `cat-entity st-${state}`;
  }

  function setState(state) {
    if (machine.getState() !== state) machine.setState(state);
  }

  function temp(state, ms) {
    setState(state);
    const id = ++actId;
    setTimeout(() => {
      if (id === actId && machine.getState() === state) setState('sit');
    }, ms);
  }

  let bubbleTimer = null;
  function say(text, ms = 2200) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  function updateToggle() {
    toggleBtn.textContent = manualSleep ? `🐱 ${t('mascot.wake')}` : `💤 ${t('mascot.sleep')}`;
  }

  machine.onStateChange(state => {
    drawPose(state);
    if (state === 'purr') say(`${t('mascot.purr')} ♪`);
  });

  // ---------- konum yardımcıları ----------
  const toDoc = s => ({ x1: s.x1, x2: s.x2, y: s.y + window.scrollY, floor: !!s.floor });
  const freeSpots = () => {
    const { w, h } = size();
    return scanSpots(w, h).map(toDoc);
  };
  function inView() {
    const { h } = size();
    const vy = pos.y - window.scrollY;
    return vy > h * 0.6 && vy < window.innerHeight + 2 && pos.x > 0 && pos.x < window.innerWidth;
  }
  function currentFree() {
    const { w, h } = size();
    return isFree(pos.x, pos.y - window.scrollY, w, h);
  }
  function runAtPos(spots) {
    return spots.find(s => Math.abs(s.y - pos.y) < 3 && pos.x >= s.x1 - 2 && pos.x <= s.x2 + 2);
  }

  // ---------- hareket ----------
  function cancelAnim() {
    if (anim) cancelAnimationFrame(anim);
    anim = null;
    busy = false;
  }

  function walkTo(x, done) {
    cancelAnim();
    actId++;
    busy = true;
    facing = x >= pos.x ? 1 : -1;
    setState('walk');
    const speed = window.innerWidth < 600 ? 48 : 68;
    let last = performance.now();
    const step = now => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const dx = x - pos.x;
      if (Math.abs(dx) < 1.5) {
        pos.x = x;
        render();
        anim = null;
        busy = false;
        setState('sit');
        if (done) done();
        return;
      }
      pos.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
      render();
      anim = requestAnimationFrame(step);
    };
    render();
    anim = requestAnimationFrame(step);
  }

  function jumpTo(x, y, done) {
    cancelAnim();
    actId++;
    busy = true;
    const x0 = pos.x;
    const y0 = pos.y;
    facing = x >= x0 ? 1 : -1;
    const dist = Math.hypot(x - x0, y - y0);
    const dur = Math.min(900, 380 + dist * 0.9);
    const apex = Math.min(y0, y) - Math.min(120, 40 + dist * 0.25);
    const ctrl = 2 * apex - (y0 + y) / 2;   // ikinci dereceden Bezier: orta nokta = tepe
    setState('jump');
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      pos.x = x0 + (x - x0) * k;
      pos.y = (1 - k) * (1 - k) * y0 + 2 * (1 - k) * k * ctrl + k * k * y;
      render();
      if (k < 1) {
        anim = requestAnimationFrame(step);
        return;
      }
      anim = null;
      busy = false;
      cat.classList.add('cat-land');
      setTimeout(() => cat.classList.remove('cat-land'), 280);
      setState('sit');
      if (done) done();
    };
    render();
    anim = requestAnimationFrame(step);
  }

  function goToSpot(target, done) {
    const sameRun = inView() && Math.abs(target.y - pos.y) < 3 &&
      target.run && pos.x >= target.run.x1 - 2 && pos.x <= target.run.x2 + 2;
    if (sameRun) walkTo(target.x, done);
    else if (!inView()) enterFromSide(target, done);
    else jumpTo(target.x, target.y, done);
  }

  function enterFromSide(target, done) {
    const { w } = size();
    const fromLeft = target.x < window.innerWidth / 2;
    pos = { x: fromLeft ? -w : window.innerWidth + w, y: target.y };
    render();
    jumpTo(target.x, target.y, done);
  }

  /** Rastgele ya da (px, py) yakınındaki boş bir yere git. Gidecek yer yoksa false. */
  function relocate(done, px = null, py = null) {
    const spots = freeSpots();
    if (!spots.length) return false;
    let target;
    if (px !== null) {
      target = nearestSpot(spots, px, py, 420);
    } else {
      const s = pick(spots);
      target = { x: rand(s.x1, s.x2), y: s.y, run: s };
    }
    if (!target) return false;
    goToSpot(target, done);
    return true;
  }

  // ---------- karar döngüsü ----------
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(decide, ms);
  }

  function decide() {
    if (document.hidden) return schedule(4000);
    if (busy) return schedule(1200);
    const st = machine.getState();
    if (st === 'aim' || st === 'jump') return schedule(1500);
    const sleepy = manualSleep || isNight();

    // Görünmüyorsa ya da bir şeyin üstüne düştüyse (sayfa değişti, menü açıldı) kalk ve yer değiştir.
    if (!inView() || !currentFree()) {
      if (!relocate(() => schedule(sleepy ? 600 : rand(2500, 5000)))) schedule(3000);
      return;
    }
    if (sleepy) {
      setState('sleep');
      return schedule(8000);
    }
    if (st === 'sleep') {          // gündüz şekerlemesi kısa sürer
      if (Math.random() < 0.3) temp('stretch', 1300);
      return schedule(6000);
    }
    if (reduced()) {
      setState('sit');
      return schedule(8000);
    }
    if (Date.now() < typingUntil) {
      setState('laptop');
      return schedule(1500);
    }
    if (st === 'laptop') setState('sit');

    const r = Math.random();
    if (r < 0.32) {                // aynı rafta gezin
      const run = runAtPos(freeSpots());
      if (run && run.x2 - run.x1 > 40) {
        walkTo(rand(run.x1, run.x2), () => schedule(rand(2000, 4500)));
        return;
      }
      if (relocate(() => schedule(rand(2500, 5000)))) return;
    } else if (r < 0.52) {         // başka bir rafa zıpla
      if (relocate(() => schedule(rand(2500, 5000)))) return;
    } else if (r < 0.64) {
      temp('groom', 3200);
    } else if (r < 0.74) {
      temp('purr', 2600);
    } else if (r < 0.80) {
      temp('eat', 3600);
    } else if (r < 0.85) {
      temp('stretch', 1400);
    } else if (r < 0.88) {
      setState('sleep');           // kısa şekerleme; yukarıdaki dal uyandırır
    } else {
      setState('sit');
    }
    schedule(rand(3500, 7000));
  }

  // ---------- imlece nişan alıp zıplama ----------
  let cursor = null;
  let idleTimer = null;
  function canPlay() {
    return !busy && !manualSleep && !isNight() && !reduced() && !document.hidden && inView();
  }
  function pounce(px, py, cooldown) {
    if (!canPlay() || Date.now() - lastPounce < cooldown) return;
    if (!['sit', 'walk', 'groom', 'purr', 'eat'].includes(machine.getState())) return;
    const target = nearestSpot(freeSpots(), px, py + window.scrollY, 300);
    if (!target || Math.hypot(target.x - pos.x, target.y - pos.y) < 24) return;
    lastPounce = Date.now();
    cancelAnim();
    facing = target.x >= pos.x ? 1 : -1;
    render();
    setState('aim');
    const id = ++actId;
    setTimeout(() => {
      if (id !== actId || machine.getState() !== 'aim') return;
      jumpTo(target.x, target.y, () => {
        facing = px >= pos.x ? 1 : -1;
        render();
        if (Math.random() < 0.5) temp('purr', 2000);
        schedule(rand(3000, 5000));
      });
    }, 1300);
  }

  window.addEventListener('mousemove', e => {
    cursor = { x: e.clientX, y: e.clientY };
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => cursor && pounce(cursor.x, cursor.y, 20000), 4000);
  }, { passive: true });

  window.addEventListener('touchstart', e => {
    const tp = e.touches && e.touches[0];
    if (tp) pounce(tp.clientX, tp.clientY, 15000);
  }, { passive: true });

  // ---------- yazı yazarken laptopla yanına gelir ----------
  document.addEventListener('keydown', e => {
    const el = e.target;
    if (!el || !el.matches || !el.matches('input, textarea, [contenteditable]')) return;
    typingUntil = Date.now() + 3000;
    if (busy || manualSleep || isNight() || reduced() || machine.getState() === 'laptop') return;
    const r = el.getBoundingClientRect();
    const target = nearestSpot(freeSpots(), r.left + r.width / 2, r.top + window.scrollY, 480);
    const work = () => {
      if (Date.now() < typingUntil) setState('laptop');
      schedule(1500);
    };
    if (target && (!inView() || Math.hypot(target.x - pos.x, target.y - pos.y) > 40)) goToSpot(target, work);
    else if (inView()) work();
  }, true);

  // ---------- olaylar ----------
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!busy && !inView()) schedule(700);
    }, 450);
  }, { passive: true });
  window.addEventListener('resize', () => {
    render();
    schedule(800);
  });
  window.addEventListener('hashchange', () => schedule(700));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnim();
    else schedule(500);
  });

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    manualSleep = !manualSleep;
    try {
      localStorage.setItem(STORAGE_KEY, String(manualSleep));
    } catch (err) {
      // yoksay
    }
    cancelAnim();
    actId++;
    if (manualSleep) setState('sleep');
    else temp('stretch', 1300);
    updateToggle();
    schedule(1600);
  });

  onDayNightChange(mode => {
    cancelAnim();
    actId++;
    if (mode === 'night') {
      setState('sleep');
      drawPose('sleep');   // battaniyeli gece uykusu
    } else if (!manualSleep) {
      temp('stretch', 1500);
    }
    schedule(2000);
  });

  window.addEventListener('site:celebrate', () => {
    if (manualSleep || isNight()) return;
    temp('purr', 2600);
    say(`🎉 ${t('mascot.purr')}`, 3000);
    cat.classList.add('cat-hop');
    setTimeout(() => cat.classList.remove('cat-hop'), 1000);
  });

  onLangChange(updateToggle);

  // ---------- başlangıç ----------
  updateToggle();
  drawPose(manualSleep || isNight() ? 'sleep' : 'sit');
  if (manualSleep || isNight()) setState('sleep');
  render();
  setTimeout(() => {
    if (!relocate(() => schedule(rand(2000, 4000)))) {
      // Hiç boş raf yoksa ekranın sol altında bekler, sonra yeniden dener.
      pos = { x: 70, y: window.scrollY + window.innerHeight - 2 };
      render();
      schedule(3000);
    }
  }, 700);
}
