// Entry point: shows the title screen, then switches between the tour map and a gig.
import './styles/base.css';
import './styles/ui.css';
import './styles/stage.css';
import './styles/monster.css';
import './styles/crowd.css';
import './styles/tour.css';
import './styles/title.css';
import { initAudio } from './features/audio/engine.js';
import { createGame } from './features/game/game.js';
import { createTour } from './features/tour/tourScreen.js';
import { createTitle } from './features/title/titleScreen.js';
import { GIGS } from './config/gigs.js';
import { loadProgress } from './features/game/progress.js';

const app = document.getElementById('app');
const showTour = () => app.replaceChildren(createTour({ onPlay: showGig }).node);
function showGig(gig) {
  const next = GIGS[GIGS.indexOf(gig) + 1];
  app.replaceChildren(createGame({ gig, onExit: showTour, onNext: next && (() => showGig(next)) }).node);
}

await loadProgress();
app.append(createTitle({ onStart: async () => { await initAudio(); showTour(); } }).node);
