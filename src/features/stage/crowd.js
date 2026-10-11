// The ghost crowd, dressed for the gig. Its mood is one data attribute; CSS does the acting, plus thrown-in props and speech bubbles.
import { el } from '../../lib/dom.js';

const GHOSTS = 9;
const BUBBLE_GAP_MS = 1100;
const PROPS = {
  legend: { count: 36, cls: 'confetti', text: '' },
  dance: { count: 8, cls: 'huh', text: '♪' },
  meh: { count: 3, cls: 'zzz', text: '…' },
  quake: { count: 7, cls: 'bat', text: '🪨' },
  ouch: { count: 7, cls: 'bat', text: '🦇' },
  sleep: { count: 6, cls: 'zzz', text: 'z' },
  dizzy: { count: 8, cls: 'star', text: '✦' },
  offbeat: { count: 5, cls: 'huh', text: '?' },
};
const rand = (a, b) => a + Math.random() * (b - a);

export function createCrowd(gig) {
  const ghosts = Array.from({ length: GHOSTS }, (_, i) => el('div', { class: 'ghost', style: `--i:${i}; --r:${rand(0.6, 1.4).toFixed(2)}; --size:${rand(0.85, 1.15).toFixed(2)}` }, el('i'), el('i'), el('b')));
  const props = el('div', { class: 'props' });
  const bubbles = el('div', { class: 'bubbles' });
  const node = el('div', { class: 'crowd', 'data-mood': 'idle', style: `--hat:'${gig.hat}'; --prop:'${gig.prop}'` }, props, ghosts, bubbles);
  let timers = [];

  const scatter = ({ count, cls, text }) => {
    for (let i = 0; i < count; i++) {
      props.append(el('span', { class: cls, style: `--x:${rand(2, 98).toFixed(1)}%; --delay:${rand(0, 1.6).toFixed(2)}s; --hue:${Math.floor(rand(0, 360))}; --spin:${rand(-1, 1).toFixed(2)}` }, text));
    }
  };

  function setMood(mood, won = false) {
    node.dataset.mood = mood;
    props.replaceChildren();
    if (PROPS[mood]) scatter(PROPS[mood]);
    // Any cleared gig gets confetti, whatever sound the crowd asked for.
    if (won && mood !== 'legend') scatter(PROPS.legend);
  }

  // Ghosts call out one line after another; the bubbles stay until the next call.
  function say(lines) {
    timers.forEach(clearTimeout);
    bubbles.replaceChildren();
    timers = lines.map((text, i) => setTimeout(() => bubbles.append(el('p', { class: i % 2 ? 'bubble right' : 'bubble' }, text)), i * BUBBLE_GAP_MS));
  }

  return { node, setMood, say };
}
