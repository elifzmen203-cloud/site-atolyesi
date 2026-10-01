/**
 * Tatlım'ın özgün çizimleri (SVG, sağa bakar, viewBox 0 0 100 80, zemin y≈77).
 *
 * Tasarım: krem-şeftali tüy, zencefil çizgiler, kalın kahve kontur, parıltılı iri gözler,
 * pembe yanaklar, nane yeşili fular ve altın çan. Herhangi bir ticari karakterin kopyası değildir;
 * Elif'in referans görsellerindeki yalnız genel "sevimli, tombul, sade" ruh alınmıştır.
 * Yürüyüş bacak sırası (sol arka → sol ön → sağ arka → sağ ön) cat.css'teki animasyon gecikmeleriyle verilir.
 */

export const CAT_COLORS = {
  outline: '#5b4137',
  fur: '#fbe6d4',
  furShade: '#efcfb8',
  stripe: '#e3a983',
  belly: '#fff7ee',
  earInner: '#f8c0cf',
  cheek: '#f6a3ba',
  nose: '#ee8fa8',
  eye: '#3b2a24',
  scarf: '#84d2c0',
  bell: '#f6d27a',
  blanket: '#c1bfd5',
  bowl: '#f8c0cf',
  laptop: '#b7d2df'
};

const C = CAT_COLORS;

function eyes(kind) {
  if (kind === 'closed') {
    return `<path class="o-thin" d="M-9,0 q3,3.5 6,0"/><path class="o-thin" d="M7,0 q3,3.5 6,0"/>`;
  }
  if (kind === 'happy') {
    return `<path class="o-thin" d="M-9,1 q3,-4.5 6,0"/><path class="o-thin" d="M7,1 q3,-4.5 6,0"/>`;
  }
  const rx = kind === 'wide' ? 3.9 : 3.3;
  const ry = kind === 'wide' ? 4.7 : 4.1;
  return `<g class="cat-eyes">
      <ellipse cx="-6" cy="-1" rx="${rx}" ry="${ry}" fill="${C.eye}"/>
      <ellipse cx="10" cy="-1" rx="${rx}" ry="${ry}" fill="${C.eye}"/>
      <circle cx="-4.8" cy="-2.6" r="1.4" fill="#fff"/>
      <circle cx="11.2" cy="-2.6" r="1.4" fill="#fff"/>
      <circle cx="-6.8" cy="1" r="0.6" fill="#fff"/>
      <circle cx="9.2" cy="1" r="0.6" fill="#fff"/>
    </g>`;
}

function mouth(kind) {
  if (kind === 'tongue') {
    return `<path class="o-thin" d="M-1,7 q2.5,3 5,0 q2.5,3 5,0"/><ellipse cx="4" cy="10" rx="2.2" ry="2.6" fill="${C.nose}"/>`;
  }
  if (kind === 'small') {
    return `<path class="o-thin" d="M1,7.5 q2,2 4,0"/>`;
  }
  return `<path class="o-thin" d="M-1,7 q2.5,3 5,0 q2.5,3 5,0"/>`;
}

/** Baş: (x, y) merkez. */
function head({ x, y, eye = 'open', mouthKind = 'w', tilt = 0, cls = '' }) {
  return `<g class="cat-head ${cls}" transform="translate(${x} ${y}) rotate(${tilt})">
    <path class="o" fill="${C.fur}" d="M-21,-6 L-17,-27 L-4,-17 Z"/>
    <path fill="${C.earInner}" d="M-17,-10 L-15.5,-21 L-8,-16 Z"/>
    <path class="o" fill="${C.fur}" d="M8,-17 L21,-27 L24,-6 Z"/>
    <path fill="${C.earInner}" d="M12,-16 L19,-21 L20,-10 Z"/>
    <ellipse class="o" cx="2" cy="0" rx="24" ry="19.5" fill="${C.fur}"/>
    <path class="stripe" d="M-5,-18.5 q2,4 0.5,8 M2,-19.5 q2,4 0.5,8.5 M9,-18.5 q2,4 0.5,8"/>
    <path class="stripe" d="M-21,-2 q4,1 6,0 M-21,4 q4,0 6,-1.5"/>
    ${eyes(eye)}
    <ellipse cx="-12" cy="6" rx="4.2" ry="2.6" fill="${C.cheek}" opacity="0.75"/>
    <ellipse cx="17" cy="6" rx="4.2" ry="2.6" fill="${C.cheek}" opacity="0.75"/>
    <path d="M1.5,3.5 h5 l-2.5,3 z" fill="${C.nose}"/>
    ${mouth(mouthKind)}
    <path class="o-whisker" d="M-16,8 l-9,-1 M-16,11 l-9,2 M22,8 l9,-1 M22,11 l9,2"/>
  </g>`;
}

