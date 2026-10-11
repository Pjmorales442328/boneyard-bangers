// Scores every possible mix and prints the ranking. `--check` fails if the spread stops making sense or a gig cannot be won.
import assert from 'node:assert/strict';
import { PART_IDS } from '../src/features/music/parts.js';
import { SLOTS } from '../src/config/song.js';
import { scoreMix } from '../src/features/music/score.js';
import { combos } from '../src/lib/combos.js';
import { GIGS } from '../src/config/gigs.js';
import { wins, solutions, hintFor } from '../src/features/tour/hints.js';

// Every gig must be winnable, and following the swap hints from any losing band must reach a win.
function checkGigs() {
  for (const gig of GIGS) {
    assert.ok(solutions(gig).length >= 1, `gig "${gig.id}" has no winning band`);
    for (const start of combos(gig.roster, SLOTS)) {
      let picks = start;
      for (let swaps = 0; !wins(gig, scoreMix(picks).verdict); swaps++) {
        assert.ok(swaps < SLOTS, `gig "${gig.id}": hints do not lead ${start} to a win`);
        const [out, into] = hintFor(gig, picks, 3).swap;
        picks = picks.map((id) => (id === out ? into : id));
      }
    }
  }
}
const rows = combos(PART_IDS, SLOTS).map((ids) => ({ ids, ...scoreMix(ids) })).sort((a, b) => b.score - a.score);
const counts = Object.groupBy(rows, (r) => r.verdict);

if (process.argv.includes('--check')) {
  assert.equal(rows.length, 70);
  assert.equal(counts.legend?.length, 1, 'exactly one legendary mix');
  for (const v of ['dance', 'meh', 'offbeat', 'quake', 'ouch', 'dizzy', 'sleep']) assert.ok(counts[v]?.length >= 2, `verdict "${v}" needs at least 2 mixes`);
  assert.ok(rows[0].score - rows.at(-1).score >= 30, 'scores should spread out');
  checkGigs();
  console.log(`ok: 70 mixes, 1 legend, every verdict reachable, ${GIGS.length} gigs winnable`);
} else {
  const p = (x) => x.toFixed(2);
  for (const r of rows) console.log(String(r.score).padStart(3), '*'.repeat(r.stars).padEnd(5), r.verdict.padEnd(8), r.ids.join('+').padEnd(30), `g${p(r.parts.groove)} t${p(r.parts.tight)} s${p(r.parts.smooth)} f${p(r.parts.full)}`);
  console.log(Object.entries(counts).map(([k, v]) => `${k}:${v.length}`).join('  '));
}
