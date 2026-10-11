// Entry point: shows a start screen (audio needs a tap first), then mounts the game.
import './styles/base.css';
import './styles/ui.css';
import './styles/stage.css';
import './styles/monster.css';
import './styles/crowd.css';
import { el } from './lib/dom.js';
import { initAudio } from './features/audio/engine.js';
import { createGame } from './features/game/game.js';

const app = document.getElementById('app');
const status = el('p', { class: 'start-status' }, 'Pick four monsters. Find the mix that wakes the graveyard.');
const startBtn = el('button', { class: 'mash', type: 'button' }, 'Start the band');
const start = el('div', { class: 'start' }, el('h1', {}, 'Boneyard Bangers'), status, startBtn);
app.append(start);

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  startBtn.textContent = 'Tuning up...';
  try {
    await initAudio();
    start.remove();
    app.append(createGame().node);
  } catch (err) {
    console.error('audio failed to start', err);
    status.textContent = 'The instruments failed to load. Check your connection and try again.';
    startBtn.disabled = false;
    startBtn.textContent = 'Try again';
  }
});