function tail(d, cls = 'cat-tail') {
  return `<g class="${cls}">
    <path d="${d}" fill="none" stroke="${C.outline}" stroke-width="10" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${C.fur}" stroke-width="6" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${C.stripe}" stroke-width="6" stroke-linecap="butt" stroke-dasharray="3 6"/>
  </g>`;
}

function scarf(d, bx, by) {
  return `<g class="cat-scarf">
    <path d="${d}" fill="none" stroke="${C.outline}" stroke-width="8.5" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${C.scarf}" stroke-width="5.5" stroke-linecap="round"/>
    <circle class="cat-bell" cx="${bx}" cy="${by}" r="3.6" fill="${C.bell}"/>
    <path d="M${bx - 1.6},${by + 1} h3.2" stroke="${C.outline}" stroke-width="1"/>
  </g>`;
}

const shadow = (cx = 50, rx = 34) => `<ellipse class="cat-shadow" cx="${cx}" cy="78" rx="${rx}" ry="3" fill="rgba(74,58,51,0.14)"/>`;

function leg(x, y, h, cls, shade = false) {
  return `<g class="cat-leg ${cls}"><rect class="o" x="${x - 4.5}" y="${y}" width="9" height="${h}" rx="4.5" fill="${shade ? C.furShade : C.fur}"/></g>`;
}

/* ---------- Pozlar ---------- */

function sitPose({ eye = 'open', mouthKind = 'w', tilt = 0, extra = '', headY = 30, headX = 56, paws = true, headWrap = 'cat-headwrap' } = {}) {
  return `${shadow(50, 30)}
    ${tail('M32,72 C14,74 8,60 16,50')}
    <g class="cat-body">
      <ellipse class="o" cx="48" cy="57" rx="24" ry="20" fill="${C.fur}"/>
      <ellipse cx="55" cy="62" rx="12" ry="12" fill="${C.belly}"/>
      <path class="stripe-thick" d="M29,48 q5,3 4,9 M27,57 q5,2 5,8"/>
      ${paws ? `<ellipse class="o" cx="50" cy="75" rx="6.5" ry="4" fill="${C.fur}"/><ellipse class="o" cx="62" cy="75" rx="6.5" ry="4" fill="${C.fur}"/>` : ''}
    </g>
    ${scarf('M40,43 q14,9 30,-1', 56, 50)}
    <g class="${headWrap}">${head({ x: headX, y: headY, eye, mouthKind, tilt })}</g>
    ${extra}`;
}

function walkPose() {
  return `${shadow(48, 34)}
    ${tail('M20,46 C8,40 6,26 14,18', 'cat-tail cat-tail-walk')}
    ${leg(32, 58, 18, 'leg-hr', true)}
    ${leg(66, 58, 18, 'leg-fr', true)}
    <g class="cat-body cat-bob">
      <ellipse class="o" cx="46" cy="52" rx="30" ry="16" fill="${C.fur}"/>
      <ellipse cx="50" cy="59" rx="17" ry="6" fill="${C.belly}"/>
      <path class="stripe-thick" d="M32,37.5 q2,5 0.5,9 M41,36.5 q2,5 0.5,9 M50,36.5 q2,5 0.5,9"/>
    </g>
    ${leg(24, 58, 18, 'leg-hl')}
    ${leg(58, 58, 18, 'leg-fl')}
    <g class="cat-bob">
      ${scarf('M64,39 q7,10 3,20', 68, 57)}
      ${head({ x: 76, y: 32 })}
    </g>`;
}

