// A panel that slides up over the current screen for the menu pages. Returns a function that closes it.
import { el } from '../../lib/dom.js';

export function openSheet(title, ...body) {
  const close = () => back.remove();
  const back = el('div', { class: 'sheet-back', onclick: (e) => { if (e.target === back) close(); } },
    el('section', { class: 'sheet', role: 'dialog', 'aria-label': title },
      el('header', {}, el('h2', {}, title), el('button', { class: 'back', type: 'button', 'aria-label': 'Close', onclick: close }, '✕')),
      el('div', { class: 'sheet-body' }, body),
    ),
  );
  document.getElementById('app').append(back);
  return close;
}
