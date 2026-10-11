// The end of the cutscene: a title over the band saying how it went, and the next-step buttons where MASH was.
import { el } from '../../lib/dom.js';
import { VERDICTS } from '../../config/verdicts.js';

export function createFinale({ gig, onAgain, onExit, onNext }) {
  const title = el('div', { class: 'finale', hidden: '' });
  const foot = el('div', { class: 'finale-foot' });
  const wanted = VERDICTS[gig.wants[0]].title;
  const button = (text, onclick, quiet) => el('button', { class: quiet ? 'again quiet' : 'again', type: 'button', onclick }, text);

  // While the band plays, the button row says what is going on.
  function wait() {
    title.hidden = true;
    foot.replaceChildren(el('p', { class: 'listening' }, 'The crowd is listening...'));
  }

  function show({ won, verdict }) {
    const v = VERDICTS[verdict];
    title.replaceChildren(
      el('h2', {}, won ? `${gig.hat} Gig cleared!` : `${v.icon} ${v.title}`),
      el('p', { class: 'finale-note' }, won ? `${v.icon} ${v.title}` : `They wanted: ${wanted}`),
    );
    title.hidden = false;
    foot.replaceChildren(...(won
      ? [button('Tour', onExit, true), onNext ? button('Next gig ›', onNext) : null]
      : [button('Try again', onAgain)]).filter(Boolean));
  }

  return { title, foot, wait, show };
}
