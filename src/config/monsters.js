// The eight band members: which part each plays and which art pieces build its body.
// Art: Kenney Monster Builder Pack (CC0). `hue` shifts a base colour to get eight distinct monsters from six.
export const LEG_HEIGHT = { A: 334, B: 298, C: 248, D: 244, E: 218 };

export const MONSTERS = [
  { id: 'drums', name: 'Thud', plays: 'Drums', colour: 'red', body: 'B', arm: 'D', leg: 'C', eyes: ['eye_human', 'eye_human'], mouth: 'mouthA', detail: 'horn_large' },
  { id: 'bass', name: 'Bonk', plays: 'Marimba bass', colour: 'dark', body: 'F', arm: 'A', leg: 'D', eyes: ['eye_cute_light'], mouth: 'mouth_closed_fangs', detail: 'antenna_large' },
  { id: 'organ', name: 'Pipes', plays: 'Organ', colour: 'white', body: 'E', arm: 'B', leg: 'B', eyes: ['eye_human_blue', 'eye_human_blue'], mouth: 'mouthC', detail: 'ear' },
  { id: 'tune', name: 'Rattle', plays: 'Bone xylophone', colour: 'yellow', body: 'D', arm: 'C', leg: 'A', eyes: ['eye_psycho_light', 'eye_psycho_light'], mouth: 'mouthH', detail: 'ear_round' },
  { id: 'shaker', name: 'Shimmy', plays: 'Shaker', colour: 'green', body: 'C', arm: 'E', leg: 'E', eyes: ['eye_human'], mouth: 'mouth_closed_happy', detail: 'antenna_small' },
  { id: 'glock', name: 'Twinkle', plays: 'Bells', colour: 'blue', body: 'A', arm: 'A', leg: 'B', eyes: ['eye_cute_light', 'eye_cute_light'], mouth: 'mouthD', detail: 'ear_round' },
  { id: 'boogie', name: 'Stomp', plays: 'Boogie piano', colour: 'red', hue: -70, body: 'E', arm: 'C', leg: 'C', eyes: ['eye_human'], mouth: 'mouthF', detail: 'horn_small' },
  { id: 'harpsi', name: 'Fizz', plays: 'Harpsichord', colour: 'yellow', hue: -25, body: 'A', arm: 'E', leg: 'D', eyes: ['eye_human_green', 'eye_human_green'], mouth: 'mouthJ', detail: 'horn_large' },
];

export const monsterById = Object.fromEntries(MONSTERS.map((m) => [m.id, m]));

// File names of every art piece a monster uses (also drives scripts/copy-art.mjs).
export const artFiles = (m) => ({
  body: `body_${m.colour}${m.body}.png`,
  arm: `arm_${m.colour}${m.arm}.png`,
  leg: `leg_${m.colour}${m.leg}.png`,
  detail: `detail_${m.colour}_${m.detail}.png`,
  mouth: `${m.mouth}.png`,
  eyes: m.eyes.map((e) => `${e}.png`),
});
