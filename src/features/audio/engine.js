// Web Audio engine: loads the samples once and plays single notes on the audio clock.
import { INSTRUMENTS, SAMPLE_FILES } from '../../config/instruments.js';

let ctx;
let dry;
let wet;
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

async function loadSample(name) {
  const res = await fetch(`./samples/${name}.mp3`);
  if (!res.ok) throw new Error(`sample ${name} failed to load (${res.status})`);
  buffers[name] = await ctx.decodeAudioData(await res.arrayBuffer());
}

// Must be called from a tap: browsers block audio until the player interacts.
export async function initAudio() {
  if (ctx) return ctx;
  ctx = new AudioContext();
  const limiter = new DynamicsCompressorNode(ctx, { threshold: -12, ratio: 6, attack: 0.003, release: 0.2 });
  // Rumble below what small speakers can play only eats headroom, and low notes in the reverb turn to mud.
  const rumbleCut = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 38 });
  // The compressor adds its own make-up gain, so trim after it to keep peaks under the ceiling.
  rumbleCut.connect(limiter).connect(new GainNode(ctx, { gain: 0.74 })).connect(ctx.destination);
  dry = new GainNode(ctx, { gain: 0.8 });
  wet = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 260 });
  const room = new ConvolverNode(ctx, { buffer: roomImpulse() });
  const wetLevel = new GainNode(ctx, { gain: 0.5 });
  dry.connect(rumbleCut);
  wet.connect(room).connect(wetLevel).connect(rumbleCut);
  await Promise.all(SAMPLE_FILES.map(loadSample));
  await ctx.resume();
  return ctx;
}

export const now = () => ctx.currentTime;

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
  if (!inst.pitched) return { buffer: buffers[note.p], rate: 1, level: inst.levels[note.p] ?? 1 };
  const base = Object.keys(inst.pitched).map(Number).reduce((a, b) => (Math.abs(b - note.p) < Math.abs(a - note.p) ? b : a));
  return { buffer: buffers[inst.pitched[base]], rate: 2 ** ((note.p - base) / 12), level: 1 };
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
