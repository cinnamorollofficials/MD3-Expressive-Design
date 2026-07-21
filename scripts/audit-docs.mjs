import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
const registry = readFileSync(resolve(root, 'src/demo/metadata/componentsRegistry.ts'), 'utf8');

const ids = [...app.matchAll(/\{\s*id:\s*'([^']+)',\s*label:/g)].map(match => match[1]);
const groupIds = new Set(['buttons', 'containment', 'selection', 'input', 'navigation', 'communication', 'content', 'charts']);
const uniqueIds = [...new Set(ids)].filter(id => !groupIds.has(id));

const documented = uniqueIds.filter(id => {
  const literalKey = new RegExp(`['"]${id}['"]\\s*:\\s*\\{`);
  const bareKey = new RegExp(`\\n\\s*${id.replace(/[-]/g, '\\-')}\\s*:\\s*\\{`);
  return literalKey.test(registry) || bareKey.test(registry);
});

const missing = uniqueIds.filter(id => !documented.includes(id));

if (missing.length > 0) {
  console.error(`Missing component documentation metadata for: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Component docs metadata covers ${documented.length}/${uniqueIds.length} demo components.`);
