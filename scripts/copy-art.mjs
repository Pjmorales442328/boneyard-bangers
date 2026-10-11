// Copies only the monster art pieces the game uses from the unpacked Kenney pack into public/monsters.
import { copyFileSync, mkdirSync } from 'node:fs';
import { MONSTERS, artFiles } from '../src/config/monsters.js';

const from = new URL('../raw-assets/kenney/PNG/Double/', import.meta.url);
const to = new URL('../public/monsters/', import.meta.url);
mkdirSync(to, { recursive: true });
const files = new Set(MONSTERS.flatMap((m) => Object.values(artFiles(m)).flat()));
for (const f of files) copyFileSync(new URL(f, from), new URL(f, to));
console.log(`copied ${files.size} files`);
