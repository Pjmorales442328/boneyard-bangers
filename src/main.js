// Entry point: the title screen and its menu, the tutorial on a first visit, then the tour map and its gigs. Menu music plays outside gigs.
import './styles/base.css';
import './styles/ui.css';
import './styles/stage.css';
import './styles/monster.css';
import './styles/crowd.css';
import './styles/tour.css';
import './styles/title.css';
import './styles/menu.css';
import { initAudio, setMuted } from './features/audio/engine.js';
import { playTheme, stopTheme } from './features/audio/theme.js';
import { createGame } from './features/game/game.js';
import { createTour } from './features/tour/tourScreen.js';
import { createTitle } from './features/title/titleScreen.js';
import { openSettings } from './features/menu/settingsSheet.js';
import { openAbout } from './features/menu/aboutSheet.js';
import { openRockstars } from './features/menu/rockstarsSheet.js';
import { GIGS, TUTORIAL } from './config/gigs.js';
import { loadProgress, bestStars, totalStars, clearedCount } from './features/game/progress.js';
import { loadSettings, settings } from './lib/settings.js';
import { submitStars } from './services/leaderboard.js';

const app = document.getElementById('app');
let audio;

function showTitle() {
  const title = createTitle({
    // A first-time player gets the tutorial before the tour.
    onStart: async () => { await audio; (totalStars() || bestStars(TUTORIAL.id) ? showTour : showTutorial)(); },
    menu: [
      { icon: '🎓', label: 'How to play', onclick: async () => { await audio; showTutorial(); } },
      { icon: '🎸', label: 'Rockstars', onclick: openRockstars },
      { icon: '⚙️', label: 'Settings', onclick: () => openSettings({ onChange: applySettings, onReset: showTitle }) },
      { icon: 'ℹ️', label: 'About', onclick: openAbout },
    ],
  });
  app.replaceChildren(title.node);
  audio.then(() => { if (title.node.isConnected) playTheme(title.onHit); }, (err) => console.error('audio failed to load', err));
}

function applySettings() {
  setMuted(!settings.sound);
  if (settings.music) audio.then(() => { if (!app.querySelector('.game')) playTheme(); });
  else stopTheme();
}

function showTour() {
  playTheme();
  if (totalStars()) submitStars(totalStars(), clearedCount());
  app.replaceChildren(createTour({ onPlay: showGig, onMenu: showTitle }).node);
}

function showGig(gig) {
  stopTheme();
  const next = GIGS[GIGS.indexOf(gig) + 1];
  app.replaceChildren(createGame({ gig, onExit: showTour, onNext: next && (() => showGig(next)) }).node);
}

function showTutorial() {
  stopTheme();
  app.replaceChildren(createGame({ gig: TUTORIAL, onExit: showTour, onNext: () => showGig(GIGS[0]) }).node);
}

await Promise.all([loadProgress(), loadSettings()]);
setMuted(!settings.sound);
audio = initAudio();
showTitle();
