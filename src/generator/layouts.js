export const LAYOUT_STYLES = {
  minimal: `
    /* Minimal Layout Style */
    :root {
      --radius: 4px;
      --card-border: 1px solid var(--border);
      --card-shadow: none;
      --header-align: left;
    }
    .hero {
      padding: 5rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
    }
    .hero h1 {
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .section-title {
      position: relative;
      padding-bottom: 0.75rem;
    }
    .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background: var(--primary);
    }
    .card {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: var(--radius);
      padding: 1.75rem;
      box-shadow: none;
    }
  `,

  modern: `
    /* Modern Layout Style */
    :root {
      --radius: 16px;
      --card-border: 1px solid rgba(0,0,0,0.06);
      --card-shadow: 0 10px 30px rgba(0,0,0,0.06);
      --header-align: center;
    }
    .hero {
      padding: 6rem 1.5rem;
      background: linear-gradient(135deg, var(--bg) 0%, rgba(255,255,255,0.8) 100%);
      border-bottom: 1px solid var(--border);
      text-align: center;
    }
    .hero .hero-inner {
      max-width: 780px;
      margin: 0 auto;
    }
    .card {
      border: var(--card-border);
      background: var(--surface);
      border-radius: var(--radius);
      padding: 2rem;
      box-shadow: var(--card-shadow);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.09);
    }
    .btn-primary {
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    }
  `,

  classic: `
    /* Classic Layout Style */
    :root {
      --radius: 6px;
      --card-border: 1px solid var(--border);
      --card-shadow: 0 2px 8px rgba(0,0,0,0.04);
      --header-align: center;
    }
    .hero {
      padding: 5.5rem 1.5rem;
      background: var(--surface);
      border-bottom: 3px double var(--border);
      text-align: center;
    }
    .hero .hero-inner {
      max-width: 720px;
      margin: 0 auto;
    }
    .section-title {
      text-align: center;
    }
    .section-title::after {
      content: '◆';
      display: block;
      margin: 0.5rem auto 0;
      color: var(--primary);
      font-size: 0.8rem;
    }
    .card {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: var(--radius);
      padding: 2rem;
      text-align: center;
    }
  `,

  bold: `
    /* Bold Layout Style */
    :root {
      --radius: 8px;
      --card-border: 2px solid var(--ink);
      --card-shadow: 4px 4px 0px var(--ink);
      --header-align: left;
    }
    .hero {
      padding: 6.5rem 1.5rem;
      background: var(--primary);
      color: #ffffff;
      border-bottom: 4px solid var(--ink);
    }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      line-height: 1.1;
      font-weight: 900;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }
    .hero p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.25rem;
    }
    .hero .btn-primary {
      background: var(--accent);
      color: var(--ink);
      border: 2px solid var(--ink);
      box-shadow: 4px 4px 0px var(--ink);
      font-weight: 700;
    }
    .card {
      border: 2px solid var(--ink);
      background: var(--surface);
      border-radius: var(--radius);
      padding: 2rem;
      box-shadow: 4px 4px 0px var(--ink);
    }
    .btn-primary {
      border: 2px solid var(--ink);
      box-shadow: 3px 3px 0px var(--ink);
    }
  `
};

export function getLayoutStyles(layout = 'modern') {
  return LAYOUT_STYLES[layout] || LAYOUT_STYLES.modern;
}