function aimPose() {
  return `${shadow(48, 34)}
    <g class="cat-rear">
      ${tail('M18,62 C10,64 4,62 1,57', 'cat-tail cat-tail-twitch')}
      <rect class="o" x="19" y="64" width="10" height="12" rx="5" fill="${C.furShade}"/>
      <rect class="o" x="28" y="64" width="10" height="12" rx="5" fill="${C.fur}"/>
    </g>
    <g class="cat-body">
      <ellipse class="o" cx="47" cy="62" rx="30" ry="13" fill="${C.fur}"/>
      <ellipse cx="52" cy="68" rx="16" ry="4.5" fill="${C.belly}"/>
      <path class="stripe-thick" d="M33,50 q2,4 0.5,8 M42,49.5 q2,4 0.5,8"/>
      <rect class="o" x="58" y="66" width="9" height="10" rx="4.5" fill="${C.fur}"/>
      <rect class="o" x="66" y="66" width="9" height="10" rx="4.5" fill="${C.furShade}"/>
    </g>
    ${scarf('M64,52 q7,8 4,15', 67, 64)}
    ${head({ x: 78, y: 46, eye: 'wide', mouthKind: 'small' })}`;
}

function jumpPose() {
  return `<g transform="rotate(-12 50 50)">
    ${tail('M18,50 C8,48 2,44 -2,38')}
    <rect class="o" x="12" y="54" width="20" height="9" rx="4.5" fill="${C.furShade}" transform="rotate(25 22 58)"/>
    <ellipse class="o" cx="48" cy="50" rx="34" ry="14" fill="${C.fur}"/>
    <ellipse cx="52" cy="56" rx="18" ry="5" fill="${C.belly}"/>
    <path class="stripe-thick" d="M34,37 q2,4 0.5,8 M43,36.5 q2,4 0.5,8 M52,36.5 q2,4 0.5,8"/>
    <rect class="o" x="68" y="50" width="22" height="9" rx="4.5" fill="${C.fur}" transform="rotate(-20 72 54)"/>
    ${scarf('M66,38 q7,9 3,17', 70, 54)}
    ${head({ x: 80, y: 30, eye: 'wide', mouthKind: 'small' })}
  </g>`;
}

function sleepPose(night) {
  const zz = `<g class="cat-zz">
      <text x="82" y="26" class="zz zz1">z</text><text x="88" y="16" class="zz zz2">Z</text></g>`;
  if (night) {
    return `${shadow(48, 36)}
      ${tail('M18,74 C34,80 58,80 72,74')}
      <path class="o" fill="${C.blanket}" d="M8,76 C4,52 20,36 44,36 C62,36 72,44 76,56 L78,76 Z"/>
      <g fill="#fff" opacity="0.9">
        <circle cx="22" cy="58" r="3.2"/><circle cx="36" cy="46" r="3.2"/><circle cx="50" cy="58" r="3.2"/>
        <circle cx="62" cy="47" r="2.8"/><circle cx="30" cy="70" r="3"/><circle cx="66" cy="66" r="3"/><circle cx="16" cy="70" r="2.4"/>
      </g>
      ${head({ x: 72, y: 54, eye: 'closed', mouthKind: 'small', tilt: 8 })}
      <path class="o" fill="${C.blanket}" d="M54,62 C62,58 76,60 84,66 C86,72 80,77 70,77 L56,77 Z"/>
      <g fill="#fff" opacity="0.9"><circle cx="66" cy="69" r="2.6"/><circle cx="78" cy="71" r="2.2"/></g>
      ${zz}`;
  }
  return `${shadow(48, 36)}
    <g class="cat-breathe">
      <ellipse class="o" cx="44" cy="60" rx="34" ry="17" fill="${C.fur}"/>
      <path class="stripe-thick" d="M24,47 q2,4 0.5,8 M34,44 q2,4 0.5,8 M44,43.5 q2,4 0.5,8"/>
    </g>
    ${tail('M14,72 C30,80 56,80 70,74')}
    <ellipse class="o" cx="80" cy="73" rx="6" ry="4" fill="${C.fur}"/>
    ${head({ x: 70, y: 54, eye: 'closed', mouthKind: 'small', tilt: 6 })}
    ${zz}`;
}

