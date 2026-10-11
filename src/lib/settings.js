// The player's settings, saved with their progress. Read `settings`, change with `setSetting`.
import { load, save } from './storage.js';

const KEY = 'graveyard-gigs-settings';
export const settings = { sound: true, music: true };

export async function loadSettings() {
  Object.assign(settings, await load(KEY, {}));
}

export function setSetting(name, value) {
  settings[name] = value;
  save(KEY, settings);
}
