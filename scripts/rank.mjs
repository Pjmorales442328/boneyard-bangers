// Scores every possible mix and prints the ranking. `--check` fails if the spread stops making sense.
import assert from 'node:assert/strict';
import { PART_IDS } from '../src/features/music/parts.js';
import { SLOTS } from '../src/config/song.js';
import { scoreMix } from '../src/features/music/score.js';

const combos = (items, k) => (k === 0 ? [[]] : items.flatMap((x, i) => combos(items.slice(i + 1), k - 1).map((c) => [x, ...c])));
const rows = combos(PART_IDS, SLOTS).map((ids) => ({ ids, ...scoreMix(ids) })).sort((a, b) => b.score - a.score);
const counts = Object.groupBy(rows, (r) => r.verdict);

if (process.argv.includes('--check')) {
  assert.equal(rows.length, 70);
  assert.equal(counts.legend?.length, 1, 'exactly one legendary mix');
  for (const v of ['dance', 'meh', 'offbeat', 'quake', 'ouch', 'dizzy', 'sleep']) assert.ok(counts[v]?.length >= 2, `verdict "${v}" needs at least 2 mixes`);
  assert.ok(rows[0].score - rows.at(-1).score >= 30, 'scores should spread out');
  console.log('ok: 70 mixes, 1 legend, every verdict reachable');
} else {
  const p = (x) => x.toFixed(2);
  for (const r of rows) console.log(String(r.score).padStart(3), '*'.repeat(r.stars).padEnd(5), r.verdict.padEnd(8), r.ids.join('+').padEnd(30), `g${p(r.parts.groove)} t${p(r.parts.tight)} s${p(r.parts.smooth)} f${p(r.parts.full)}`);
  console.log(Object.entries(counts).map(([k, v]) => `${k}:${v.length}`).join('  '));
}
