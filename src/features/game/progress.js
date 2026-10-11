// Remembers the best star count for each gig and which gigs are open.
import { load, save } from '../../lib/storage.js';
import { GIGS } from '../../config/gigs.js';

const KEY = 'boneyard-bangers-tour';
const stars = load(KEY, {});

export const MAX_STARS = 3;
export const starsFor = (gigId) => stars[gigId] ?? 0;
export const totalStars = () => GIGS.reduce((sum, g) => sum + starsFor(g.id), 0);
// A gig opens once the one before it has been cleared.
// ponytail: adding ?unlock to the address opens every gig, for testing and demos; remove it if a leaderboard ever depends on progress.
const unlockAll = new URLSearchParams(location.search).has('unlock');
export const isOpen = (index) => unlockAll || index === 0 || starsFor(GIGS[index - 1].id) > 0;
export const starsForTry = (tries) => Math.max(1, MAX_STARS + 1 - tries);

export function record(gigId, earned) {
  if (earned <= starsFor(gigId)) return;
  stars[gigId] = earned;
  save(KEY, stars);
}
