// What the crowd says for each verdict. `hint` nudges the player toward a better mix.
export const VERDICTS = {
  legend: { icon: '🏆', title: 'Legendary banger!', line: 'The dead have risen to dance.', hint: 'You found the perfect mix. Can you find every reaction?' },
  dance: { icon: '💃', title: 'Graveyard groove', line: 'The ghosts are moving.', hint: 'So close. One swap could make it legendary.' },
  meh: { icon: '😐', title: 'Polite clapping', line: 'Nothing wrong. Nothing special.', hint: 'Look at the shortest bar below and fix that.' },
  offbeat: { icon: '👏', title: 'Lost the beat', line: 'Nobody is keeping time.', hint: 'Add someone who hits or shakes things.' },
  quake: { icon: '💥', title: 'Grave rumble', line: 'Too much rumbling down low.', hint: 'Two low players are fighting. Keep one.' },
  ouch: { icon: '🙉', title: 'Ear ache', line: 'Those notes are fighting each other.', hint: 'Split up the players who clash.' },
  dizzy: { icon: '💫', title: 'Too much!', line: 'Everyone played at once.', hint: 'Swap a busy player for a calmer one.' },
  sleep: { icon: '😴', title: 'Lullaby', line: 'Nice backing. Where is the tune?', hint: 'Add someone who plays a melody.' },
};
export const VERDICT_IDS = Object.keys(VERDICTS);
