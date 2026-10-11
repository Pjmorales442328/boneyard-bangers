// Eleven public-domain tunes, each cut to a four-bar loop. Tunes and bell lines are written out; arrange.js builds the backing.
// A tune written in 2/4 uses half a bar here per original bar, so sixteenths stay sixteenths.
import { arrange } from '../arrange.js';

export const korobeiniki = arrange({
  id: 'korobeiniki', title: 'Korobeiniki', by: 'Russian folk song', bpm: 126,
  chords: 'A A Dm Dm A A Dm Dm',
  tune: 'A5/4 E5/2 F5/2 G5/4 F5/2 E5/2 D5/4 D5/2 F5/2 A5/4 G5/2 F5/2 E5/6 F5/2 G5/4 A5/4 F5/4 D5/4 D5/8',
  bells: '-/12 A6/2 E6/2 -/12 D6/2 F6/2 -/16 -/8 F6/2 A6/2 D7/4',
  feel: { drums: 'two', shaker: 'eighths', bass: 'oompah', organ: 'stabs', boogie: 'octaves', harpsi: 'run' },
});

export const twinkle = arrange({
  id: 'twinkle', title: 'Twinkle, Twinkle, Little Star', by: 'French melody, 1761', bpm: 84, swing: 0.58,
  chords: 'C C F C F C G C',
  tune: 'C5/2 C5/2 C5/4 G5/2 G5/2 G5/4 A5/2 A5/2 A5/4 G5/8 F5/2 F5/2 F5/4 E5/2 E5/2 E5/4 D5/2 D5/2 D5/4 C5/8',
  bells: '-/8 E6/4 G6/4 -/8 C7/4 G6/4 -/8 G6/4 E6/4 -/8 E6/4 C6/4',
  feel: { drums: 'soft', shaker: 'soft', bass: 'long', organ: 'pad', boogie: 'boogie', harpsi: 'alberti' },
});

export const fifth = arrange({
  id: 'fifth', title: 'Symphony No. 5', by: 'Ludwig van Beethoven, 1808', bpm: 108,
  chords: 'Cm Cm G7 G7 Fm Cm Cm Cm',
  tune: '-/2 G5/2 G5/2 G5/2 Eb5/8 -/2 F5/2 F5/2 F5/2 D5/8 -/2 Ab5/2 Ab5/2 Ab5/2 G5/8 -/2 Eb6/2 Eb6/2 Eb6/2 C6/8',
  bells: '-/12 G6/4 -/12 G6/4 -/12 C7/4 -/8 G6/2 Eb6/2 C6/4',
  feel: { drums: 'march', shaker: 'eighths', bass: 'long', organ: 'pad', boogie: 'tremolo', harpsi: 'run' },
});

export const sugarPlum = arrange({
  id: 'sugarPlum', title: 'Dance of the Sugar Plum Fairy', by: 'Pyotr Tchaikovsky, 1892', bpm: 92,
  chords: 'Em B7 A7 Am B7 Em B7 Em',
  tune: 'G5/2 E5/2 G5/2 F#5/2 D#5/4 E5/4 D5/1 D5/1 D5/2 C#5/1 C#5/1 C#5/2 C5/1 C5/1 C5/2 B4/1 E5/1 C5/1 E5/1 B4/4 -/4 G5/2 E5/2 G5/2 F#5/2 D#5/4 E5/4 G5/2 F#5/2 E5/4',
  bells: '-/12 B6/2 E6/2 -/16 -/4 B6/2 G6/2 E6/4 -/4 -/12 B6/2 E7/2',
  feel: { drums: 'soft', shaker: 'soft', bass: 'oompah', organ: 'stabs', boogie: 'octaves', harpsi: 'alberti' },
});

export const toccata = arrange({
  id: 'toccata', title: 'Toccata and Fugue in D minor', by: 'J. S. Bach, about 1704', bpm: 96,
  chords: 'Dm A7 Dm A7 Dm A7 A7 Dm',
  tune: 'A5/1 G5/1 A5/6 G5/1 F5/1 E5/1 D5/1 C#5/2 D5/2 A5/1 G5/1 A5/1 F5/1 A5/1 E5/1 A5/1 D5/1 A5/1 C#5/1 A5/1 D5/1 A5/1 E5/1 A5/1 F5/1 A5/1 G5/1 A5/6 G5/1 F5/1 E5/1 D5/1 C#5/2 D5/2 D5/2 F5/2 A5/2 D6/2 C#6/4 D6/4',
  bells: '-/12 D7/4 -/16 -/12 A6/4 -/8 F6/2 A6/2 D7/4',
  feel: { drums: 'march', shaker: 'eighths', bass: 'long', organ: 'pad', boogie: 'octaves', harpsi: 'run' },
});

