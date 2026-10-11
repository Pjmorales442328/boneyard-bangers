// Decides whether a mix clears a gig, and lists the bands that would.
import { combos } from '../../lib/combos.js';
import { SLOTS } from '../../config/song.js';
import { scoreMix } from '../music/score.js';
import { SONGS } from '../music/songs/index.js';

export const wins = (gig, verdict) => gig.wants.includes(verdict);
export const solutions = (gig) => combos(gig.roster, SLOTS).map((ids) => ({ ids, ...scoreMix(ids, SONGS[gig.song]) })).filter((r) => wins(gig, r.verdict));
