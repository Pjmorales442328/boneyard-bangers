// One gig: the crowd asks for a style, the player picks four monsters, MASH, and the crowd answers.
import { el } from '../../lib/dom.js';
import { SLOTS } from '../../config/song.js';
import { VERDICTS } from '../../config/verdicts.js';
import { scoreMix } from '../music/score.js';
import { SONGS } from '../music/songs/index.js';
import { perform } from '../audio/performance.js';
import { now, playCrowd } from '../audio/engine.js';
import { createStage } from '../stage/stage.js';
import { wins } from '../tour/solutions.js';
import { createPicker } from './picker.js';
import { createFinale } from './finale.js';
import { record, starsForTry, MAX_STARS } from './progress.js';

// How the second pass of the song changes for a verdict: the riot speeds up, the lullaby winds down.
const ENCORE = { legend: { tempo: 1.18 }, dance: { tempo: 1.06 }, sleep: { tempo: 0.78, fade: true } };
// Seconds the crowd acts out what it heard before the title comes up.
const REVEAL_GAP = 1.4;

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
  const finale = createFinale({ gig, onAgain: reset, onExit: leave });
  stage.node.append(finale.node);
  const atStake = el('span', { class: 'at-stake', title: 'Stars you win if you clear the gig now' });
  const node = el('main', { class: 'game' },
    el('header', {}, el('button', { class: 'back', type: 'button', 'aria-label': 'Back to the tour', onclick: leave }, '‹'), el('h1', {}, gig.name), atStake),
    el('p', { class: 'ask' }, `${gig.hat} “${gig.ask}”`, el('small', {}, `♪ ${song.title}`)),
    stage.node,
    el('div', { class: 'panel' }, picker.node),
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
    const encore = (won && ENCORE[verdict]) || { tempo: 1 };
    node.classList.add('performing');
    stage.say([]);
    stage.setMood('listen', beat);
    // A win plays on into an encore under the celebration; a miss stops after one pass so the next try comes quickly.
    playing = perform(picks, song, won ? { loops: [1, encore.tempo], fadeLast: encore.fade, button: !encore.fade, onHit: stage.hit } : { onHit: stage.hit });
    const run = playing;
    const at = (audioTime, fn) => after(audioTime, () => { if (playing === run) fn(); });
    const heard = won ? run.loopStarts[1] : run.end;

    at((run.loopStarts[0] + heard) / 2, () => stage.say(['Hmm...']));
    at(heard, () => {
      stage.setMood(verdict, beat / encore.tempo, won);
      hushCrowd = playCrowd(verdict);
      // After a miss the crowd's wish stays up while the player changes the band.
      stage.say([VERDICTS[verdict].say, won ? 'Just what we wanted!' : VERDICTS[gig.wants[0]].nudge], !won);
      if (won) record(gig.id, starsForTry(tries));
    });
    at(heard + REVEAL_GAP, () => {
      if (!won) stage.setMood('boo', beat);
      finale.show({ won, verdict, tries });
    });
    if (won && !['legend', 'sleep'].includes(verdict)) at(run.end, () => stage.setMood('cheer', beat, true));
  }

  // After a miss the band stays so the player can change one thing; after a win the gig starts fresh.
  function reset() {
    stopPlaying();
    busy = false;
    node.classList.remove('performing');
    finale.hide();
    stage.setMood('idle', beat);
    if (cleared) { picks = []; tries = 0; cleared = false; stage.say([]); }
    refresh();
  }

  refresh();
  return { node };
}
