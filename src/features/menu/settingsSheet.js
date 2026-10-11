// Settings: sound and menu music on or off, and wiping saved progress.
import { el } from '../../lib/dom.js';
import { settings, setSetting } from '../../lib/settings.js';
import { resetProgress } from '../game/progress.js';
import { openSheet } from './sheet.js';

// `onChange()` runs after a switch flips; `onReset()` runs after progress is wiped.
export function openSettings({ onChange, onReset }) {
  const toggle = (name, label) => {
    const button = el('button', { class: 'switch', type: 'button', role: 'switch' });
    const paint = () => { button.setAttribute('aria-checked', String(settings[name])); button.textContent = settings[name] ? 'On' : 'Off'; };
    button.addEventListener('click', () => { setSetting(name, !settings[name]); paint(); onChange(); });
    paint();
    return el('div', { class: 'setting' }, el('span', {}, label), button);
  };
  // Wiping progress cannot be undone, so it takes a second tap.
  let armed = false;
  const reset = el('button', { class: 'again quiet', type: 'button' }, 'Reset progress');
  reset.addEventListener('click', () => {
    if (!armed) { armed = true; reset.textContent = 'Tap again to erase all stars'; reset.classList.add('danger'); return; }
    resetProgress();
    close();
    onReset();
  });
  const close = openSheet('Settings', toggle('sound', 'Sound'), toggle('music', 'Menu music'), el('div', { class: 'setting' }, el('span', {}, 'Start over'), reset));
}
