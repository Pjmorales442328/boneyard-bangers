// Turns a mix's measurements into a 0-100 banger score and one crowd verdict.
import { measure } from './features.js';

// Largest values seen across all 70 mixes (npm run rank); used to scale each measure to 0..1.
const MAX = { rough: 1.0, mud: 0.12, clutter: 0.44 };
const GROOVE_PEAK = 6; // medium syncopation moves people most (Witek et al. 2014)
const GROOVE_WIDTH = 4;
const WEIGHTS = { groove: 0.3, tight: 0.2, smooth: 0.25, full: 0.25 };
const PENALTY = 30;
export const GOOD = 78;
export const LEGEND = 90;

const clamp = (x) => Math.max(0, Math.min(1, x));

export function scoreMix(ids) {
  const m = measure(ids);
  const groove = Math.exp(-(((m.syncopation - GROOVE_PEAK) / GROOVE_WIDTH) ** 2));
  const tight = clamp(m.coverage - m.clutter / MAX.clutter / 2);
  const smooth = 1 - clamp(m.rough / MAX.rough);
  const full = [m.hasPulse, m.hasLow, m.hasMid, m.hasLead].filter(Boolean).length / 4;
  // How badly each thing went wrong, 0..1. The worst one picks the crowd's reaction.
  const problems = {
    offbeat: m.hasPulse ? 0 : 1,
    quake: clamp(m.mud / MAX.mud),
    ouch: clamp(m.rough / MAX.rough / 0.6),
    dizzy: clamp(m.clutter / MAX.clutter),
    sleep: clamp(1 - m.melody / 4),
  };
  const [worst, severity] = Object.entries(problems).sort((a, b) => b[1] - a[1])[0];

  // A clear problem drags the score down, so a flawed mix can never pass as a banger.
  const base = 100 * (WEIGHTS.groove * groove + WEIGHTS.tight * tight + WEIGHTS.smooth * smooth + WEIGHTS.full * full);
  const score = Math.round(base - PENALTY * severity);

  let verdict = 'meh';
  if (severity >= 0.5) verdict = worst;
  else if (score >= LEGEND) verdict = 'legend';
  else if (score >= GOOD) verdict = 'dance';

  return { score, verdict, stars: Math.max(1, Math.min(5, Math.ceil((score - 20) / 16))), parts: { groove, tight, smooth, full }, problems };
}
