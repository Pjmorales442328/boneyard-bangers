// Sensory roughness between notes sounding together (Plomp-Levelt curve, Sethares' parameters).
const HARMONICS = 6;
const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);

function partials(n) {
  const f0 = freq(n.p);
  return Array.from({ length: HARMONICS }, (_, k) => ({ f: f0 * (k + 1), a: n.v * 0.88 ** k }));
}

function pairRoughness(x, y) {
  const lo = Math.min(x.f, y.f);
  const diff = Math.abs(x.f - y.f);
  const s = 0.24 / (0.021 * lo + 19);
  return Math.min(x.a, y.a) * (Math.exp(-3.5 * s * diff) - Math.exp(-5.75 * s * diff));
}

// Returns { all, low }: total roughness, and the share where the lower partial is under 200 Hz (mud).
// Only notes from different parts are compared: a part's own chord is intended, a clash between monsters is not.
export function roughness(notes) {
  let all = 0;
  let low = 0;
  const sets = notes.map(partials);
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      if (notes[i].part === notes[j].part) continue;
      for (const x of sets[i]) for (const y of sets[j]) {
        const r = pairRoughness(x, y);
        all += r;
        if (Math.min(x.f, y.f) < 200) low += r;
      }
    }
  }
  return { all, low };
}
