// Builds the eight band parts for a song from its tune, bell line, chords and a feel per player.
// Every monster keeps the same job in every song (Bonk is always the low line, Fizz is always busy), so what a player learns carries over.
import { STEPS } from '../../config/song.js';
import { note, line, hits, chord } from './notation.js';

const HALF = 8; // steps in half a bar; songs give one chord per half bar
const halves = (chords, fn) => chords.flatMap((c, h) => fn(c, h * HALF));

const DRUMS = {
  swing: { hat: 'x...X.x.x...X.x.', snare: '....X.......X...', kick: 'X.........x.....' },
  four: { hat: '..X...X...X...X.', snare: '....X.......X...', kick: 'X...X...X...X...' },
  march: { hat: 'X...x...X...x...', snare: '....X.....xxX.xx', kick: 'X.......X.......' },
  gallop: { hat: 'X.xxX.xxX.xxX.xx', snare: '....X.......X...', kick: 'X.......X.......' },
  two: { hat: 'x.X.x.X.x.X.x.X.', snare: '....X.......X...', kick: 'X.......X.......' },
  soft: { hat: '....x.......x...', snare: '............x...', kick: 'X...............' },
};
const SHAKER = {
  eighths: { shake: 'x.X.x.X.x.X.x.X.', tamb: 'X.....X.....X...' },
  sixteenths: { shake: 'XxxxXxxxXxxxXxxx', tamb: '....X.......X...' },
  soft: { shake: 'X...x...X...x...', tamb: '........x.......' },
};
// Low players sit in the octave from C2 so two of them together turn to mud, on purpose.
const low = (c) => 36 + c.root;
const BASS = {
  oompah: (c, s) => [note(s, low(c), 3, 0.95), note(s + 4, low(c) + 7, 3, 0.75)],
  long: (c, s) => [note(s, low(c), 7, 0.9)],
  walk: (c, s) => [0, 1, 2, 1].map((t, i) => note(s + i * 2, low(c) + ((c.tones[t] - c.root + 12) % 12), 2, i ? 0.7 : 0.95)),
};
const BOOGIE = {
  boogie: (c, s) => [0, 7, 9, 7].map((iv, i) => note(s + i * 2, low(c) + iv, 2, i ? 0.6 : 0.85)),
  octaves: (c, s) => [0, 12, 0, 12].map((iv, i) => note(s + i * 2, low(c) + iv, 2, i % 2 ? 0.6 : 0.85)),
  tremolo: (c, s) => Array.from({ length: HALF }, (_, i) => note(s + i, low(c) + (i % 2 ? 7 : 0), 1, i % 4 ? 0.5 : 0.8)),
};
// Middle players voice the chord inside the octave from C4.
const voicing = (c) => c.tones.map((t) => 60 + t).sort((a, b) => a - b);
const ORGAN = {
  pad: (c, s) => voicing(c).map((p) => note(s, p, 7, 0.55)),
  stabs: (c, s) => voicing(c).flatMap((p) => [note(s + 2, p, 2, 0.55), note(s + 6, p, 2, 0.5)]),
  swing: (c, s) => voicing(c).flatMap((p) => [note(s, p, 3, 0.55), note(s + 6, p, 2, 0.5)]),
};
const HARPSI = {
  run: (c, s) => { const [a, b, d] = voicing(c); return [a, b, d, a + 12, d, b, a, b].map((p, i) => note(s + i, p, 1, i % 4 ? 0.45 : 0.7)); },
  alberti: (c, s) => { const [a, b, d] = voicing(c); return [a, d, b, d].map((p, i) => note(s + i * 2, p + 12, 2, i ? 0.45 : 0.7)); },
};

export function arrange({ id, title, by, bpm, swing = 0.5, chords, tune, bells, feel }) {
  const prog = chords.split(/\s+/).map(chord);
  if (prog.length * HALF !== STEPS) throw new Error(`${id}: needs ${STEPS / HALF} chords, got ${prog.length}`);
  const kit = DRUMS[feel.drums];
  const shake = SHAKER[feel.shaker];
  return {
    id, title, by, bpm, swing,
    parts: {
      drums: [...hits(kit.hat, 'hat', 0.7), ...hits(kit.snare, 'snare', 0.85), ...hits(kit.kick, 'kick', 1)],
      bass: halves(prog, BASS[feel.bass]),
      organ: halves(prog, ORGAN[feel.organ]),
      tune: line(tune, 0.9),
      shaker: [...hits(shake.shake, 'shake', 0.5), ...hits(shake.tamb, 'tamb', 0.65)],
      glock: line(bells, 0.6),
      boogie: halves(prog, BOOGIE[feel.boogie]),
      harpsi: halves(prog, HARPSI[feel.harpsi]),
    },
  };
}
