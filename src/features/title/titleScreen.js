// The title screen and main menu: the game's name, the start button and the menu row up top, with the band playing the menu music below.
import { el } from '../../lib/dom.js';
import { GIGS } from '../../config/gigs.js';
import { createStage } from '../stage/stage.js';
import { totalStars } from '../game/progress.js';
import { MAX_STARS } from '../tour/solutions.js';
import { THEME_BAND, THEME_BEAT } from '../audio/theme.js';
import { isSounding } from '../audio/engine.js';

// `menu` is a list of { icon, label, onclick } for the row under the start button.
export function createTitle({ onStart, menu }) {
  const stage = createStage({ gig: GIGS[0], onRemove: () => {} });
  stage.setBand(THEME_BAND);
  stage.setMood('listen', THEME_BEAT);

  const stars = totalStars();
  const status = el('p', { class: 'title-status' }, stars ? `★ ${stars}/${GIGS.length * MAX_STARS} so far` : 'A monster band on tour');
  const button = el('button', { class: 'mash', type: 'button' }, stars ? 'Continue the tour' : 'Start the tour');
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Tuning up...';
    try {
      await onStart();
    } catch (err) {
      console.error('audio failed to start', err);
      status.textContent = 'The instruments failed to load. Check your connection and reload.';
      button.textContent = 'No sound';
    }
  });
  // Browsers hold sound back until the first touch; say so instead of sitting there silent.
  const sound = el('p', { class: 'title-sound' }, '🔇 Tap anywhere for sound');
  const links = el('div', { class: 'title-links' }, menu.map((m) => el('button', { type: 'button', onclick: m.onclick }, el('i', {}, m.icon), m.label)));
  const top = el('div', { class: 'title-menu' }, el('div', { class: 'logo' }, el('span', {}, 'Graveyard'), el('strong', {}, 'GIGS')), button, status, links);

  // The monsters only move when their own notes sound, so the screen is as busy as the music.
  const onHit = (id, note) => { sound.hidden = isSounding(); stage.hit(id, note); };
  return { node: el('main', { class: 'title' }, stage.node, top, sound), onHit };
}
