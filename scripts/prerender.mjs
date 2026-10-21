// Build-time prerender. Runs after `vite build` (dist/ holds the client
// template) and `vite build --ssr` (dist-ssr/ holds the render entry).
//
// Writes into dist/:
//   index.html      English page, canonical /en/ (the root URL)
//   en/index.html   English page, canonical /en/
//   fr/index.html   French page, canonical /fr/
//   ar/index.html   Arabic page (RTL), canonical /ar/, static Cairo stylesheet
//   sitemap.xml     the three language URLs with reciprocal hreflang
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const {
  renderApp,
  PAGE_META,
  LANGUAGE_PATHS,
  OPEN_GRAPH_LOCALES,
  SITE_ORIGIN,
  SUPPORTED_LANGUAGES,
} = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

const DEFAULT_LANGUAGE = 'en';
const ARABIC_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Vite writes the template with CRLF on Windows; normalise so the patterns match.
const template = readFileSync(join(distDir, 'index.html'), 'utf8').replace(/\r\n/g, '\n');

/** Replace exactly one match; throw if the placeholder is missing so the build fails loudly. */
function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: template placeholder not found: ${label}`);
  }
  return html.replace(pattern, replacement);
}

const alternateLinks = [
  ...SUPPORTED_LANGUAGES.map((code) => `    <link rel="alternate" hreflang="${code}" href="${SITE_ORIGIN}${LANGUAGE_PATHS[code]}" />`),
  `    <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${LANGUAGE_PATHS[DEFAULT_LANGUAGE]}" />`,
].join('\n');

const ogLocaleAlternates = (language) => SUPPORTED_LANGUAGES
  .filter((code) => code !== language)
  .map((code) => `    <meta property="og:locale:alternate" content="${OPEN_GRAPH_LOCALES[code]}" />`)
  .join('\n');

function buildPage(language) {
  const meta = PAGE_META[language];
  const isRtl = language === 'ar';
  const canonical = SITE_ORIGIN + LANGUAGE_PATHS[language];
  const appHtml = renderApp(language);

  let page = template;
  page = replaceRequired(page, /<html lang="en">/, `<html lang="${language}" dir="${isRtl ? 'rtl' : 'ltr'}">`, '<html lang>');
  page = replaceRequired(page, /<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`, '<title>');
  page = replaceRequired(page, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`, 'meta description');
  page = replaceRequired(page, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`, 'canonical');
  page = replaceRequired(page, /(    <link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n)+/, `${alternateLinks}\n`, 'hreflang block');
  page = replaceRequired(page, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`, 'og:url');
  page = replaceRequired(page, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`, 'og:title');
  page = replaceRequired(page, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`, 'og:description');
  page = replaceRequired(page, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${OPEN_GRAPH_LOCALES[language]}" />`, 'og:locale');
  page = replaceRequired(page, /(    <meta property="og:locale:alternate" content="[^"]*" \/>\n)+/, `${ogLocaleAlternates(language)}\n`, 'og:locale:alternate block');

  if (isRtl) {
    // Static Arabic font: non-blocking like the other Google stylesheet, with a
    // <noscript> fallback. The id stops the client from adding it a second time.
    const fontLinks = [
      `    <link rel="stylesheet" id="arabic-font" href="${ARABIC_FONT_HREF}" media="print" onload="this.media='all'" />`,
      `    <noscript><link rel="stylesheet" href="${ARABIC_FONT_HREF}" /></noscript>`,
    ].join('\n');
    page = replaceRequired(page, /  <\/head>/, `${fontLinks}\n  </head>`, '</head>');
  }

  // Prerendered markup goes inside #root. data-ssr-lang lets the client decide to hydrate.
  page = replaceRequired(
    page,
    /<div id="root"><\/div>/,
    `<div id="root" data-ssr-lang="${language}">${appHtml}</div>`,
    '#root',
  );

  return page;
}

function writePage(relativePath, html) {
  const outPath = join(distDir, relativePath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered -> dist/${relativePath} (${html.length} bytes)`);
}

// Root "/" shows English with the /en/ canonical.
writePage('index.html', buildPage(DEFAULT_LANGUAGE));
for (const language of SUPPORTED_LANGUAGES) {
  writePage(`${language}/index.html`, buildPage(language));
}

// Sitemap: one <url> per language path with reciprocal alternates.
const sitemapEntries = SUPPORTED_LANGUAGES.map((code) => {
  const loc = SITE_ORIGIN + LANGUAGE_PATHS[code];
  const links = [
    ...SUPPORTED_LANGUAGES.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_ORIGIN}${LANGUAGE_PATHS[alt]}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${LANGUAGE_PATHS[DEFAULT_LANGUAGE]}" />`,
  ].join('\n');
  return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
});
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
console.log('wrote dist/sitemap.xml');

// The render entry is build-only; keep it out of the deployed output.
rmSync(ssrDir, { recursive: true, force: true });
