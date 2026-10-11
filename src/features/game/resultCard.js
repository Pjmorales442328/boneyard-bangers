// Shows how the gig went: cleared with stars, or what the crowd heard and the hint to try next.
import { el } from '../../lib/dom.js';
import { VERDICTS } from '../../config/verdicts.js';
import { MAX_STARS } from './progress.js';

export function createResultCard({ gig, onAgain, onExit }) {
  const node = el('div', { class: 'result', hidden: '' });
  const wanted = VERDICTS[gig.wants[0]].title;

  function show({ won, verdict, stars, hint }) {
    const v = VERDICTS[verdict];
    node.replaceChildren(
      el('div', { class: 'result-head' },
        el('span', { class: 'result-icon' }, v.icon),
        el('div', {}, el('h2', {}, won ? 'Gig cleared!' : v.title), el('p', {}, won ? `${v.title}: just what they wanted.` : `They wanted: ${wanted}`)),
      ),
      won
        ? el('p', { class: 'earned' }, Array.from({ length: MAX_STARS }, (_, i) => el('span', { class: i < stars ? 'on' : '', style: `--i:${i}` }, '★')))
        : el('p', { class: 'hint' }, hint.text),
      el('div', { class: 'result-foot' },
        won && stars < MAX_STARS ? el('button', { class: 'again quiet', type: 'button', onclick: onAgain }, 'Replay') : null,
        el('button', { class: 'again', type: 'button', onclick: won ? onExit : onAgain }, won ? 'Back to the tour' : 'Try again'),
      ),
    );
    node.hidden = false;
  }

  return { node, show, hide: () => { node.hidden = true; } };
}
