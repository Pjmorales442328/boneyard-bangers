// The tour map: every gig with its stars, locked until the gig before it is cleared.
import { el } from '../../lib/dom.js';
import { GIGS } from '../../config/gigs.js';
import { VERDICTS } from '../../config/verdicts.js';
import { MAX_STARS, starsFor, totalStars, isOpen } from '../game/progress.js';

const starRow = (n) => '★'.repeat(n) + '☆'.repeat(MAX_STARS - n);

export function createTour({ onPlay }) {
  const rows = GIGS.map((gig, i) => {
    const open = isOpen(i);
    return el('button', { class: 'gig', type: 'button', ...(open ? {} : { disabled: '' }), onclick: () => onPlay(gig) },
      el('span', { class: 'gig-hat' }, open ? gig.hat : '🔒'),
      el('span', { class: 'gig-text' }, el('strong', {}, `${i + 1}. ${gig.name}`), el('small', {}, open ? `Wants: ${VERDICTS[gig.wants[0]].title}` : 'Clear the gig before this one')),
      el('span', { class: 'gig-stars' }, starRow(starsFor(gig.id))),
    );
  });
  const node = el('main', { class: 'tour' },
    el('header', {}, el('h1', {}, 'Boneyard Bangers'), el('span', { class: 'tour-total' }, `★ ${totalStars()}/${GIGS.length * MAX_STARS}`)),
    el('p', { class: 'tour-lead' }, 'Every crowd wants a different sound. Pick the band that gives it to them.'),
    el('div', { class: 'gigs' }, rows),
  );
  return { node };
}
