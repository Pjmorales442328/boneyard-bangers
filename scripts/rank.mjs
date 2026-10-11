// Scores every possible mix of a song and prints the ranking: `npm run rank [songId]` (all songs if none given).
// `--check` fails if a song's scores stop making sense or a gig cannot be won.
import assert from 'node:assert/strict';
import { SONGS, PART_IDS } from '../src/features/music/songs/index.js';
import { SLOTS } from '../src/config/song.js';
import { scoreMix } from '../src/features/music/score.js';
import { combos } from '../src/lib/combos.js';
import { GIGS } from '../src/config/gigs.js';
import { wins, solutions, hintFor, starsFor, MAX_STARS } from '../src/features/tour/solutions.js';

const rank = (song) => combos(PART_IDS, SLOTS).map((ids) => ({ ids, ...scoreMix(ids, song) })).sort((a, b) => b.score - a.score);
const tally = (rows) => Object.entries(Object.groupBy(rows, (r) => r.verdict)).map(([k, v]) => `${k}:${v.length}`).join('  ');

function checkSongs() {
  for (const song of Object.values(SONGS)) {
    const rows = rank(song);
    assert.deepEqual(Object.keys(song.parts), PART_IDS, `song "${song.id}" needs one part per monster`);
    assert.ok(rows.some((r) => r.verdict === 'legend'), `song "${song.id}" has no legendary mix`);
    assert.ok(rows[0].score - rows.at(-1).score >= 30, `song "${song.id}": scores should spread out`);
  }
}

// Every gig must be winnable, its best band must earn full stars, and following the swap hints from any losing band must reach a win.
function checkGigs() {
  for (const gig of GIGS) {
    assert.ok(SONGS[gig.song], `gig "${gig.id}" names an unknown song`);
    const song = SONGS[gig.song];
    assert.ok(solutions(gig).length >= 1, `gig "${gig.id}" has no winning band`);
    assert.equal(starsFor(gig, solutions(gig)[0].ids.toReversed()), MAX_STARS, `gig "${gig.id}": best band should earn ${MAX_STARS} stars`);
    for (const start of combos(gig.roster, SLOTS)) {
      let picks = start;
      for (let swaps = 0; !wins(gig, scoreMix(picks, song).verdict); swaps++) {
        assert.ok(swaps < SLOTS, `gig "${gig.id}": hints do not lead ${start} to a win`);
        const [out, into] = hintFor(gig, picks, 4).swap;
        picks = picks.map((id) => (id === out ? into : id));
      }
    }
  }
}

if (process.argv.includes('--check')) {
  checkSongs();
  checkGigs();
  console.log(`ok: ${Object.keys(SONGS).length} songs score sensibly, ${GIGS.length} gigs winnable`);
} else {
  const only = process.argv[2];
  const p = (x) => x.toFixed(2);
  for (const song of Object.values(SONGS).filter((s) => !only || s.id === only)) {
    const rows = rank(song);
    console.log(`\n== ${song.id}: ${tally(rows)}`);
    if (only) for (const r of rows) console.log(String(r.score).padStart(3), r.verdict.padEnd(8), r.ids.join('+').padEnd(30), `g${p(r.parts.groove)} t${p(r.parts.tight)} s${p(r.parts.smooth)} f${p(r.parts.full)}`);
  }
  console.log();
  for (const gig of GIGS) console.log(gig.id.padEnd(11), gig.song.padEnd(13), `wants ${gig.wants.join('/')}`.padEnd(20), `${solutions(gig).length} of ${combos(gig.roster, SLOTS).length} bands win`, `best: ${solutions(gig)[0].ids.join('+')}`);
}
