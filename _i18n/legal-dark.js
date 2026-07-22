// One-time re-theme of the English legal page stylesheets (privacy + tos) to
// the Dice Drop game palette. These English files are the generator's
// templates, so re-running legal-gen.js afterward propagates the dark theme to
// every locale. Idempotent: replaces the whole <style> block each run.
const fs = require('fs');
const path = require('path');
const ROOT = 'path.join(__dirname, "..", "dicedrop")';

const STYLE = `<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Dice Drop game theme (constants/theme.ts -> dicedrop) */
    --bg:          #1C1008;
    --crimson:     #D94050;
    --text:        #FFE4C0;
    --body:        #EAD4B6;
    --secondary:   #E5AC78;
    --muted:       #C88E5C;
    --card:        #2E1A0C;
    --card-border: #5A3018;
    --orange:      #EA862A;
    --gold:        #DFB945;
  }

  html {
    background-color: var(--bg);
    /* Hearth glow low-center + faint crimson spill upper-right over a warm
       dark gradient — mirrors the in-game Dice Drop atmosphere. */
    background-image:
      radial-gradient(120% 70% at 50% 100%, rgba(122,58,32,0.50) 0%, rgba(122,58,32,0) 55%),
      radial-gradient(80% 45% at 88% 3%, rgba(217,64,80,0.10) 0%, rgba(217,64,80,0) 55%),
      linear-gradient(#160D06, #1C1008 40%, #28170B);
    background-attachment: fixed;
  }

  body {
    min-height: 100dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    color: var(--body);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
  }

  .stripe {
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, var(--crimson) 0%, var(--orange) 50%, var(--gold) 100%);
    flex-shrink: 0;
  }

  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px 0;
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
  }

  header a {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 28px;
    color: var(--text);
    text-decoration: none;
    letter-spacing: -0.5px;
  }

  header a:hover { opacity: 0.75; }

  .divider-line {
    width: 1px;
    height: 22px;
    background: var(--muted);
    opacity: 0.3;
  }

  header span {
    font-size: 14px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  main {
    flex: 1;
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
    padding: 32px 24px 48px;
  }

  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: clamp(36px, 8vw, 52px);
    color: var(--crimson);
    line-height: 1.1;
    margin-bottom: 8px;
    text-shadow: 0 2px 30px rgba(217,64,80,0.30);
  }

  .updated {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 36px;
  }

  .divider {
    width: 40px;
    height: 2px;
    border-radius: 1px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    margin-bottom: 36px;
  }

  h2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--secondary);
    margin-top: 36px;
    margin-bottom: 10px;
  }

  h2:first-of-type { margin-top: 0; }

  p {
    font-size: 15px;
    line-height: 1.75;
    color: var(--body);
    margin-bottom: 14px;
  }

  p:last-child { margin-bottom: 0; }

  ul {
    margin: 0 0 14px 0;
    padding-left: 20px;
  }

  ul li {
    font-size: 15px;
    line-height: 1.75;
    color: var(--body);
    margin-bottom: 4px;
  }

  strong { color: var(--text); font-weight: 600; }

  a {
    color: var(--crimson);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0 24px calc(18px + env(safe-area-inset-bottom, 0px));
    flex-shrink: 0;
  }

  .footer-links {
    font-size: 11px;
    color: var(--muted);
  }

  .footer-links a { color: var(--muted); }
</style>`;

for (const slug of ['privacy', 'tos']) {
  const p = path.join(ROOT, slug, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<style>[\s\S]*?<\/style>/, STYLE);
  if (!html.includes('name="theme-color"')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="theme-color" content="#1C1008">'
    );
  }
  fs.writeFileSync(p, html);
  console.log('re-themed', slug);
}
