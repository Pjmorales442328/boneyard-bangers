// The end of the cutscene: a title over the stage with the stars or what the crowd heard, and what to do next.
import { el } from '../../lib/dom.js';
import { VERDICTS } from '../../config/verdicts.js';
import { MAX_STARS, starsForTry } from './progress.js';

export function createFinale({ gig, onAgain, onExit }) {
  const node = el('div', { class: 'finale', hidden: '' });
  const wanted = VERDICTS[gig.wants[0]].title;
  const button = (text, onclick, quiet) => el('button', { class: quiet ? 'again quiet' : 'again', type: 'button', onclick }, text);

  function show({ won, verdict, tries }) {
    const v = VERDICTS[verdict];
    const stars = starsForTry(tries);
    node.replaceChildren(...[
      el('h2', {}, won ? 'Gig cleared!' : `${v.icon} ${v.title}`),
      won ? el('p', { class: 'earned' }, Array.from({ length: MAX_STARS }, (_, i) => el('span', { class: i < stars ? 'on' : '', style: `--i:${i}` }, '★'))) : null,
      // Stars count tries, not how good the music was, so say so next to them.
      el('p', { class: 'finale-note' }, !won ? `They wanted: ${wanted}` : tries === 1 ? 'First try!' : `Cleared on try ${tries}. A first-try clear earns ${MAX_STARS} stars.`),
      el('div', { class: 'finale-foot' },
        won && stars < MAX_STARS ? button('Replay', onAgain, true) : null,
        won ? button('Back to the tour', onExit) : button('Try again', onAgain),
      ),
    ].filter(Boolean));
    node.hidden = false;
  }

  return { node, show, hide: () => { node.hidden = true; } };
}
