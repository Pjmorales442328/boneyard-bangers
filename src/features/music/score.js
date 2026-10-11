// Turns a mix's measurements into a 0-100 banger score and one crowd verdict.
// Each song is calibrated against its own 70 mixes, so a new tune needs no hand-tuned numbers.
import { combos } from '../../lib/combos.js';
import { SLOTS } from '../../config/song.js';
import { measure } from './features.js';

const GROOVE_PEAK = 6; // medium syncopation moves people most (Witek et al. 2014)
const GROOVE_WIDTH = 4;
const WEIGHTS = { groove: 0.3, tight: 0.2, smooth: 0.25, full: 0.25 };
const PENALTY = 30;
const CLEAR_PROBLEM = 0.5; // a problem this severe decides the crowd's reaction
const GOOD_MARGIN = 12; // a mix this close to the song's best still gets the crowd dancing

const clamp = (x) => Math.max(0, Math.min(1, x));

function judge(m, max) {
  const groove = Math.exp(-(((m.syncopation - GROOVE_PEAK) / GROOVE_WIDTH) ** 2));
  const tight = clamp(m.coverage - m.clutter / max.clutter / 2);
  const smooth = 1 - clamp(m.rough / max.rough);
  const full = [m.hasPulse, m.hasLow, m.hasMid, m.hasLead].filter(Boolean).length / 4;
  // How badly each thing went wrong, 0..1. The worst one picks the crowd's reaction.
  const problems = {
    offbeat: m.hasPulse ? 0 : 1,
    quake: clamp(m.mud / max.mud),
    ouch: clamp(m.rough / max.rough / 0.6),
    dizzy: clamp(m.clutter / max.clutter),
    sleep: clamp(1 - m.melody / 4),
  };
  const [worst, severity] = Object.entries(problems).sort((a, b) => b[1] - a[1])[0];
  // A clear problem drags the score down, so a flawed mix can never pass as a banger.
  const base = 100 * (WEIGHTS.groove * groove + WEIGHTS.tight * tight + WEIGHTS.smooth * smooth + WEIGHTS.full * full);
  return { score: Math.round(base - PENALTY * severity), worst, severity, parts: { groove, tight, smooth, full }, problems };
}

const calibrations = new Map();
// The largest roughness, mud and clutter in the song scale each measure to 0..1; its best clean mix sets the bar for "legend".
function calibrate(song) {
  if (!calibrations.has(song.id)) {
    const all = combos(Object.keys(song.parts), SLOTS).map((ids) => measure(ids, song.parts));
    const top = (key) => Math.max(...all.map((m) => m[key])) || 1;
    const max = { rough: top('rough'), mud: top('mud'), clutter: top('clutter') };
    const clean = all.map((m) => judge(m, max)).filter((j) => j.severity < CLEAR_PROBLEM);
    calibrations.set(song.id, { max, legend: Math.max(...clean.map((j) => j.score)) });
  }
  return calibrations.get(song.id);
}

export function scoreMix(ids, song) {
  const { max, legend } = calibrate(song);
  const { score, worst, severity, parts, problems } = judge(measure(ids, song.parts), max);

  let verdict = 'meh';
  if (severity >= CLEAR_PROBLEM) verdict = worst;
  else if (score >= legend) verdict = 'legend';
  else if (score >= legend - GOOD_MARGIN) verdict = 'dance';

  return { score, verdict, stars: Math.max(1, Math.min(5, Math.ceil((score - 20) / 16))), parts, problems };
}
