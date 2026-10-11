// The tour map: a trail winding down the graveyard from one gig's tombstone to the next, each with its best stars.
import { el } from '../../lib/dom.js';
import { GIGS } from '../../config/gigs.js';
import { SONGS } from '../music/songs/index.js';
import { bestStars, totalStars, starRow, isOpen } from '../game/progress.js';
import { MAX_STARS } from './solutions.js';

// Height of one stop in px and where its tombstone sits across the map in %; both match tour.css.
const ROW = 112;
const stoneX = (i) => (i % 2 ? 80 : 20);
const stoneY = (i) => (i + 0.5) * ROW;

export function createTour({ onPlay, onMenu }) {
  const next = GIGS.findIndex((gig, i) => isOpen(i) && !bestStars(gig.id));
  const stops = GIGS.map((gig, i) => {
    const open = isOpen(i);
    const state = !open ? 'locked' : i === next ? 'next' : 'open';
    return el('button', { class: `stop ${state}`, type: 'button', style: `--hue:${gig.hue}deg`, ...(open ? {} : { disabled: '' }), onclick: () => onPlay(gig) },
      el('span', { class: 'stop-spot' }, el('span', { class: 'stop-pin' }, el('span', { class: 'stop-stone' }, String(i + 1)), el('i', {}, open ? gig.hat : '🔒'))),
      el('span', { class: 'stop-text' },
        el('strong', {}, gig.name),
        el('small', {}, open ? `♪ ${SONGS[gig.song].title}` : 'Clear the gig before this one'),
        open ? el('span', { class: 'gig-stars' }, starRow(bestStars(gig.id))) : null,
        state === 'next' ? el('em', {}, 'PLAY ▸') : null,
      ),
    );
  });
  const bend = (i) => `C ${stoneX(i - 1)} ${(stoneY(i - 1) + stoneY(i)) / 2} ${stoneX(i)} ${(stoneY(i - 1) + stoneY(i)) / 2} ${stoneX(i)} ${stoneY(i)}`;
  const path = GIGS.map((_, i) => (i ? bend(i) : `M ${stoneX(0)} ${stoneY(0)}`)).join(' ');
  const trail = el('div', { class: 'trail', html: `<svg viewBox="0 0 100 ${GIGS.length * ROW}" preserveAspectRatio="none"><path d="${path}"/></svg>` });
  const node = el('main', { class: 'tour' },
    el('header', {}, el('button', { class: 'back', type: 'button', 'aria-label': 'Back to the menu', onclick: onMenu }, '‹'), el('h1', {}, 'The Tour'), el('span', { class: 'tour-total' }, `★ ${totalStars()}/${GIGS.length * MAX_STARS}`)),
    el('div', { class: 'map' }, el('div', { class: 'map-trail', style: `height:${GIGS.length * ROW}px` }, trail, stops)),
  );
  // Open the map at the gig the player is up to.
  requestAnimationFrame(() => stops[Math.max(next, 0)].scrollIntoView({ block: 'center' }));
  return { node };
}
