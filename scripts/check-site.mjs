import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://dugers.github.io';
const base = '/design/';
const files = ['index.html', 'story/index.html', 'todo/index.html', 'studio.css', 'style.css', 'todo/todo.css'];
let count = 0;
const stylesheetPages = { 'studio.css': 'index.html', 'style.css': 'story/index.html', 'todo/todo.css': 'todo/index.html' };
for (const file of files) {
  const source = await readFile(resolve(root, file), 'utf8');
  const page = new URL(base + file.replace(/index\.html$/, ''), origin);
  const markup = file.endsWith('.css') ? await readFile(resolve(root, stylesheetPages[file]), 'utf8') : source;
  const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const refs = file.endsWith('.css')
    ? [...source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(match => match[1])
    : [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const reference of refs) {
    if (reference === '#') continue;
    if (reference.startsWith('#')) {
      assert(ids.has(reference.slice(1)), `${file}: missing anchor ${reference}`);
      continue;
    }
    const url = new URL(reference, page);
    if (url.origin !== origin) continue;
    assert(url.pathname.startsWith(base), `${file}: escaped GitHub Pages base: ${reference}`);
    let target = resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    assert((await stat(target)).isFile(), `${file}: missing ${relative(root, target)}`);
    count++;
  }
}
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const story = await readFile(resolve(root, 'story/index.html'), 'utf8');
assert.equal((home.match(/href="story\/"/g) || []).length, 1, 'Exactly one artwork links to the story');
assert(home.includes('52482a64'), 'Direction contract survives production build');
assert.equal((home.match(/<article class="project /g) || []).length, 5);
assert(story.includes('datetime="2026-10-04">04.10.2026'), 'First meeting date preserved');
assert(story.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').includes('Некоторые события кажутся случайными'), 'Story opening preserved');
const listeners = [];
const entries = [0, 1, 2].map(() => ({ open: false, addEventListener: (_, fn) => listeners.push(fn) }));
vm.runInNewContext(await readFile(resolve(root, 'script.js'), 'utf8'), { document: { querySelectorAll: () => entries } });
entries[0].open = true;
listeners[0]();
entries[1].open = true;
listeners[1]();
assert.equal(entries[0].open, false);
assert.equal(entries[1].open, true);
console.log(`PASS: ${count} local references resolve under ${base}; all three page routes, artwork link, five projects, story date, and chapter interaction verified.`);
