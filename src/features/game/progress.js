// Remembers the best star count for each gig and which gigs are open.
import { load, save } from '../../lib/storage.js';
import { GIGS } from '../../config/gigs.js';
import { MAX_STARS } from '../tour/solutions.js';

const KEY = 'graveyard-gigs-tour';
let best = {};
// Call once before showing any screen that reads stars.
export async function loadProgress() { best = await load(KEY, {}); }

export const bestStars = (gigId) => Number(best[gigId] ?? 0);
export const totalStars = () => GIGS.reduce((sum, g) => sum + bestStars(g.id), 0);
export const starRow = (n) => '★'.repeat(n) + '☆'.repeat(MAX_STARS - n);
// A gig opens once the one before it has been cleared.
// ponytail: adding ?unlock to the address opens every gig, for testing and demos; remove it if a leaderboard ever depends on progress.
const unlockAll = new URLSearchParams(location.search).has('unlock');
export const isOpen = (index) => unlockAll || index === 0 || bestStars(GIGS[index - 1].id) > 0;

export function record(gigId, earned) {
  if (earned <= bestStars(gigId)) return;
  best[gigId] = earned;
  save(KEY, best);
}
