// One gig: the crowd asks for a style, the player picks four monsters, MASH, and the crowd answers.
import { el } from '../../lib/dom.js';
import { SLOTS } from '../../config/song.js';
import { VERDICTS } from '../../config/verdicts.js';
import { scoreMix } from '../music/score.js';
import { SONGS } from '../music/songs/index.js';
import { perform } from '../audio/performance.js';
import { now, playCrowd } from '../audio/engine.js';
import { createStage } from '../stage/stage.js';
import { wins, hintFor } from '../tour/hints.js';
import { createPicker } from './picker.js';
import { createResultCard } from './resultCard.js';
import { record, starsForTry, MAX_STARS } from './progress.js';

// How the second pass of the song changes for a verdict: the riot speeds up, the lullaby winds down.
const ENCORE = { legend: { tempo: 1.18 }, dance: { tempo: 1.06 }, sleep: { tempo: 0.78, fade: true } };

export function createGame({ gig, onExit }) {
  const song = SONGS[gig.song];
  const beat = 60 / song.bpm;
  let picks = [];
  let playing = null;
  let busy = false;
  let tries = 0;
  let cleared = false;

  let hushCrowd = () => {};
  const stopPlaying = () => { playing?.stop(); playing = null; hushCrowd(); };
  const leave = () => { stopPlaying(); onExit(); };
  const stage = createStage({ gig, onRemove: (id) => toggle(id) });
  const picker = createPicker({ gig, onToggle: toggle, onMash: mash });
  const result = createResultCard({ gig, onAgain: reset, onExit: leave });
  const atStake = el('span', { class: 'at-stake', title: 'Stars you win if you clear the gig now' });
  const node = el('main', { class: 'game' },
    el('header', {}, el('button', { class: 'back', type: 'button', 'aria-label': 'Back to the tour', onclick: leave }, '‹'), el('h1', {}, gig.name), atStake),
    el('p', { class: 'ask' }, `${gig.hat} “${gig.ask}”`, el('small', {}, `♪ ${song.title}`)),
    stage.node,
    el('div', { class: 'panel' }, picker.node, result.node),
  );

  const after = (audioTime, fn) => setTimeout(fn, Math.max(0, (audioTime - now()) * 1000));

  function refresh() {
    stage.setBand(picks);
    picker.update(picks);
    const stars = starsForTry(tries + 1);
    atStake.textContent = '★'.repeat(stars) + '☆'.repeat(MAX_STARS - stars);
  }

  function toggle(id) {
    if (busy) return;
    stopPlaying();
    if (picks.includes(id)) picks = picks.filter((p) => p !== id);
    else if (picks.length < SLOTS) {
      picks = [...picks, id];
      // A two-bar solo so the player hears what they just added.
      playing = perform([id], song, { bars: 2, onHit: stage.hit });
    }
    refresh();
  }

  function mash() {
    if (busy || picks.length < SLOTS) return;
    busy = true;
    tries += 1;
    stopPlaying();
    const { verdict } = scoreMix(picks, song);
    const won = wins(gig, verdict);
    cleared = won;
    const hint = won ? null : hintFor(gig, picks, tries);
    const encore = ENCORE[verdict] ?? { tempo: 1 };
    node.classList.add('performing');
    stage.blame(null);
    stage.say([]);
    stage.setMood('listen', beat);
    playing = perform(picks, song, { loops: [1, encore.tempo], fadeLast: encore.fade, button: !encore.fade, onHit: stage.hit });
    const run = playing;

    // The crowd makes up its mind after the first pass; the second pass plays under the verdict.
    after(run.loopStarts[1], () => {
      if (playing !== run) return;
      const stars = starsForTry(tries);
      stage.setMood(verdict, beat / encore.tempo, won);
      hushCrowd = playCrowd(verdict);
      stage.say([VERDICTS[verdict].say, won ? 'Just what we wanted!' : hint.text]);
      if (won) record(gig.id, stars);
      else stage.blame(hint.blame);
      result.show({ won, verdict, stars, hint });
      node.classList.add('showing-result');
    });
    after(run.end, () => { if (playing === run && verdict !== 'legend') stage.setMood(verdict === 'sleep' ? 'sleep' : 'idle', beat); });
  }

  // After a miss the band and the hint stay up so the player can change one thing; after a win the gig starts fresh.
  function reset() {
    stopPlaying();
    busy = false;
    node.classList.remove('performing', 'showing-result');
    result.hide();
    stage.setMood('idle', beat);
    if (cleared) { picks = []; tries = 0; cleared = false; stage.say([]); }
    refresh();
  }

  refresh();
  return { node };
}
