// About: what the game is and who made the pieces it is built from.
import { el } from '../../lib/dom.js';
import { openSheet } from './sheet.js';

const link = (text, href) => el('a', { href, target: '_blank', rel: 'noopener' }, text);

export function openAbout() {
  openSheet('About',
    el('p', {}, 'Graveyard Gigs is a music puzzle. Eight monsters each play one part of a tune. Pick four, hit MASH, and give every ghost crowd the sound it asked for.'),
    el('p', {}, 'Every crowd reaction is worked out from the notes the band actually plays: the beat, the bass, the clashes and how busy it gets.'),
    el('p', {}, 'Made for the RUN.world October Jam, “Monster Mash”.'),
    el('h3', {}, 'Credits'),
    el('ul', {},
      el('li', {}, 'Monster art: ', link('Monster Builder Pack', 'https://kenney.nl/assets/monster-builder-pack'), ' by Kenney (CC0)'),
      el('li', {}, 'Instruments: ', link('Versilian Community Sample Library', 'https://github.com/sgossner/VCSL'), ' (CC0)'),
      el('li', {}, 'Crowd sounds: ', link('freesound.org', 'https://freesound.org'), ' (CC0)'),
      el('li', {}, 'Tunes: public domain classics by Grieg, Beethoven, Bach, Tchaikovsky, Joplin and others, arranged for this band'),
    ),
  );
}
