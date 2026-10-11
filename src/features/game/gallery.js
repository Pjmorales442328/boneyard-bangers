// Header strip: one badge per crowd reaction, locked until the player triggers it.
import { el } from '../../lib/dom.js';
import { VERDICTS, VERDICT_IDS } from '../../config/verdicts.js';

export function createGallery() {
  const node = el('div', { class: 'gallery' });
  function update(found) {
    node.replaceChildren(...VERDICT_IDS.map((id) => el('span', { class: found.includes(id) ? 'badge found' : 'badge', title: found.includes(id) ? VERDICTS[id].title : 'Not found yet' }, found.includes(id) ? VERDICTS[id].icon : '?')));
  }
  return { node, update };
}
