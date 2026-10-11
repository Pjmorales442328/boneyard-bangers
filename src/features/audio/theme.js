// Menu music: one band looping quietly behind the title screen and the tour map.
import { combos } from '../../lib/combos.js';
import { SLOTS } from '../../config/song.js';
import { SONGS, PART_IDS } from '../music/songs/index.js';
import { scoreMix } from '../music/score.js';
import { perform } from './performance.js';
import { now } from './engine.js';
import { settings } from '../../lib/settings.js';

const song = SONGS.mountainKing;
export const THEME_BEAT = 60 / song.bpm;
// A good band that is not the final gig's answer, so the menu gives nothing away.
export const THEME_BAND = combos(PART_IDS, SLOTS).map((ids) => ({ ids, ...scoreMix(ids, song) })).filter((r) => r.verdict === 'dance').sort((a, b) => b.score - a.score)[0].ids;

let run = null;
let timer = null;
let listener = null;

// Queues the next pass just before the current one ends. It follows the audio clock, so nothing piles up while sound is still blocked.
function keepGoing() {
  if (run && now() < run.end - 0.15) return;
  run = perform(THEME_BAND, song, { level: 0.45, onHit: (id, note) => listener?.(id, note) });
}

// `onHit(partId, note)` lets a screen animate to the music; pass nothing to just keep it playing.
export function playTheme(onHit = null) {
  listener = onHit;
  if (timer || !settings.music) return;
  keepGoing();
  timer = setInterval(keepGoing, 50);
}

export function stopTheme() {
  clearInterval(timer);
  timer = null;
  run?.stop();
  run = null;
}
