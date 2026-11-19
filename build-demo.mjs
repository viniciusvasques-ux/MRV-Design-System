import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(resolve(root, 'dist/styles.css'), 'utf8');

async function bundle(embed, logo) {
  const out = await build({
    entryPoints: [resolve(root, 'demo/App.tsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', minify: true,
    target: 'es2020',
    define: { 'process.env.NODE_ENV': '"production"', __EMBED__: String(embed), __LOGO__: JSON.stringify(logo) },
  });
  return out.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
}

function page(js, { theme, extraCss = '' }) {
  return `<!doctype html><html lang="pt-BR" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DS MRV&CO · React</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
<style>${css}\nbody{margin:0;background:var(--surface-base);color:var(--text-active);font-family:var(--font-outfit,Outfit,sans-serif)}${extraCss}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
}

mkdirSync(resolve(root, 'demo/dist'), { recursive: true });
writeFileSync(resolve(root, 'demo/dist/index.html'), page(await bundle(false, ''), { theme: 'light' }));
console.log('demo/dist/index.html');

// Variante integrada à apresentação (cabeçalho com logo, links e tema compartilhado). Saída: demo/dist/react.html
const logoFile = process.env.LOGO_FILE || resolve(root, '../assets/MRV_CO_logo_mono_negative.svg');
if (existsSync(logoFile)) {
  let logo = readFileSync(logoFile, 'utf8').trim();
  if (!/class="logo"/.test(logo)) logo = logo.replace('<svg ', '<svg class="logo" ');
  writeFileSync(
    resolve(root, 'demo/dist/react.html'),
    page(await bundle(true, logo), { theme: 'dark', extraCss: '\n.logo{display:block;height:24px;width:auto;color:var(--text-primary);flex:none}a.ds-btn{text-decoration:none}@media(max-width:599px){.logo{width:112px;height:auto}}' }),
  );
  console.log('demo/dist/react.html');
}
