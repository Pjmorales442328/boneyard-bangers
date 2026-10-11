// The end of the cutscene: a title over the band with the stars the band earned, and the next-step buttons where MASH was.
import { el } from '../../lib/dom.js';
import { VERDICTS } from '../../config/verdicts.js';
import { MAX_STARS } from '../tour/solutions.js';

const WON = ['', 'Gig cleared!', 'Great gig!', 'PERFECT MASH!'];

export function createFinale({ gig, onAgain, onExit, onNext }) {
  const title = el('div', { class: 'finale', hidden: '' });
  const foot = el('div', { class: 'finale-foot' });
  const wanted = VERDICTS[gig.wants[0]].title;
  const button = (text, onclick, quiet) => el('button', { class: quiet ? 'again quiet' : 'again', type: 'button', onclick }, text);

  // While the band plays, the button row says what is going on.
  function wait() {
    title.hidden = true;
    foot.replaceChildren(el('p', { class: 'listening' }, 'The crowd is listening...'));
  }

  // `stars` is 0 for a miss.
  function show({ verdict, stars }) {
    const v = VERDICTS[verdict];
    const perfect = stars === MAX_STARS;
    title.className = perfect ? 'finale perfect' : 'finale';
    title.replaceChildren(...(stars
      ? [
        el('p', { class: 'earned' }, Array.from({ length: MAX_STARS }, (_, i) => el('span', { class: i < stars ? 'on' : '', style: `--i:${i}` }, '★'))),
        el('h2', {}, WON[stars]),
        el('p', { class: 'finale-note' }, perfect ? 'The best band this crowd could get!' : 'They liked it. One band would suit them even better.'),
      ]
      : [el('h2', {}, `${v.icon} ${v.title}`), el('p', { class: 'finale-note' }, `They wanted: ${wanted}`)]));
    title.hidden = false;
    const buttons = !stars ? [button('Try again', onAgain)]
      : [perfect ? button('Tour', onExit, true) : button(`Go for ${'★'.repeat(MAX_STARS)}`, onAgain, true), onNext ? button('Next gig ›', onNext) : button('Back to the tour', onExit)];
    foot.replaceChildren(...buttons);
  }

  return { title, foot, wait, show };
}
