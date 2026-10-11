// Measures a mix (a list of part ids from one song's parts) and returns raw numbers. No opinions here; score.js turns them into a verdict.
import { STEPS, STEPS_PER_BAR, BARS } from '../../config/song.js';
import { isPitched } from './notation.js';
import { roughness } from './roughness.js';

// Metric weight of each sixteenth in a 4/4 bar (Longuet-Higgins & Lee): downbeat strongest.
const WEIGHT = [0, -4, -3, -4, -2, -4, -3, -4, -1, -4, -3, -4, -2, -4, -3, -4];
const weightAt = (step) => WEIGHT[((step % STEPS_PER_BAR) + STEPS_PER_BAR) % STEPS_PER_BAR];

const onsetSteps = (notes) => [...new Set(notes.map((n) => n.s))].sort((a, b) => a - b);

// A note is syncopated when it sits on a weak step and a stronger step passes before the part plays again.
function syncopation(notes) {
  const on = onsetSteps(notes);
  let total = 0;
  on.forEach((s, i) => {
    const next = i + 1 < on.length ? on[i + 1] : on[0] + STEPS;
    let strongest = -Infinity;
    for (let k = s + 1; k < next; k++) strongest = Math.max(strongest, weightAt(k));
    if (strongest > weightAt(s)) total += strongest - weightAt(s);
  });
  return total;
}

// Drums are several voices (kick, snare, hat) and each is counted alone; a pitched part is one voice.
const voices = (notes) => (isPitched(notes[0]) ? [notes] : [...new Set(notes.map((n) => n.p))].map((p) => notes.filter((n) => n.p === p)));

export function measure(ids, songParts) {
  const parts = ids.map((id) => songParts[id]);
  const all = parts.flatMap((notes, part) => notes.map((n) => ({ ...n, part })));
  const pitched = all.filter(isPitched);

  const perStep = Array.from({ length: STEPS }, () => 0); // how many parts start a note on each step
  parts.forEach((p) => onsetSteps(p).forEach((s) => { perStep[s] += 1; }));

  const eighths = perStep.filter((_, s) => s % 2 === 0);
  const coverage = eighths.filter((c) => c > 0).length / eighths.length;
  const clutter = perStep.reduce((sum, c, s) => sum + (weightAt(s) <= -3 ? Math.max(0, c - 2) : 0), 0) / STEPS;
  const density = all.length / STEPS; // notes started per step

  let rough = 0;
  let mud = 0;
  for (let s = 0; s < STEPS; s++) {
    const r = roughness(pitched.filter((n) => n.s <= s && s < n.s + n.d));
    rough += r.all;
    mud += r.low;
  }

  return {
    syncopation: parts.flatMap(voices).reduce((sum, v) => sum + syncopation(v), 0) / BARS,
    coverage,
    clutter,
    density,
    rough: rough / STEPS,
    mud: mud / STEPS,
    hasPulse: all.some((n) => !isPitched(n)),
    melody: pitched.filter((n) => n.p >= 72).length / BARS, // high notes per bar
    hasLow: pitched.some((n) => n.p < 52),
    hasMid: pitched.some((n) => n.p >= 52 && n.p < 72),
    hasLead: pitched.filter((n) => n.p >= 72).length / BARS >= 4, // enough high notes to be a tune
  };
}
