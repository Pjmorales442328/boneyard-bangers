// Decides whether a mix clears a gig and what the crowd should shout after a miss.
// The hint is never a guess: it finds the nearest winning band and points toward it.
import { combos } from '../../lib/combos.js';
import { SLOTS } from '../../config/song.js';
import { monsterById } from '../../config/monsters.js';
import { scoreMix } from '../music/score.js';
import { SONGS } from '../music/songs/index.js';

export const wins = (gig, verdict) => gig.wants.includes(verdict);
export const solutions = (gig) => combos(gig.roster, SLOTS).map((ids) => ({ ids, ...scoreMix(ids, SONGS[gig.song]) })).filter((r) => wins(gig, r.verdict));

// Each miss makes the hint blunter: how many can stay, then who must go, then the exact swap.
export function hintFor(gig, picks, misses) {
  const shared = (s) => s.ids.filter((id) => picks.includes(id)).length;
  const target = solutions(gig).sort((a, b) => shared(b) - shared(a) || b.score - a.score)[0];
  const out = picks.find((id) => !target.ids.includes(id));
  const into = target.ids.find((id) => !picks.includes(id));
  const keep = shared(target);
  if (misses >= 3) return { text: `Swap ${monsterById[out].name} for ${monsterById[into].name}!`, blame: out, swap: [out, into] };
  if (misses === 2) return { text: `${monsterById[out].name} has to go!`, blame: out, swap: [out, into] };
  return { text: keep ? `${keep} of your ${SLOTS} can stay.` : 'Try a whole new band!', swap: [out, into] };
}
