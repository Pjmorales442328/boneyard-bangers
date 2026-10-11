// Rockstars: the hall of fame. Players are ranked by stars; anyone who has cleared every gig gets the guitar.
import { el } from '../../lib/dom.js';
import { GIGS } from '../../config/gigs.js';
import { totalStars, clearedCount } from '../game/progress.js';
import { MAX_STARS } from '../tour/solutions.js';
import { submitStars, topPlayers } from '../../services/leaderboard.js';
import { openSheet } from './sheet.js';

export function openRockstars() {
  const cleared = clearedCount();
  const mine = el('p', { class: 'rock-mine' },
    cleared === GIGS.length ? '🎸 You are a Rockstar! ' : `Clear all ${GIGS.length} gigs to become a Rockstar. `,
    el('strong', {}, `${cleared}/${GIGS.length} gigs · ★ ${totalStars()}/${GIGS.length * MAX_STARS}`));
  const list = el('ol', { class: 'rock-list' }, el('li', { class: 'rock-note' }, 'Loading the hall of fame...'));
  openSheet('Rockstars', mine, list);

  (async () => {
    if (totalStars()) await submitStars(totalStars(), cleared);
    try {
      const players = await topPlayers();
      list.replaceChildren(...(players.length
        ? players.map((p) => el('li', {}, el('span', { class: 'rock-rank' }, `${p.cleared >= GIGS.length ? '🎸' : ''} ${p.rank}`), el('span', { class: 'rock-name' }, p.name), el('span', { class: 'gig-stars' }, `★ ${p.stars}`)))
        : [el('li', { class: 'rock-note' }, 'Nobody is on the board yet. Be the first!')]));
    } catch (err) {
      console.warn('could not load the Rockstars board', err);
      list.replaceChildren(el('li', { class: 'rock-note' }, 'The hall of fame could not be reached. Try again later.'));
    }
  })();
}
