# Legal page localization generator

Generates the localized privacy + TOS pages under `dicedrop/{privacy,tos}/{lang}/`
for 8 languages (es, fr, de, pt, it, ja, ko, zh), plus injects the language
switcher + hreflang into the canonical English pages.

**English is authoritative.** The generator uses each page's live English
`index.html` as the structural template (CSS/chrome can't drift) and swaps in
translated `<main>` content from `legal-body.js`. Every localized page carries
a canonical-version note pointing back to the English version.

## Regenerate (after editing an English page or a translation)

```bash
node _i18n/legal-gen.js
```

- Edit the **English** `dicedrop/privacy/index.html` / `dicedrop/tos/index.html`
  for content/structure changes, then rerun to propagate the chrome.
- Edit `legal-body.js` for translated section content; `legal-gen.js` for
  titles, headings, the canonical note, or to add/remove a language.
- The `_i18n/` folder is ignored by GitHub Pages (Jekyll skips `_`-prefixed
  dirs), so it is never published.

⚠️ If you add or change a data-collecting SDK, update the English privacy
policy's Third-Party Services section AND the matching paragraph in every
language in `legal-body.js`, then regenerate.
