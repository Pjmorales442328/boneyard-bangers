// Remembers which gigs have been cleared and which are open.
import { load, save } from '../../lib/storage.js';
import { GIGS } from '../../config/gigs.js';

const KEY = 'boneyard-bangers-tour';
const cleared = load(KEY, {});

export const isCleared = (gigId) => Boolean(cleared[gigId]);
export const clearedCount = () => GIGS.filter((g) => isCleared(g.id)).length;
// A gig opens once the one before it has been cleared.
// ponytail: adding ?unlock to the address opens every gig, for testing and demos; remove it if a leaderboard ever depends on progress.
const unlockAll = new URLSearchParams(location.search).has('unlock');
export const isOpen = (index) => unlockAll || index === 0 || isCleared(GIGS[index - 1].id);

export function record(gigId) {
  if (isCleared(gigId)) return;
  cleared[gigId] = true;
  save(KEY, cleared);
}