function stretchPose() {
  return `${shadow(50, 38)}
    ${tail('M16,30 C10,20 14,8 22,6')}
    <rect class="o" x="17" y="40" width="10" height="36" rx="5" fill="${C.furShade}"/>
    <rect class="o" x="26" y="40" width="10" height="36" rx="5" fill="${C.fur}"/>
    <ellipse class="o" cx="44" cy="48" rx="30" ry="14" fill="${C.fur}" transform="rotate(22 44 48)"/>
    <path class="stripe-thick" d="M26,32 q3,4 1,8 M35,36 q3,4 1,8 M44,40 q3,4 1,8"/>
    <rect class="o" x="64" y="68" width="26" height="9" rx="4.5" fill="${C.furShade}"/>
    <rect class="o" x="62" y="70" width="30" height="8" rx="4" fill="${C.fur}"/>
    ${head({ x: 70, y: 54, eye: 'closed', mouthKind: 'tongue', tilt: -6 })}`;
}

function laptopPose() {
  const laptop = `<g class="cat-laptop">
      <path class="o" fill="${C.laptop}" d="M84,70 L91,42 L95,43 L89,71 Z"/>
      <circle cx="91" cy="56" r="2" fill="#fff" opacity="0.9"/>
      <rect class="o" x="58" y="68" width="34" height="6" rx="2" fill="${C.laptop}"/>
      <ellipse class="o cat-tap-l" cx="66" cy="67" rx="5" ry="3.4" fill="${C.fur}"/>
      <ellipse class="o cat-tap-r" cx="76" cy="67" rx="5" ry="3.4" fill="${C.fur}"/>
    </g>`;
  return sitPose({ headX: 54, headY: 31, tilt: 6, paws: false, extra: laptop });
}

function eatPose() {
  const bowl = `<g class="cat-bowl">
      <path class="o" fill="${C.bowl}" d="M70,66 h26 q-2,11 -13,11 q-11,0 -13,-11 z"/>
      <g fill="#c98b5e"><circle cx="78" cy="65" r="2.2"/><circle cx="83" cy="64" r="2.2"/><circle cx="88" cy="65" r="2.2"/></g>
      <path d="M77,71 q6,3 12,0" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.8"/>
    </g>`;
  return sitPose({ headX: 60, headY: 40, tilt: 18, eye: 'closed', mouthKind: 'small', extra: bowl, headWrap: 'cat-headwrap cat-nom' });
}

/** Durum adına göre SVG içeriği. */
export function catSvg(state, { night = false } = {}) {
  let inner;
  switch (state) {
    case 'walk': inner = walkPose(); break;
    case 'aim': inner = aimPose(); break;
    case 'jump': inner = jumpPose(); break;
    case 'sleep': inner = sleepPose(night); break;
    case 'stretch': inner = stretchPose(); break;
    case 'groom': inner = sitPose({
      eye: 'closed', mouthKind: 'tongue', tilt: -10,
      extra: `<ellipse class="o cat-lick-paw" cx="66" cy="44" rx="6" ry="5" fill="${C.fur}"/>`
    }); break;
    case 'purr': inner = sitPose({ eye: 'happy' }); break;
    case 'laptop': inner = laptopPose(); break;
    case 'eat': inner = eatPose(); break;
    default: inner = sitPose();
  }
  return `<svg viewBox="-4 -4 108 86" class="cat-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}
