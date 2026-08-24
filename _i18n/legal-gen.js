// Generates localized privacy + TOS pages for topsidegames.com/dicedrop.
// Uses the live English index.html of each page as the structural template
// (so CSS/chrome can never drift), swapping in translated <main> content,
// title/description, <html lang>, a language switcher, a canonical-version
// note (non-English only), and hreflang alternates. English stays canonical:
// its file keeps its authored content and only gains the switcher/hreflang.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dicedrop');
const BASE = 'https://topsidegames.com/dicedrop';

// slug = URL folder + hreflang tag. English lives at the page root.
const LANGS = [
  { code: 'en', name: 'English',   hreflang: 'en' },
  { code: 'es', name: 'Español',   hreflang: 'es' },
  { code: 'fr', name: 'Français',  hreflang: 'fr' },
  { code: 'de', name: 'Deutsch',   hreflang: 'de' },
  { code: 'pt', name: 'Português', hreflang: 'pt-BR' },
  { code: 'it', name: 'Italiano',  hreflang: 'it' },
  { code: 'ja', name: '日本語',     hreflang: 'ja' },
  { code: 'ko', name: '한국어',     hreflang: 'ko' },
  { code: 'zh', name: '简体中文',   hreflang: 'zh-Hans' },
];

const CANONICAL = {
  es: 'Esta es una traducción de cortesía. La versión en <a href="LINK">inglés</a> es la versión oficial y vinculante.',
  fr: 'Ceci est une traduction de courtoisie. La version <a href="LINK">anglaise</a> est la version officielle et fait foi.',
  de: 'Dies ist eine Übersetzung als Serviceleistung. Maßgeblich und rechtsverbindlich ist die <a href="LINK">englische</a> Fassung.',
  pt: 'Esta é uma tradução de cortesia. A versão em <a href="LINK">inglês</a> é a versão oficial e prevalece.',
  it: 'Questa è una traduzione di cortesia. La versione in <a href="LINK">inglese</a> è quella ufficiale e prevale.',
  ja: 'これは参考のための翻訳です。正式かつ拘束力を持つのは<a href="LINK">英語版</a>です。',
  ko: '이 문서는 참고용 번역입니다. 공식적이고 구속력을 갖는 것은 <a href="LINK">영어</a> 버전입니다.',
  zh: '本页面为参考译文。以<a href="LINK">英文</a>版本为正式且具有约束力的版本。',
};

const CONTACT_WORD = { en:'Contact', es:'Contacto', fr:'Contact', de:'Kontakt', pt:'Contato', it:'Contatti', ja:'お問い合わせ', ko:'문의', zh:'联系' };

