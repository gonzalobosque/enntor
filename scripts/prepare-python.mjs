import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const target = new URL('../public/python/', import.meta.url);
await mkdir(target, { recursive: true });
await Promise.all([
  'pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json',
].map((file) => copyFile(require.resolve(`pyodide/${file}`), new URL(file, target))));
