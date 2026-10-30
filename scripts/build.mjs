import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'story'), { recursive: true });
await mkdir(resolve(output, 'todo'), { recursive: true });
for (const file of ['index.html', 'studio.css', 'studio.js', 'style.css', 'script.js', 'story/index.html', 'story/halloween.js']) {
  await cp(resolve(root, file), resolve(output, file));
}
for (const file of ['index.html', 'todo.css', 'app.js', 'model.mjs', 'favicon.svg']) {
  await cp(resolve(root, 'todo', file), resolve(output, 'todo', file));
}
await cp(resolve(root, 'assets'), resolve(output, 'assets'), {
  recursive: true,
  filter: source => !source.endsWith('.md') && !source.endsWith('night-sea.png')
});
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Static site built: ${output}\nRoutes: /design/, /design/story/ and /design/todo/`);
