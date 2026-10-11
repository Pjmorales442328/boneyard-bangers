// Small flat drawings of each instrument, as inline SVG (trusted, written here, never user input).
const svg = (body) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const bars = (colours, y = 30) => colours.map((c, i) => `<rect x="${8 + i * 18}" y="${y + i * 4}" width="14" height="${52 - i * 8}" rx="4" fill="${c}"/>`).join('');

export const INSTRUMENT_ART = {
  drums: svg('<rect x="14" y="38" width="72" height="40" fill="#e0483f"/><ellipse cx="50" cy="78" rx="36" ry="10" fill="#b5332c"/><ellipse cx="50" cy="38" rx="36" ry="10" fill="#fdf3dc" stroke="#c9b98f" stroke-width="3"/><path d="M22 44l12 30M46 48l10 30M70 46l10 28" stroke="#fdd24a" stroke-width="3"/>'),
  bass: svg(`<rect x="4" y="74" width="92" height="8" rx="4" fill="#5b3a23"/>${bars(['#a8612c', '#b96d33', '#c97b3c', '#d98a47', '#e59a55'], 22)}`),
  organ: svg('<rect x="8" y="70" width="84" height="22" rx="5" fill="#5a3d7a"/>' + [0, 1, 2, 3, 4].map((i) => `<rect x="${14 + i * 15}" y="${[30, 14, 6, 14, 30][i]}" width="11" height="${[42, 58, 66, 58, 42][i]}" rx="5" fill="#f0c84b"/><rect x="${16 + i * 15}" y="58" width="7" height="4" fill="#7a5a12"/>`).join('')),
  tune: svg([0, 1, 2, 3].map((i) => `<g transform="translate(${10 + i * 21} ${28 + i * 5})"><rect x="3" y="4" width="10" height="${50 - i * 9}" rx="5" fill="#fff"/><circle cx="4" cy="4" r="5" fill="#fff"/><circle cx="12" cy="4" r="5" fill="#fff"/><circle cx="4" cy="${54 - i * 9}" r="5" fill="#fff"/><circle cx="12" cy="${54 - i * 9}" r="5" fill="#fff"/></g>`).join('')),
  shaker: svg('<rect x="44" y="50" width="12" height="42" rx="6" fill="#8a5a2b"/><circle cx="50" cy="34" r="27" fill="#ff8a3c"/><path d="M26 28q24 14 48 0M24 40q26 14 52 0" stroke="#fff3" stroke-width="5" fill="none"/>'),
  glock: svg('<path d="M10 30h80" stroke="#8a6d1a" stroke-width="6" stroke-linecap="round"/>' + [0, 1, 2].map((i) => `<path d="M${22 + i * 28} 34v8" stroke="#8a6d1a" stroke-width="3"/><path d="M${10 + i * 28} ${66 + (i % 2) * 6}q0-24 12-24t12 24z" fill="#ffd84a"/><circle cx="${22 + i * 28}" cy="${70 + (i % 2) * 6}" r="5" fill="#c79a1c"/>`).join('')),
  boogie: svg('<rect x="4" y="34" width="92" height="46" rx="6" fill="#2a2140"/><rect x="10" y="44" width="80" height="30" rx="2" fill="#fff"/>' + [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${21.4 + i * 11.4} 44v30" stroke="#bbb" stroke-width="1"/>`).join('') + [0, 1, 3, 4, 5].map((i) => `<rect x="${17.5 + i * 11.4}" y="44" width="7" height="18" fill="#2a2140"/>`).join('')),
  harpsi: svg('<path d="M8 84V30q0-16 16-10l62 40q8 6 4 24z" fill="#8f3f8f"/><path d="M8 84h82" stroke="#f0c84b" stroke-width="6" stroke-linecap="round"/>' + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${18 + i * 12} ${28 + i * 8}V80" stroke="#f6dc8a" stroke-width="2"/>`).join('')),
};
