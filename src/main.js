// Entry point: shows a start screen (audio needs a tap first), then switches between the tour map and a gig.
import './styles/base.css';
import './styles/ui.css';
import './styles/stage.css';
import './styles/monster.css';
import './styles/crowd.css';
import './styles/tour.css';
import { el } from './lib/dom.js';
import { initAudio } from './features/audio/engine.js';
import { createGame } from './features/game/game.js';
import { createTour } from './features/tour/tourScreen.js';

const app = document.getElementById('app');
const status = el('p', { class: 'start-status' }, 'Take the monster band on tour. Every crowd wants a different sound.');
const startBtn = el('button', { class: 'mash', type: 'button' }, 'Start the band');
const start = el('div', { class: 'start' }, el('h1', {}, 'Boneyard Bangers'), status, startBtn);
app.append(start);

const showTour = () => app.replaceChildren(createTour({ onPlay: showGig }).node);
const showGig = (gig) => app.replaceChildren(createGame({ gig, onExit: showTour }).node);

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  startBtn.textContent = 'Tuning up...';
  try {
    await initAudio();
    showTour();
  } catch (err) {
    console.error('audio failed to start', err);
    status.textContent = 'The instruments failed to load. Check your connection and try again.';
    startBtn.disabled = false;
    startBtn.textContent = 'Try again';
  }
});
