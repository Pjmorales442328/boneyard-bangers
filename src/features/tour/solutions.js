// Decides whether a mix clears a gig, how many stars it earns, and what the crowd should shout after a miss.
import { combos } from '../../lib/combos.js';
import { SLOTS } from '../../config/song.js';
import { monsterById } from '../../config/monsters.js';
import { VERDICTS } from '../../config/verdicts.js';
import { scoreMix } from '../music/score.js';
import { SONGS } from '../music/songs/index.js';

export const MAX_STARS = 3;
export const wins = (gig, verdict) => gig.wants.includes(verdict);

// Winning bands, best first. For a crowd that wants a groove the best band scores highest;
// for any other wish (lullaby, rumble...) the best is the most extreme one, which scores lowest.
export function solutions(gig) {
  const order = wins(gig, 'dance') || wins(gig, 'legend') ? -1 : 1;
  return combos(gig.roster, SLOTS).map((ids) => ({ ids, ...scoreMix(ids, SONGS[gig.song]) })).filter((r) => wins(gig, r.verdict)).sort((a, b) => order * (a.score - b.score));
}

const shared = (a, b) => a.filter((id) => b.includes(id)).length;

// Stars rate the band, not the number of tries: 3 for the best band there is, 2 for the better half of the rest, 1 for any other win, 0 for a miss.
export function starsFor(gig, ids) {
  const all = solutions(gig);
  const rank = all.findIndex((s) => shared(s.ids, ids) === SLOTS);
  if (rank < 0) return 0;
  if (all[rank].score === all[0].score) return MAX_STARS;
  return rank <= all.length / 2 ? 2 : 1;
}

// Each miss makes the hint plainer: the crowd's wish, then what is missing, then what to trade for it, then the exact swap.
// It always points at the nearest winning band, so following it never leads away from a win.
export function hintFor(gig, picks, misses) {
  const target = solutions(gig).map((s, rank) => ({ ...s, rank })).sort((a, b) => shared(b.ids, picks) - shared(a.ids, picks) || a.rank - b.rank)[0];
  const out = monsterById[picks.find((id) => !target.ids.includes(id))];
  const into = monsterById[target.ids.find((id) => !picks.includes(id))];
  const text = [
    VERDICTS[gig.wants[0]].nudge,
    `We need more ${into.brings}!`,
    `Less ${out.brings}, more ${into.brings}!`,
  ][misses - 1] ?? `Swap ${out.name} for ${into.name}!`;
  return { text, swap: [out.id, into.id] };
}
