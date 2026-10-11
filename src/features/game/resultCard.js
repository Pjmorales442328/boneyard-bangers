// Shows the crowd's verdict, the score, and the four measurements behind it.
import { el } from '../../lib/dom.js';
import { VERDICTS, VERDICT_IDS } from '../../config/verdicts.js';
import { TOTAL_MIXES } from './progress.js';

const METERS = [['groove', 'Groove'], ['tight', 'Tightness'], ['smooth', 'Harmony'], ['full', 'Full band']];

export function createResultCard({ onAgain }) {
  const node = el('div', { class: 'result', hidden: '' });

  function show(result, news, prog) {
    const v = VERDICTS[result.verdict];
    node.replaceChildren(
      el('div', { class: 'result-head' },
        el('span', { class: 'result-icon' }, v.icon),
        el('div', {}, el('h2', {}, v.title), el('p', {}, v.line)),
        el('div', { class: 'score' }, el('b', {}, String(result.score)), el('span', {}, '★'.repeat(result.stars) + '☆'.repeat(5 - result.stars))),
      ),
      el('div', { class: 'meters' }, METERS.map(([key, label]) => el('div', { class: 'meter' }, el('span', {}, label), el('div', { class: 'bar' }, el('i', { style: `width:${Math.round(result.parts[key] * 100)}%` }))))),
      el('p', { class: 'hint' }, news.newReaction ? `New reaction found! ${v.hint}` : v.hint),
      el('div', { class: 'result-foot' },
        el('span', {}, `Reactions ${prog.found.length}/${VERDICT_IDS.length} · Mixes ${prog.triedCount}/${TOTAL_MIXES} · Best ${prog.best}`),
        el('button', { class: 'again', type: 'button', onclick: onAgain }, 'Try another mix'),
      ),
    );
    node.hidden = false;
  }

  return { node, show, hide: () => { node.hidden = true; } };
}