const TITLE = {
  privacy: { en:'Privacy Policy — Topside: Dice Drop', es:'Política de Privacidad — Topside: Dice Drop', fr:'Politique de Confidentialité — Topside: Dice Drop', de:'Datenschutzerklärung — Topside: Dice Drop', pt:'Política de Privacidade — Topside: Dice Drop', it:'Informativa sulla Privacy — Topside: Dice Drop', ja:'プライバシーポリシー — Topside: Dice Drop', ko:'개인정보 처리방침 — Topside: Dice Drop', zh:'隐私政策 — Topside: Dice Drop' },
  tos: { en:'Terms of Service — Topside: Dice Drop', es:'Términos del Servicio — Topside: Dice Drop', fr:'Conditions d’Utilisation — Topside: Dice Drop', de:'Nutzungsbedingungen — Topside: Dice Drop', pt:'Termos de Serviço — Topside: Dice Drop', it:'Termini di Servizio — Topside: Dice Drop', ja:'利用規約 — Topside: Dice Drop', ko:'서비스 이용약관 — Topside: Dice Drop', zh:'服务条款 — Topside: Dice Drop' },
};
const DESC = {
  privacy: { en:'Privacy policy for Topside: Dice Drop, the drop and merge puzzle game.', es:'Política de privacidad de Topside: Dice Drop, el juego de puzles de soltar y combinar.', fr:'Politique de confidentialité de Topside: Dice Drop, le jeu de puzzle à faire tomber et fusionner.', de:'Datenschutzerklärung für Topside: Dice Drop, das Fall- und Kombinier-Puzzlespiel.', pt:'Política de privacidade do Topside: Dice Drop, o jogo de puzzle de soltar e combinar.', it:'Informativa sulla privacy di Topside: Dice Drop, il gioco di puzzle in cui far cadere e combinare.', ja:'落として合体させるパズルゲーム「Topside: Dice Drop」のプライバシーポリシー。', ko:'떨어뜨려 합치는 퍼즐 게임 Topside: Dice Drop의 개인정보 처리방침입니다.', zh:'合并消除益智游戏 Topside: Dice Drop 的隐私政策。' },
  tos: { en:'Terms of service for Topside: Dice Drop, the drop and merge puzzle game.', es:'Términos del servicio de Topside: Dice Drop, el juego de puzles de soltar y combinar.', fr:'Conditions d’utilisation de Topside: Dice Drop, le jeu de puzzle à faire tomber et fusionner.', de:'Nutzungsbedingungen für Topside: Dice Drop, das Fall- und Kombinier-Puzzlespiel.', pt:'Termos de serviço do Topside: Dice Drop, o jogo de puzzle de soltar e combinar.', it:'Termini di servizio di Topside: Dice Drop, il gioco di puzzle in cui far cadere e combinare.', ja:'落として合体させるパズルゲーム「Topside: Dice Drop」の利用規約。', ko:'떨어뜨려 합치는 퍼즐 게임 Topside: Dice Drop의 서비스 이용약관입니다.', zh:'合并消除益智游戏 Topside: Dice Drop 的服务条款。' },
};
const H1 = {
  privacy: { es:'Política de Privacidad', fr:'Politique de Confidentialité', de:'Datenschutzerklärung', pt:'Política de Privacidade', it:'Informativa sulla Privacy', ja:'プライバシーポリシー', ko:'개인정보 처리방침', zh:'隐私政策' },
  tos: { es:'Términos del Servicio', fr:'Conditions d’Utilisation', de:'Nutzungsbedingungen', pt:'Termos de Serviço', it:'Termini di Servizio', ja:'利用規約', ko:'서비스 이용약관', zh:'服务条款' },
};
const UPDATED = {
  privacy: { es:'Última actualización: julio de 2026', fr:'Dernière mise à jour : juillet 2026', de:'Zuletzt aktualisiert: Juli 2026', pt:'Última atualização: julho de 2026', it:'Ultimo aggiornamento: luglio 2026', ja:'最終更新日：2026年7月', ko:'최종 업데이트: 2026년 7월', zh:'最后更新：2026年7月' },
  tos: { es:'Última actualización: 25 de junio de 2026', fr:'Dernière mise à jour : 25 juin 2026', de:'Zuletzt aktualisiert: 25. Juni 2026', pt:'Última atualização: 25 de junho de 2026', it:'Ultimo aggiornamento: 25 giugno 2026', ja:'最終更新日：2026年6月25日', ko:'최종 업데이트: 2026년 6월 25일', zh:'最后更新：2026年6月25日' },
};

// Translated <main> body (the section blocks, excluding h1/updated/divider).
// Links/emails identical across languages. See strings-body.js.
const BODY = require('./legal-body.js');

const EXTRA_CSS = `
  .langbar { display:flex; flex-wrap:wrap; gap:4px 12px; font-size:12px; margin-bottom:22px; }
  .langbar a { color:var(--muted); text-decoration:none; }
  .langbar a:hover { color:var(--crimson); text-decoration:underline; }
  .langbar .active { color:var(--text); font-weight:500; }
  .canonical { font-size:12.5px; line-height:1.5; color:var(--secondary); background:rgba(90,48,24,0.28); border:1px solid var(--card-border); border-radius:8px; padding:11px 13px; margin-bottom:30px; }
  .canonical a { color:var(--crimson); }
`;

