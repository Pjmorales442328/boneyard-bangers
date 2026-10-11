// How each part turns notes into sound. Samples: Versilian Community Sample Library (CC0).
// `pitched` maps a sample's real MIDI pitch (measured, one octave above VCSL's file name) to its file.
// `hold` cuts the sample when the note ends; without it the sample rings out like a struck instrument.
export const INSTRUMENTS = {
  drums: { gain: 0.9, reverb: 0.12, levels: { kick: 1, snare: 0.6, hat: 0.3 } },
  shaker: { gain: 1.55, reverb: 0.1, levels: { shake: 0.6, tamb: 0.45 } },
  bass: { gain: 0.7, reverb: 0.05, pitched: { 41: 'marimba_F1', 48: 'marimba_C2', 55: 'marimba_G2' } },
  boogie: { gain: 0.42, reverb: 0.08, hold: true, pitched: { 41: 'piano_F1', 45: 'piano_A1', 49: 'piano_Cs2' } },
  organ: { gain: 0.21, reverb: 0.3, hold: true, pitched: { 60: 'organ_C3', 63: 'organ_Ds3', 66: 'organ_Fs3', 69: 'organ_A3' } },
  harpsi: { gain: 0.38, reverb: 0.2, hold: true, pitched: { 62: 'harpsi_D3', 66: 'harpsi_Fs3', 70: 'harpsi_As3', 74: 'harpsi_D4', 78: 'harpsi_Fs4' } },
  tune: { gain: 0.85, reverb: 0.25, pitched: { 72: 'xylo_C4', 79: 'xylo_G4', 84: 'xylo_C5' } },
  glock: { gain: 0.62, reverb: 0.4, pitched: { 91: 'glock_G5', 96: 'glock_C6' } },
};

// Crowd reaction sounds, one per verdict (public/sfx). Levels sit under the band so the music stays in front.
export const SFX_LEVELS = { legend: 0.7, dance: 0.6, meh: 0.8, offbeat: 0.7, quake: 0.8, ouch: 0.55, dizzy: 0.7, sleep: 0.7 };

export const SAMPLE_FILES = [
  'kick', 'snare', 'hat', 'shake', 'tamb', 'clap',
  ...Object.values(INSTRUMENTS).flatMap((i) => Object.values(i.pitched ?? {})),
];
