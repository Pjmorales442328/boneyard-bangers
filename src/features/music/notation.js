// Shorthand for writing parts as note data. A note is { s: step, p: MIDI pitch or drum sample name, d: length in steps, v: loudness 0..1 }.
import { STEPS, STEPS_PER_BAR } from '../../config/song.js';

export const B = STEPS_PER_BAR;
export const note = (s, p, d = 2, v = 0.8) => ({ s, p, d, v });
export const isPitched = (n) => typeof n.p === 'number';

const SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pitchClass = (letter, accidental) => SEMITONE[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);

// 'F#5' -> 78 (C4 = 60).
export function midi(name) {
  const m = name.match(/^([A-G])([#b]?)(-?\d)$/);
  if (!m) throw new Error(`bad note name "${name}"`);
  return 12 * (Number(m[3]) + 1) + pitchClass(m[1], m[2]);
}

// A melody written left to right: 'E5/4 B4/2 -/2 C5+E5/8' is pitch/length-in-steps, '-' is a rest, '+' joins a chord.
// It must fill the loop exactly, which catches a miscounted rhythm before anyone hears it.
export function line(text, v = 0.8) {
  let s = 0;
  const notes = text.trim().split(/\s+/).flatMap((token) => {
    const [pitches, length] = token.split('/');
    const at = s;
    s += Number(length);
    return pitches === '-' ? [] : pitches.split('+').map((p) => note(at, midi(p), Number(length), v));
  });
  if (s !== STEPS) throw new Error(`line is ${s} steps long, expected ${STEPS}: ${text.slice(0, 40)}`);
  return notes;
}

// A drum pattern as a string of sixteenths, repeated to fill the loop: 'X' loud, 'x' soft, anything else silent.
export function hits(pattern, sample, v = 0.8) {
  return Array.from({ length: STEPS }, (_, s) => pattern[s % pattern.length]).flatMap((c, s) => (c === 'X' ? [note(s, sample, 1, v)] : c === 'x' ? [note(s, sample, 1, v * 0.6)] : []));
}

const QUALITY = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 10], m7: [0, 3, 10], dim: [0, 3, 6] };

// 'Dm' -> { root: 2, tones: [2, 5, 9] } as pitch classes; the register is chosen by whoever plays it.
export function chord(name) {
  const m = name.match(/^([A-G])([#b]?)(m7|m|7|dim)?$/);
  if (!m) throw new Error(`bad chord "${name}"`);
  const root = pitchClass(m[1], m[2]);
  return { root, tones: QUALITY[m[3] ?? ''].map((iv) => (root + iv + 12) % 12) };
}
