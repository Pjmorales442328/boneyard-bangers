// Remembers which crowd reactions the player has found and which mixes they have tried.
import { load, save } from '../../lib/storage.js';

const KEY = 'boneyard-bangers-progress';
export const TOTAL_MIXES = 70;
const state = load(KEY, { found: [], tried: {}, best: 0 });

export const mixKey = (ids) => [...ids].sort().join('+');

// Returns what was new about this result so the UI can celebrate it.
export function record(ids, result) {
  const key = mixKey(ids);
  const news = { newReaction: !state.found.includes(result.verdict), newMix: !(key in state.tried), newBest: result.score > state.best };
  if (news.newReaction) state.found.push(result.verdict);
  state.tried[key] = result.score;
  state.best = Math.max(state.best, result.score);
  save(KEY, state);
  return news;
}

export const progress = () => ({ found: state.found, triedCount: Object.keys(state.tried).length, best: state.best });
