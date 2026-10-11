// The title screen: the band on the graveyard stage under the game's name, with one button to start (audio needs a tap first).
import { el } from '../../lib/dom.js';
import { MONSTERS } from '../../config/monsters.js';
import { SLOTS } from '../../config/song.js';
import { GIGS } from '../../config/gigs.js';
import { createStage } from '../stage/stage.js';
import { totalStars } from '../game/progress.js';
import { MAX_STARS } from '../tour/solutions.js';

export function createTitle({ onStart }) {
  const stage = createStage({ gig: GIGS[0], onRemove: () => {} });
  // A different four on the poster every visit.
  stage.setBand(MONSTERS.map((m) => m.id).sort(() => Math.random() - 0.5).slice(0, SLOTS));
  stage.setMood('dance', 0.5);
  stage.node.append(el('div', { class: 'logo' }, el('span', {}, 'Graveyard'), el('strong', {}, 'GIGS'), el('p', {}, 'A monster band on tour')));

  const stars = totalStars();
  const idle = stars ? 'Continue the tour' : 'Start the tour';
  const status = el('p', { class: 'title-status' }, stars ? `★ ${stars}/${GIGS.length * MAX_STARS} so far` : 'Every crowd wants a different sound.');
  const button = el('button', { class: 'mash', type: 'button' }, idle);
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Tuning up...';
    try {
      await onStart();
    } catch (err) {
      console.error('audio failed to start', err);
      status.textContent = 'The instruments failed to load. Check your connection and try again.';
      button.disabled = false;
      button.textContent = 'Try again';
    }
  });

  return { node: el('main', { class: 'title' }, stage.node, status, button) };
}
