// Schedules a whole mix on the audio clock and reports each note to the stage as it sounds.
import { STEPS, STEPS_PER_BAR } from '../../config/song.js';
import { isPitched } from '../music/notation.js';
import { createBus, playNote, now } from './engine.js';

// Seconds from loop start to a step, with off-beat eighths pushed late (swing).
function stepOffset(step, beat, swing) {
  const inBeat = [0, swing / 2, swing, (1 + swing) / 2][step % 4];
  return (Math.floor(step / 4) + inBeat) * beat;
}

/**
 * perform(ids, song, opts) -> { end, loopStarts, stop }
 * opts.loops: tempo multiplier per loop, e.g. [1, 1.15]; opts.bars: play only the first N bars of each loop;
 * opts.fadeLast: fade out over the last loop; opts.onHit(partId, note): called when a note sounds;
 * opts.button: finish with one last hit together; opts.level: volume of the whole mix (1 = full).
 */
export function perform(ids, song, { loops = [1], bars = STEPS / STEPS_PER_BAR, fadeLast = false, button = false, level = 1, onHit = () => {} } = {}) {
  const bus = createBus();
  bus.dryBus.gain.value = level;
  bus.wetBus.gain.value = level;
  const steps = bars * STEPS_PER_BAR;
  const events = [];
  const loopStarts = [];
  let t = now() + 0.12;

  loops.forEach((tempo) => {
    const beat = 60 / (song.bpm * tempo);
    loopStarts.push(t);
    for (const id of ids) {
      for (const note of song.parts[id]) {
        if (note.s >= steps) continue;
        const when = t + stepOffset(note.s, beat, song.swing) + (Math.random() - 0.5) * 0.008;
        playNote(bus, id, note, when, (note.d * beat) / 4);
        events.push({ when, id, note });
      }
    }
    t += (steps / 4) * beat;
  });

  if (button) {
    for (const id of ids) {
      const part = song.parts[id];
      const first = part.find(isPitched) ?? part.find((n) => n.p === 'kick') ?? part[0];
      const note = { ...first, d: 6, v: 1 };
      playNote(bus, id, note, t, 0.9);
      events.push({ when: t, id, note });
    }
    t += 1.2;
  }
  if (fadeLast) bus.fade(0, loopStarts.at(-1), t - loopStarts.at(-1));

  events.sort((a, b) => a.when - b.when);
  let next = 0;
  let stopped = false;
  (function tick() {
    if (stopped) return;
    while (next < events.length && events[next].when <= now()) onHit(events[next].id, events[next++].note);
    if (next < events.length) requestAnimationFrame(tick);
  })();

  return { end: t, loopStarts, stop: () => { stopped = true; bus.stop(); } };
}
