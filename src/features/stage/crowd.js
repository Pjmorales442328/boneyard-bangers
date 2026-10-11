// The ghost crowd. Its mood is one data attribute; CSS does the acting, plus a few thrown-in props.
import { el } from '../../lib/dom.js';

const GHOSTS = 9;
const PROPS = {
  legend: { count: 36, cls: 'confetti', text: () => '' },
  ouch: { count: 7, cls: 'bat', text: () => '🦇' },
  sleep: { count: 6, cls: 'zzz', text: () => 'z' },
  dizzy: { count: 8, cls: 'star', text: () => '✦' },
  offbeat: { count: 5, cls: 'huh', text: () => '?' },
};
const rand = (a, b) => a + Math.random() * (b - a);

export function createCrowd() {
  const ghosts = Array.from({ length: GHOSTS }, (_, i) => el('div', { class: 'ghost', style: `--i:${i}; --r:${rand(0.6, 1.4).toFixed(2)}; --size:${rand(0.85, 1.15).toFixed(2)}` }, el('i'), el('i'), el('b')));
  const props = el('div', { class: 'props' });
  const node = el('div', { class: 'crowd', 'data-mood': 'idle' }, props, ghosts);

  function setMood(mood) {
    node.dataset.mood = mood;
    props.replaceChildren();
    const p = PROPS[mood];
    if (!p) return;
    for (let i = 0; i < p.count; i++) {
      props.append(el('span', { class: p.cls, style: `--x:${rand(2, 98).toFixed(1)}%; --delay:${rand(0, 1.6).toFixed(2)}s; --hue:${Math.floor(rand(0, 360))}; --spin:${rand(-1, 1).toFixed(2)}` }, p.text()));
    }
  }

  return { node, setMood };
}
