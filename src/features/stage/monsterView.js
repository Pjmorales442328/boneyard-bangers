// Builds one monster out of art pieces and animates it each time its instrument sounds.
import { el } from '../../lib/dom.js';
import { LEG_HEIGHT, artFiles } from '../../config/monsters.js';
import { INSTRUMENT_ART } from './instrumentArt.js';

const img = (file, cls) => el('img', { src: `./monsters/${file}`, class: cls, alt: '', draggable: 'false' });
const pair = (file, cls) => [img(file, `${cls} left`), img(file, `${cls} right`)];

export function createMonsterView(monster) {
  const art = artFiles(monster);
  const instrument = el('div', { class: 'instrument', html: INSTRUMENT_ART[monster.id] });
  const torso = el('div', { class: 'torso' },
    pair(art.arm, 'arm'),
    pair(art.detail, 'detail'),
    img(art.body, 'body'),
    el('div', { class: `face eyes-${art.eyes.length}` }, el('div', { class: 'eyes' }, art.eyes.map((e) => img(e, 'eye'))), img(art.mouth, 'mouth')),
  );
  const rig = el('div', { class: 'rig', style: `--leg-h:${LEG_HEIGHT[monster.leg]}px; filter:hue-rotate(${monster.hue ?? 0}deg)` }, pair(art.leg, 'leg'), torso);
  const node = el('div', { class: 'monster', 'data-id': monster.id }, el('div', { class: 'scaler' }, rig, instrument));

  // Louder notes squash harder. Each hit restarts quickly so fast runs still read.
  function hit(velocity = 0.8) {
    const squash = 1 - 0.12 * velocity;
    torso.animate([{ transform: `scale(${2 - squash}, ${squash})` }, { transform: 'scale(1, 1)' }], { duration: 220, easing: 'cubic-bezier(.2,1.6,.4,1)' });
    instrument.animate([{ transform: `translateX(-50%) scale(${1 + 0.18 * velocity}) rotate(${(Math.random() - 0.5) * 10}deg)` }, { transform: 'translateX(-50%) scale(1)' }], { duration: 200, easing: 'ease-out' });
    node.querySelectorAll('.arm').forEach((arm, i) => arm.animate([{ rotate: `${(i ? -1 : 1) * 22 * velocity}deg` }, { rotate: '0deg' }], { duration: 200, easing: 'ease-out' }));
  }

  return { node, hit };
}
