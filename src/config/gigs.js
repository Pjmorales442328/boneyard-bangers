// The tour: each gig is a crowd in costume that wants one style of music from the monsters on offer.
// `wants` lists the verdicts that clear the gig; `roster` is who can play; `tempo` scales the song speed.
// Changing the notes or the scoring can make a gig unsolvable: `npm test` checks every gig.
const ALL = ['drums', 'bass', 'organ', 'tune', 'shaker', 'glock', 'boogie', 'harpsi'];
const FIRST = ['drums', 'bass', 'organ', 'tune', 'shaker'];
const without = (...ids) => ALL.filter((id) => !ids.includes(id));
const GROOVE = ['dance', 'legend'];

// ponytail: costumes are emoji (hat + prop), so they look a little different per device; draw them as SVG if that ever matters.
export const GIGS = [
  { id: 'party', name: 'Graveyard Party', hat: '🎩', prop: '🎈', hue: 0, tempo: 1, wants: GROOVE, roster: FIRST, ask: 'Make us dance! We need a beat, a bass and a tune.' },
  { id: 'nursery', name: 'Ghost Nursery', hat: '🎀', prop: '🍼', hue: 40, tempo: 0.85, wants: ['sleep'], roster: FIRST, ask: 'Shhh... play the babies to sleep. No big tunes!' },
  { id: 'demolition', name: 'Demolition Crew', hat: '⛑️', prop: '🔨', hue: 150, tempo: 0.92, wants: ['quake'], roster: [...FIRST, 'boogie'], newcomer: 'boogie', ask: 'Shake the graves down! Bring everyone who rumbles.' },
  { id: 'seance', name: 'Midnight Séance', hat: '👒', prop: '🕯️', hue: -60, tempo: 0.9, wants: ['offbeat'], roster: without('harpsi'), newcomer: 'glock', ask: 'We are floating... no drums and no shaking, please.' },
  { id: 'haunted', name: 'Haunted House', hat: '🎃', prop: '🕸️', hue: 110, tempo: 1, wants: ['ouch'], roster: ALL, newcomer: 'harpsi', ask: 'Scare the tourists! Pipes and the new kid never agree.' },
  { id: 'rave', name: 'Crypt Rave', hat: '🎧', prop: '💿', hue: -110, tempo: 1.18, wants: ['dizzy'], roster: ALL, ask: 'MORE! Bring the busiest players, all at once!' },
  { id: 'waiting', name: 'Afterlife Waiting Room', hat: '🎓', prop: '📋', hue: 190, tempo: 0.95, wants: ['meh'], roster: ALL, ask: 'Something polite, please. Nothing exciting, nothing wrong.' },
  { id: 'notune', name: 'Rattle Lost His Sticks', hat: '🎩', prop: '🎈', hue: 20, tempo: 1.04, wants: GROOVE, roster: without('tune'), ask: 'No Rattle tonight. Someone else must carry the tune!' },
  { id: 'silent', name: 'Silent Disco', hat: '🎧', prop: '💿', hue: -140, tempo: 1.18, wants: ['dizzy'], roster: without('drums'), ask: 'Thud is banned for noise. Go wild without him!' },
  { id: 'cold', name: 'Thud and Bonk Have a Cold', hat: '🧣', prop: '🤧', hue: 70, tempo: 1, wants: GROOVE, roster: without('drums', 'bass'), ask: 'No drums, no bass. Can the rest still make us dance?' },
  { id: 'naptime', name: 'Nap Time Again', hat: '🎀', prop: '🍼', hue: 40, tempo: 0.8, wants: ['sleep'], roster: without('drums', 'bass'), ask: 'Thud and Bonk scare the babies. A lullaby without them!' },
  { id: 'final', name: 'The Monster Mash', hat: '👑', prop: '🌟', hue: -20, tempo: 1, wants: ['legend'], roster: ALL, ask: 'Every ghost in the land is here. Play the perfect banger!' },
];
