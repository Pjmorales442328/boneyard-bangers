// The tutorial's talking monster: it names the next band member to tap, one step at a time, until the best band is on stage.
import { el } from '../../lib/dom.js';
import { SLOTS } from '../../config/song.js';
import { monsterById } from '../../config/monsters.js';
import { createMonsterView } from '../stage/monsterView.js';
import { solutions } from '../tour/solutions.js';

const STEPS = [
  (who) => `Let's build a band! Tap ${who}.`,
  (who) => `Hear that? Every monster plays one part. Now add ${who}.`,
  (who) => `Each new part changes the sound. Add ${who}.`,
  (who) => `One more! Bring in ${who}.`,
];
const LINES = {
  ready: 'Four makes a band! Hit MASH and watch the ghosts.',
  playing: 'Shh... the crowd is listening.',
  won: 'PERFECT! On tour every crowd wants a different sound, and nobody tells you who to pick.',
  lost: 'Not that band! Follow my picks and try again.',
};

export function createCoach(gig) {
  const band = solutions(gig)[0].ids;
  const speaker = monsterById[band[0]];
  const view = createMonsterView(speaker);
  const say = el('p', { class: 'coach-say' });
  const node = el('div', { class: 'coach' }, view.node, say);
  const name = (id) => (id === speaker.id ? 'me' : monsterById[id].name);

  // Returns the id of the card the player should tap next, or null when there is none.
  function update(picks, phase) {
    const wrong = picks.find((id) => !band.includes(id));
    const next = band.find((id) => !picks.includes(id));
    let text = LINES[phase];
    let tap = null;
    if (phase === 'pick') {
      if (wrong) text = `Not ${monsterById[wrong].name} this time. Tap them on the stage to send them home.`;
      else if (picks.length === SLOTS) text = LINES.ready;
      else {
        text = (picks.length ? '' : `Hi, I'm ${speaker.name}! `) + STEPS[picks.length](name(next));
        tap = next;
      }
    }
    if (say.textContent !== text) view.hit(0.6); // a little bounce whenever it says something new
    say.textContent = text;
    return tap;
  }

  return { node, update };
}