// Strip any previously-injected switcher, CSS, and hreflang so the generator
// is idempotent (re-running yields identical output) and self-heals pages that
// accumulated duplicates from earlier runs.
function clean(html) {
  html = html.replace(/\s*<nav class="langbar"[\s\S]*?<\/nav>/g, '');
  html = html.replace(/\n  \.langbar \{[\s\S]*?\.canonical a \{[^}]*\}\n/g, '\n');
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '');
  return html;
}

function switcher(slug, cur) {
  const items = LANGS.map(l => {
    const href = l.code === 'en' ? `/dicedrop/${slug}/` : `/dicedrop/${slug}/${l.code}/`;
    return l.code === cur
      ? `<span class="active">${l.name}</span>`
      : `<a href="${href}">${l.name}</a>`;
  }).join('\n    ');
  return `<nav class="langbar" aria-label="Language">\n    ${items}\n  </nav>`;
}

function hreflangBlock(slug) {
  const lines = LANGS.map(l => {
    const href = l.code === 'en' ? `${BASE}/${slug}/` : `${BASE}/${slug}/${l.code}/`;
    return `<link rel="alternate" hreflang="${l.hreflang}" href="${href}">`;
  });
  lines.push(`<link rel="alternate" hreflang="x-default" href="${BASE}/${slug}/">`);
  return lines.join('\n');
}

function generate(slug) {
  // Clean the template first so prior injections never stack (idempotent).
  const tmpl = clean(fs.readFileSync(path.join(ROOT, slug, 'index.html'), 'utf8'));

  for (const l of LANGS) {
    let html = tmpl;

    // Common chrome for every output: extra CSS + hreflang alternates.
    html = html.replace('</style>', EXTRA_CSS + '</style>');
    html = html.replace('</head>', hreflangBlock(slug) + '\n</head>');

    if (l.code === 'en') {
      // Canonical: keep authored content; just insert the switcher at top of main.
      html = html.replace('<main>\n', `<main>\n  ${switcher(slug, 'en')}\n`);
      fs.writeFileSync(path.join(ROOT, slug, 'index.html'), html);
      continue;
    }

    // Localized page: swap lang, title, description, and the whole <main>.
    html = html.replace('<html lang="en">', `<html lang="${l.hreflang}">`);
    html = html.replace(TITLE[slug].en, TITLE[slug][l.code]);
    html = html.replace(DESC[slug].en, DESC[slug][l.code]);
    html = html.replace(`>${CONTACT_WORD.en}</a>`, `>${CONTACT_WORD[l.code]}</a>`);
    // Localized pages live one folder deeper than English, so the English
    // relative asset paths (../bg.svg, ../../logo.svg) would break. Use
    // root-absolute paths that resolve at any depth.
    html = html.replace("url('../bg.svg')", "url('/dicedrop/bg.svg')");
    html = html.replace('href="../../logo.svg"', 'href="/logo.svg"');

    const note = `<div class="canonical">${CANONICAL[l.code].replace('LINK', `/dicedrop/${slug}/`)}</div>`;
    const main =
      `<main>\n  ${switcher(slug, l.code)}\n` +
      `  <h1>${H1[slug][l.code]}</h1>\n` +
      `  <p class="updated">${UPDATED[slug][l.code]}</p>\n` +
      `  <div class="divider"></div>\n\n` +
      `  ${note}\n\n` +
      `  ${BODY[slug][l.code]}\n</main>`;
    html = html.replace(/<main>[\s\S]*<\/main>/, main);

    const dir = path.join(ROOT, slug, l.code);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

generate('privacy');
generate('tos');
console.log('Generated privacy + tos in 8 locales (+ English switcher).');
