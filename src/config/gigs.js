// The tour: each gig is a crowd in costume that wants one style of music from the monsters on offer.
// `wants` lists the verdicts that clear the gig; `roster` is who can play; `song` is the track (src/features/music/songs).
// Changing the notes or the scoring can make a gig unsolvable: `npm test` checks every gig.
const ALL = ['drums', 'bass', 'organ', 'tune', 'shaker', 'glock', 'boogie', 'harpsi'];
const FIRST = ['drums', 'bass', 'organ', 'tune', 'shaker'];
const without = (...ids) => ALL.filter((id) => !ids.includes(id));
const GROOVE = ['dance', 'legend'];

// The warm-up before the tour: a monster coaches the player to the best band (src/features/game/coach.js). Not part of the tour.
export const TUTORIAL = { id: 'soundcheck', name: 'Soundcheck', hat: '🎩', prop: '🎈', hue: 0, song: 'twinkle', wants: GROOVE, roster: ALL, coach: true, ask: 'Warm up before the tour.' };

// ponytail: costumes are emoji (hat + prop), so they look a little different per device; draw them as SVG if that ever matters.
export const GIGS = [
  { id: 'party', name: 'Graveyard Party', hat: '🎩', prop: '🎈', hue: 0, song: 'korobeiniki', wants: GROOVE, roster: FIRST, ask: 'Make us dance! We need a beat, a bass and a tune.' },
  { id: 'nursery', name: 'Ghost Nursery', hat: '🎀', prop: '🍼', hue: 40, song: 'twinkle', wants: ['sleep'], roster: FIRST, ask: 'Shhh... play the babies to sleep. No big tunes!' },
  { id: 'demolition', name: 'Demolition Crew', hat: '⛑️', prop: '🔨', hue: 150, song: 'fifth', wants: ['quake'], roster: [...FIRST, 'boogie'], newcomer: 'boogie', ask: 'Shake the graves down! Bring everyone who rumbles.' },
  { id: 'seance', name: 'Midnight Séance', hat: '👒', prop: '🕯️', hue: -60, song: 'sugarPlum', wants: ['offbeat'], roster: without('harpsi'), newcomer: 'glock', ask: 'We are floating... no drums and no shaking, please.' },
  { id: 'haunted', name: 'Haunted House', hat: '🎃', prop: '🕸️', hue: 110, song: 'toccata', wants: ['ouch'], roster: ALL, newcomer: 'harpsi', ask: 'Scare the tourists! Pipes can pick a fight with anyone.' },
  { id: 'rave', name: 'Crypt Rave', hat: '🎧', prop: '💿', hue: -110, song: 'bumblebee', wants: ['dizzy'], roster: ALL, ask: 'MORE! Bring the busiest players, all at once!' },
  { id: 'waiting', name: 'Afterlife Waiting Room', hat: '🎓', prop: '📋', hue: 190, song: 'canon', wants: ['meh'], roster: ALL, ask: 'Something polite, please. Nothing exciting, nothing wrong.' },
  { id: 'notune', name: 'Rattle Lost His Sticks', hat: '🎩', prop: '🎈', hue: 20, song: 'entertainer', wants: GROOVE, roster: without('tune'), ask: 'No Rattle tonight. Someone else must carry the tune!' },
  { id: 'silent', name: 'Silent Disco', hat: '🎧', prop: '💿', hue: -140, song: 'williamTell', wants: ['dizzy'], roster: without('drums'), ask: 'Thud is banned for noise. Go wild without him!' },
  { id: 'cold', name: 'Bonk Has a Cold', hat: '🧣', prop: '🤧', hue: 70, song: 'canCan', wants: GROOVE, roster: without('bass'), ask: 'Bonk is in bed. Find another way to make us dance!' },
  { id: 'naptime', name: 'Nap Time Again', hat: '🎀', prop: '🍼', hue: 40, song: 'frereJacques', wants: ['sleep'], roster: without('drums', 'bass'), ask: 'Thud and Bonk scare the babies. A lullaby without them!' },
  { id: 'final', name: 'The Monster Mash', hat: '👑', prop: '🌟', hue: -20, song: 'mountainKing', wants: ['legend'], roster: ALL, ask: 'Every ghost in the land is here. Play the perfect banger!' },
];
