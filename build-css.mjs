import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
mkdirSync(resolve(root, 'dist'), { recursive: true });
const css = ['../css/tokens.css', '../css/bundle.css', 'react-extra.css'].map(read).join('\n');
writeFileSync(resolve(root, 'dist/styles.css'), css);
console.log('dist/styles.css', css.length, 'bytes');
