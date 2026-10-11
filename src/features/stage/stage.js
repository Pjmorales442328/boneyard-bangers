// The graveyard stage: scenery tinted for the gig's venue, four band slots and the crowd.
import { el } from '../../lib/dom.js';
import { SLOTS } from '../../config/song.js';
import { monsterById } from '../../config/monsters.js';
import { createMonsterView } from './monsterView.js';
import { createCrowd } from './crowd.js';

export function createStage({ gig, onRemove }) {
  const slots = Array.from({ length: SLOTS }, () => el('div', { class: 'slot' }));
  const band = el('div', { class: 'band' }, slots);
  const crowd = createCrowd(gig);
  const stones = [12, 34, 63, 86].map((x, i) => el('div', { class: 'stone', style: `left:${x}%; --tilt:${[-14, 9, -8, 16][i]}deg; --h:${[1, 0.8, 1.1, 0.9][i]}` }));
  const stars = Array.from({ length: 24 }, (_, i) => el('i', { class: 'star-dot', style: `left:${(i * 37) % 100}%; top:${(i * 53) % 55}%; --d:${(i % 5) * 0.7}s` }));
  const scenery = el('div', { class: 'scenery', style: `filter:hue-rotate(${gig.hue}deg)` }, el('div', { class: 'sky' }, stars, el('div', { class: 'moon' })), el('div', { class: 'hill' }), stones);
  // Spotlights and fireworks, shown only while the stage has the `perfect` class.
  const fireworks = Array.from({ length: 8 }, (_, i) => el('b', { class: 'firework', style: `--x:${8 + ((i * 31) % 84)}%; --y:${6 + ((i * 17) % 34)}%; --hue:${i * 47}; --d:${(i * 0.37).toFixed(2)}s` }));
  const showstopper = el('div', { class: 'showstopper' }, el('i', { class: 'beam' }), el('i', { class: 'beam' }), el('i', { class: 'beam' }), fireworks);
  const node = el('div', { class: 'stage', 'data-mood': 'idle' }, scenery, showstopper, band, crowd.node, crowd.bubbles);
  const views = {};

  // Monster size follows the stage so four always fit side by side without poking out of the top.
  new ResizeObserver(([{ contentRect: r }]) => node.style.setProperty('--s', Math.min(r.width / SLOTS / 460, r.height / 1150).toFixed(4))).observe(node);

  function setBand(ids) {
    Object.keys(views).forEach((id) => delete views[id]);
    slots.forEach((slot, i) => {
      slot.replaceChildren();
      const id = ids[i];
      if (!id) return slot.append(el('div', { class: 'empty-spot' }, '?'));
      views[id] = createMonsterView(monsterById[id]);
      views[id].node.addEventListener('click', () => onRemove(id));
      slot.append(views[id].node);
    });
  }

  function setMood(mood, beatSeconds, won = false, perfect = false) {
    node.dataset.mood = mood;
    node.classList.toggle('won', won);
    node.classList.toggle('perfect', perfect);
    node.style.setProperty('--beat', `${beatSeconds}s`);
    crowd.setMood(mood, won);
  }

  return { node, setBand, setMood, say: crowd.say, hit: (id, note) => views[id]?.hit(note.v) };
}
