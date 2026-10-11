// Web Audio engine: loads the samples once and plays single notes on the audio clock.
import { INSTRUMENTS, SAMPLE_FILES, SFX_LEVELS } from '../../config/instruments.js';

let ctx;
let dry;
let wet;
let master;
let muted = false;
const MASTER_LEVEL = 0.74;
const buffers = {};

// A short burst of fading noise makes a believable room; no reverb file needed.
function roomImpulse(seconds = 1.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  return buf;
}

async function loadSample(name, folder = 'samples') {
  const res = await fetch(`./${folder}/${name}.mp3`);
  if (!res.ok) throw new Error(`sample ${name} failed to load (${res.status})`);
  buffers[`${folder}/${name}`] = await ctx.decodeAudioData(await res.arrayBuffer());
}

// Loads everything up front. Browsers keep audio paused until the player touches the page, so the first touch anywhere starts it.
export async function initAudio() {
  if (ctx) return ctx;
  ctx = new AudioContext();
  addEventListener('pointerdown', () => { if (ctx.state !== 'running') ctx.resume(); }, true);
  const limiter = new DynamicsCompressorNode(ctx, { threshold: -12, ratio: 6, attack: 0.003, release: 0.2 });
  // Rumble below what small speakers can play only eats headroom, and low notes in the reverb turn to mud.
  const rumbleCut = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 38 });
  // The compressor adds its own make-up gain, so trim after it to keep peaks under the ceiling.
  master = new GainNode(ctx, { gain: muted ? 0 : MASTER_LEVEL });
  rumbleCut.connect(limiter).connect(master).connect(ctx.destination);
  dry = new GainNode(ctx, { gain: 0.8 });
  wet = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 260 });
  const room = new ConvolverNode(ctx, { buffer: roomImpulse() });
  const wetLevel = new GainNode(ctx, { gain: 0.5 });
  dry.connect(rumbleCut);
  wet.connect(room).connect(wetLevel).connect(rumbleCut);
  await Promise.all([...SAMPLE_FILES.map((name) => loadSample(name)), ...Object.keys(SFX_LEVELS).map((name) => loadSample(name, 'sfx'))]);
  return ctx;
}

export const now = () => ctx.currentTime;
// Works before the audio has loaded too: the choice is applied when it does.
export function setMuted(value) {
  muted = value;
  if (master) master.gain.value = muted ? 0 : MASTER_LEVEL;
}
export const isSounding = () => ctx?.state === 'running';

// A bus is one performance's volume knob, so a whole mix can be faded or cut at once.
export function createBus() {
  const dryBus = new GainNode(ctx);
  const wetBus = new GainNode(ctx);
  dryBus.connect(dry);
  wetBus.connect(wet);
  const ramp = (to, at, seconds) => [dryBus, wetBus].forEach((g) => {
    g.gain.cancelScheduledValues(at);
    g.gain.setValueAtTime(g.gain.value, at);
    g.gain.linearRampToValueAtTime(to, at + seconds);
  });
  return { dryBus, wetBus, fade: ramp, stop: () => ramp(0, ctx.currentTime, 0.08) };
}

function pickSample(inst, note) {
  if (!inst.pitched) return { buffer: buffers[`samples/${note.p}`], rate: 1, level: inst.levels[note.p] ?? 1 };
  const base = Object.keys(inst.pitched).map(Number).reduce((a, b) => (Math.abs(b - note.p) < Math.abs(a - note.p) ? b : a));
  return { buffer: buffers[`samples/${inst.pitched[base]}`], rate: 2 ** ((note.p - base) / 12), level: 1 };
}

// Plays the crowd's reaction sound for a verdict. Returns a stop function so leaving the gig cuts it off.
export function playCrowd(verdict) {
  const src = new AudioBufferSourceNode(ctx, { buffer: buffers[`sfx/${verdict}`] });
  const amp = new GainNode(ctx, { gain: SFX_LEVELS[verdict] });
  src.connect(amp).connect(dry);
  src.start();
  return () => amp.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
}

// Plays one note of a part at audio time `when`; `seconds` is the note's written length.
export function playNote(bus, partId, note, when, seconds) {
  const inst = INSTRUMENTS[partId];
  const { buffer, rate, level } = pickSample(inst, note);
  const src = new AudioBufferSourceNode(ctx, { buffer, playbackRate: rate });
  const humanV = note.v * (0.9 + Math.random() * 0.2); // no two hits exactly alike
  const amp = new GainNode(ctx, { gain: inst.gain * level * humanV });
  const send = new GainNode(ctx, { gain: inst.reverb });
  src.connect(amp);
  amp.connect(bus.dryBus);
  amp.connect(send).connect(bus.wetBus);
  src.start(when);
  if (inst.hold) {
    amp.gain.setValueAtTime(amp.gain.value, when + seconds);
    amp.gain.linearRampToValueAtTime(0, when + seconds + 0.09);
    src.stop(when + seconds + 0.1);
  }
}
