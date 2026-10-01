/**
 * Tatlım'ın durabileceği yerler ("raflar").
 *
 * Kedi kartların, panellerin ve bölümlerin ÜST KENARINDA durur; gövdesi kenarın üstündeki boşluğa düşer.
 * Bir nokta ancak kedinin kaplayacağı dikdörtgende hiçbir içerik (yazı, buton, giriş alanı, görsel,
 * önizleme) yoksa "boş" sayılır. Böylece kedi her yerde dolaşır ama içeriği kapatmaz.
 */

// Üst kenarı raf olabilecek kapsayıcılar.
export const PERCH_SELECTOR = [
  '.form-panel', '.preview-panel', '.tool-section', '.card-box', '.info-card', '.font-card',
  '.snippet-card', '.swatch-card', '.copy-item', '.generator-view', '.tab-list', '.tab-content',
  '.form-group', '.iframe-wrapper', '.checkbox-group', '.palette-swatches', '.info-grid', '.main-content > *',
  '[class*="wizard"]', '[class*="studio"]', '[class*="panel"]', '[class*="card"]', 'section', 'footer'
].join(',');

// Bunlardan birinin üstüne düşen nokta içerik sayılır.
const CONTENT_SELECTOR = 'a,button,input,select,textarea,label,img,iframe,video,canvas,svg,p,h1,h2,h3,h4,h5,h6,li,dt,dd,' +
  'span,code,pre,strong,em,small,td,th,summary,[contenteditable],[role="button"],[role="tab"],.btn,' +
  '.app-header,#cat-sleep-toggle,.toast-msg';

const STEP = 26;           // raf boyunca örnek aralığı (px)

/** Bir öğe kendi içinde boş olmayan metin taşıyor mu (yalnız doğrudan metin düğümleri)? */
function hasOwnText(el) {
  for (const n of el.childNodes) {
    if (n.nodeType === 3 && n.textContent.trim()) return true;
  }
  return false;
}

export function isContentElement(el) {
  if (!el || el === document.documentElement || el === document.body) return false;
  if (el.closest && el.closest(CONTENT_SELECTOR)) return true;
  return hasOwnText(el);
}

/**
 * Viewport koordinatında, zemini groundY olan ve x merkezli w×h dikdörtgen içeriksiz mi?
 * Kedi `pointer-events: none` olduğu için elementFromPoint onu görmez.
 */
export function isFree(x, groundY, w, h) {
  const left = x - w / 2;
  const top = groundY - h;
  if (left < 2 || x + w / 2 > window.innerWidth - 2 || top < 0 || groundY > window.innerHeight) return false;
  const xs = [left + 4, x, left + w - 4];
  const ys = [top + 4, top + h * 0.5, groundY - 3];
  for (const px of xs) {
    for (const py of ys) {
      const el = document.elementFromPoint(px, py);
      if (!el || isContentElement(el)) return false;
    }
  }
  return true;
}

/** Saf: yan yana boş örnek noktalarını kesintisiz "koşu"lara böler (aralık > maxGap ise koşu biter). */
export function groupRuns(xs, maxGap = STEP + 2) {
  const sorted = [...xs].sort((a, b) => a - b);
  const runs = [];
  for (const x of sorted) {
    const last = runs[runs.length - 1];
    if (last && x - last.x2 <= maxGap) last.x2 = x;
    else runs.push({ x1: x, x2: x });
  }
  return runs;
}

/** Saf: hedefe (tx, ty) en yakın noktayı döndürür; maxDist'ten uzaksa null. */
export function nearestSpot(spots, tx, ty, maxDist = Infinity) {
  let best = null;
  let bestD = maxDist;
  for (const s of spots) {
    const x = Math.max(s.x1, Math.min(s.x2, tx));
    const d = Math.hypot(x - tx, s.y - ty);
    if (d < bestD) {
      bestD = d;
      best = { x, y: s.y, run: s };
    }
  }
  return best;
}

/**
 * Görünür alandaki boş raf koşularını bulur. Dönüş: [{ x1, x2, y }] (viewport koordinatı, y = zemin).
 */
export function scanSpots(w, h) {
  const seen = new Set();
  const spots = [];
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll(PERCH_SELECTOR)) {
    if (el.closest('#cat-mascot-wrapper')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < w + 20 || r.height < 24) continue;
    const y = Math.round(r.top);
    if (y < h + 8 || y > vh - 4) continue;
    const key = `${Math.round(r.left)}:${y}:${Math.round(r.right)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const free = [];
    for (let x = r.left + w / 2 + 6; x <= r.right - w / 2 - 6; x += STEP) {
      if (isFree(x, y, w, h)) free.push(Math.round(x));
    }
    for (const run of groupRuns(free)) spots.push({ ...run, y });
  }
  // Ekranın alt kenarı da raftır (yalnız boş yerleri).
  const floorY = vh - 2;
  const floor = [];
  for (let x = w / 2 + 8; x <= window.innerWidth - w / 2 - 8; x += STEP) {
    if (isFree(x, floorY, w, h)) floor.push(Math.round(x));
  }
  for (const run of groupRuns(floor)) spots.push({ ...run, y: floorY, floor: true });
  return spots;
}
