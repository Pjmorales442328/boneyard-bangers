// The eight monster cards and the MASH button. Monsters outside the gig's roster are shown but cannot play.
import { el } from '../../lib/dom.js';
import { MONSTERS } from '../../config/monsters.js';
import { SLOTS } from '../../config/song.js';
import { createMonsterView } from '../stage/monsterView.js';

export function createPicker({ gig, onToggle, onMash }) {
  const cards = Object.fromEntries(MONSTERS.map((m) => {
    const away = !gig.roster.includes(m.id);
    return [m.id, el('button', { class: `card${away ? ' away' : ''}${gig.newcomer === m.id ? ' new' : ''}`, type: 'button', ...(away ? { disabled: '' } : {}), onclick: () => onToggle(m.id) },
      createMonsterView(m).node,
      el('strong', {}, m.name),
      el('small', {}, away ? 'Away tonight' : m.plays),
    )];
  }));
  const mash = el('button', { class: 'mash', type: 'button', onclick: onMash }, 'MASH!');
  const node = el('div', { class: 'picker' }, el('div', { class: 'cards' }, Object.values(cards)), mash);

  // `tapId` is the card the tutorial wants tapped next, if any.
  function update(picks, tapId = null) {
    for (const [id, card] of Object.entries(cards)) {
      card.classList.toggle('picked', picks.includes(id));
      card.classList.toggle('tap-me', id === tapId);
    }
    const left = SLOTS - picks.length;
    mash.disabled = left > 0;
    mash.textContent = left > 0 ? `Pick ${left} more` : 'MASH!';
  }

  return { node, update };
}
