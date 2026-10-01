/**
 * Lightweight, zero-dependency confetti effect.
 * Triggered on successful site export / completion.
 * Dispatches 'site:celebrate' event for mascot Tatlim.
 */

export function triggerConfetti() {
  if (typeof document === 'undefined') return;

  // Respect reduced motion
  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Notify mascot Tatlim
  try {
    window.dispatchEvent(new CustomEvent('site:celebrate'));
  } catch (e) {
    // Ignore event dispatch errors
  }

  if (isReducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.cssText = 'position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const colors = ['#f472b6', '#a78bfa', '#38bdf8', '#4ade80', '#fbbf24', '#fb923c', '#818cf8'];
  const particleCount = Math.min(60, Math.floor(width / 15));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: -20 - Math.random() * 50,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: -4 + Math.random() * 8,
      opacity: 1
    });
  }

  let animationFrameId;
  const startTime = Date.now();
  const maxDuration = 3200; // 3.2 seconds

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > maxDuration) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y += p.speedY;
      p.x += Math.sin(p.y / 20) * 1.5 + p.speedX * 0.3;
      p.rotation += p.rotSpeed;

      if (elapsed > 2000) {
        p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1200);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}
