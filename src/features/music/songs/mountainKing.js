// "In the Hall of the Mountain King" in D minor, with every part written by hand. The other songs are in arranged.js.
import { B, note } from '../notation.js';

// Lay out [stepInBar, pitch, dur?, vel?] rows for one bar.
const bar = (n, rows) => rows.map(([s, p, d, v]) => note(n * B + s, p, d, v));
const everyBar = (rows) => [0, 1, 2, 3].flatMap((n) => bar(n, rows));

// Chords per half-bar: Dm | E7 Eb7 | Dm | F
const CHORDS = [[62, 65, 69], [62, 65, 69], [64, 68, 71], [63, 67, 70], [62, 65, 69], [62, 65, 69], [60, 65, 69], [60, 65, 69]];

const drums = [
  ...everyBar([[0, 'hat', 1, 0.5], [4, 'hat', 1, 0.7], [6, 'hat', 1, 0.4], [8, 'hat', 1, 0.5], [12, 'hat', 1, 0.7], [14, 'hat', 1, 0.4]]),
  ...everyBar([[4, 'snare', 1, 0.8], [12, 'snare', 1, 0.9]]),
  ...everyBar([[0, 'kick', 1, 1], [10, 'kick', 1, 0.8]]),
  ...bar(1, [[6, 'kick', 1, 0.6]]), ...bar(3, [[6, 'kick', 1, 0.6], [14, 'snare', 1, 0.5]]),
];

const walk = [[38, 41, 45, 41], [40, 44, 39, 43], [38, 41, 45, 50], [41, 45, 48, 45]];
const bass = walk.flatMap((ps, n) => bar(n, ps.map((p, i) => [i * 4, p, 3, i % 2 ? 0.75 : 0.95])));

const organ = [
  ...bar(0, [[0, 0, 3], [6, 0, 5]]), ...bar(1, [[0, 2, 3], [8, 3, 3]]),
  ...bar(2, [[0, 4, 3], [6, 4, 5]]), ...bar(3, [[0, 6, 3], [6, 6, 8]]),
].flatMap(({ s, p, d }) => CHORDS[p].map((pitch) => note(s, pitch, d, 0.55)));

const tune = [
  ...bar(0, [[0, 74], [2, 76], [4, 77], [6, 79], [8, 81], [10, 77], [12, 81, 4]]),
  ...bar(1, [[0, 80], [2, 76], [4, 80, 4], [8, 79], [10, 75], [12, 79, 4]]),
  ...bar(2, [[0, 74], [2, 76], [4, 77], [6, 79], [8, 81], [10, 77], [12, 81], [14, 86]]),
  ...bar(3, [[0, 84], [2, 81], [4, 77], [6, 81], [8, 84, 8]]),
].map((n) => ({ ...n, v: 0.9 }));

const shaker = [
  ...everyBar([0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, 'shake', 1, s % 4 ? 0.45 : 0.3])),
  ...everyBar([[0, 'tamb', 1, 0.5], [6, 'tamb', 1, 0.7], [12, 'tamb', 1, 0.6]]), // 3-3-2 tresillo
];

// Glockenspiel answers in the gaps the tune leaves.
const glock = [
  ...bar(0, [[14, 93, 2]]), ...bar(1, [[6, 92, 2], [14, 91, 2]]),
  ...bar(3, [[10, 89, 2], [12, 93, 2], [14, 96, 2]]),
].map((n) => ({ ...n, v: 0.6 }));

// Boogie left hand: root, fifth, sixth, fifth in eighths. A second low part on purpose.
const boogieRoots = [38, 38, 40, 39, 38, 38, 41, 41];
const boogie = boogieRoots.flatMap((r, h) => [0, 7, 9, 7].map((iv, i) => note(h * 8 + i * 2, r + iv, 2, i ? 0.6 : 0.85)));

// Harpsichord runs the chord in sixteenths. Busy on purpose.
const harpsi = CHORDS.flatMap((c, h) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => note(h * 8 + i, [c[0], c[1], c[2], c[0] + 12, c[2], c[1], c[0], c[1]][i], 1, i % 4 ? 0.45 : 0.7)));

export const mountainKing = {
  id: 'mountainKing', title: 'In the Hall of the Mountain King', by: 'Edvard Grieg, 1875', bpm: 104, swing: 0.62,
  parts: { drums, bass, organ, tune, shaker, glock, boogie, harpsi },
};
