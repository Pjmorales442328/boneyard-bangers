// Game flow: pick four monsters, MASH, watch the crowd, read the verdict, try again.
import { el } from '../../lib/dom.js';
import { BPM, SLOTS } from '../../config/song.js';
import { scoreMix } from '../music/score.js';
import { perform } from '../audio/performance.js';
import { now } from '../audio/engine.js';
import { createStage } from '../stage/stage.js';
import { createPicker } from './picker.js';
import { createResultCard } from './resultCard.js';
import { createGallery } from './gallery.js';
import { record, progress } from './progress.js';

// How the second pass of the song changes for a verdict: the riot speeds up, the lullaby winds down.
const ENCORE = { legend: { tempo: 1.18 }, dance: { tempo: 1.06 }, sleep: { tempo: 0.78, fade: true } };
const BEAT = 60 / BPM;

export function createGame() {
  let picks = [];
  let playing = null;
  let busy = false;

  const stage = createStage({ onRemove: (id) => toggle(id) });
  const picker = createPicker({ onToggle: toggle, onMash: mash });
  const result = createResultCard({ onAgain: reset });
  const gallery = createGallery();
  const node = el('main', { class: 'game' },
    el('header', {}, el('h1', {}, 'Boneyard Bangers'), gallery.node),
    stage.node,
    el('div', { class: 'panel' }, picker.node, result.node),
  );

  const stopPlaying = () => { playing?.stop(); playing = null; };
  const after = (audioTime, fn) => setTimeout(fn, Math.max(0, (audioTime - now()) * 1000));

  function refresh() {
    stage.setBand(picks);
    picker.update(picks);
    gallery.update(progress().found);
  }

  function toggle(id) {
    if (busy) return;
    stopPlaying();
    if (picks.includes(id)) picks = picks.filter((p) => p !== id);
    else if (picks.length < SLOTS) {
      picks = [...picks, id];
      // A two-bar solo so the player hears what they just added.
      playing = perform([id], { bars: 2, onHit: stage.hit });
    }
    refresh();
  }

  function mash() {
    if (busy || picks.length < SLOTS) return;
    busy = true;
    stopPlaying();
    const outcome = scoreMix(picks);
    const encore = ENCORE[outcome.verdict] ?? { tempo: 1 };
    node.classList.add('performing');
    stage.setMood('listen', BEAT);
    playing = perform(picks, { loops: [1, encore.tempo], fadeLast: encore.fade, button: !encore.fade, onHit: stage.hit });
    const run = playing;

    // The crowd makes up its mind after the first pass; the second pass plays under the verdict.
    after(run.loopStarts[1], () => {
      if (playing !== run) return;
      stage.setMood(outcome.verdict, BEAT / encore.tempo);
      const news = record(picks, outcome);
      result.show(outcome, news, progress());
      gallery.update(progress().found);
      node.classList.add('showing-result');
    });
    after(run.end, () => { if (playing === run && outcome.verdict !== 'legend') stage.setMood(outcome.verdict === 'sleep' ? 'sleep' : 'idle', BEAT); });
  }

  function reset() {
    stopPlaying();
    busy = false;
    node.classList.remove('performing', 'showing-result');
    result.hide();
    stage.setMood('idle', BEAT);
    refresh();
  }

  refresh();
  return { node };
}