export const bumblebee = arrange({
  id: 'bumblebee', title: 'Flight of the Bumblebee', by: 'Nikolai Rimsky-Korsakov, 1900', bpm: 132,
  chords: 'Am Am Am E7 Am Am E7 Am',
  tune: 'A5/1 G#5/1 G5/1 F#5/1 F5/1 A#5/1 A5/1 G#5/1 A5/1 G#5/1 G5/1 F#5/1 F5/1 A#5/1 A5/1 G#5/1 A5/1 A#5/1 B5/1 C6/1 B5/1 A#5/1 A5/1 G#5/1 A5/1 A#5/1 B5/1 C6/1 C#6/1 D6/1 D#6/1 E6/1 E6/1 D#6/1 D6/1 C#6/1 D6/1 C#6/1 C6/1 B5/1 C6/1 B5/1 A#5/1 A5/1 A#5/1 A5/1 G#5/1 G5/1 A5/1 G#5/1 G5/1 F#5/1 F5/1 A#5/1 A5/1 G#5/1 A5/4 -/4',
  bells: '-/12 E6/4 -/12 A6/4 -/12 E7/4 -/8 A6/4 -/4',
  feel: { drums: 'four', shaker: 'sixteenths', bass: 'walk', organ: 'stabs', boogie: 'boogie', harpsi: 'run' },
});

export const canon = arrange({
  id: 'canon', title: 'Canon in D', by: 'Johann Pachelbel, about 1680', bpm: 84,
  chords: 'D A Bm F#m G D G A',
  tune: 'D5/2 F#5/2 A5/2 G5/2 F#5/2 D5/2 F#5/2 E5/2 D5/2 B4/2 D5/2 A5/2 G5/2 B5/2 A5/2 G5/2 F#5/2 D5/2 E5/2 C#6/2 D6/2 F#6/2 A6/2 A5/2 B5/2 G5/2 A5/2 F#5/2 D5/2 D6/2 D6/3 C#6/1',
  bells: 'F#6/8 E6/8 D6/8 C#6/8 B5/8 A5/8 B5/8 C#6/8',
  feel: { drums: 'soft', shaker: 'soft', bass: 'long', organ: 'pad', boogie: 'octaves', harpsi: 'alberti' },
});

export const entertainer = arrange({
  id: 'entertainer', title: 'The Entertainer', by: 'Scott Joplin, 1902', bpm: 88,
  chords: 'C C C C C C D7 G7',
  tune: 'E5/1 C6/2 E5/1 C6/2 E5/1 C6/5 -/1 C6/1 D6/1 D#6/1 E6/1 C6/1 D6/1 E6/2 B5/1 D6/2 C6/6 D5/1 D#5/1 E5/1 C6/2 E5/1 C6/2 E5/1 C6/5 -/2 A5/1 G5/1 F#5/1 A5/1 C6/1 E6/2 D6/1 C6/1 A5/1 D6/6 D5/1 D#5/1',
  bells: '-/12 G6/2 C7/2 -/16 -/12 G6/2 E6/2 -/8 D6/2 G6/2 B6/4',
  feel: { drums: 'two', shaker: 'eighths', bass: 'oompah', organ: 'stabs', boogie: 'boogie', harpsi: 'alberti' },
});

export const williamTell = arrange({
  id: 'williamTell', title: 'William Tell Overture', by: 'Gioachino Rossini, 1829', bpm: 132,
  chords: 'C C C G7 C C C C',
  tune: 'G5/1 G5/1 G5/2 G5/1 G5/1 G5/2 G5/1 G5/1 C6/2 D6/2 E6/2 G5/1 G5/1 G5/2 G5/1 G5/1 C6/2 E6/2 E6/2 D6/2 B5/2 G5/1 G5/1 G5/2 G5/1 G5/1 G5/2 G5/1 G5/1 C6/2 D6/2 E6/2 C6/1 E6/1 G6/4 F6/2 E6/2 D6/2 C6/4',
  bells: '-/12 G6/2 C7/2 -/16 -/12 G6/2 C7/2 -/8 E7/2 D7/2 C7/4',
  feel: { drums: 'gallop', shaker: 'sixteenths', bass: 'oompah', organ: 'stabs', boogie: 'octaves', harpsi: 'run' },
});

export const canCan = arrange({
  id: 'canCan', title: 'Infernal Galop (Can-Can)', by: 'Jacques Offenbach, 1858', bpm: 136,
  chords: 'C G7 C C G7 G7 C G7',
  tune: 'C5/8 D5/2 F5/2 E5/2 D5/2 G5/4 G5/4 G5/2 A5/2 E5/2 F5/2 D5/4 D5/4 D5/2 F5/2 E5/2 D5/2 C5/2 C6/2 B5/2 A5/2 G5/2 F5/2 E5/2 D5/2',
  bells: 'C7/8 -/8 -/4 E7/4 -/8 -/8 -/8 -/8 C7/2 G6/2 E6/2 C6/2',
  feel: { drums: 'two', shaker: 'eighths', bass: 'oompah', organ: 'stabs', boogie: 'boogie', harpsi: 'run' },
});

export const frereJacques = arrange({
  id: 'frereJacques', title: 'Frère Jacques', by: 'French nursery song', bpm: 80, swing: 0.58,
  chords: 'F F F C7 F Bb F F',
  tune: 'F5/4 G5/4 A5/4 F5/4 A5/4 Bb5/4 C6/8 C6/2 D6/2 C6/2 Bb5/2 A5/4 F5/4 F5/4 C5/4 F5/8',
  bells: '-/12 C7/4 -/8 F6/4 A6/4 -/16 -/8 A6/4 C7/4',
  feel: { drums: 'soft', shaker: 'soft', bass: 'long', organ: 'pad', boogie: 'octaves', harpsi: 'alberti' },
});
