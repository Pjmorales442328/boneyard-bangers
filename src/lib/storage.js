// Saves small JSON values to the player's RUN.world account (browser storage is blocked inside RUN's game frame).
// Storage must never break the game: a failed read gives the fallback and a failed save is only logged.
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

const ready = RundotGameAPI.initializeAsync();

export async function load(key, fallback) {
  try {
    await ready;
    return JSON.parse(await RundotGameAPI.appStorage.getItem(key)) ?? fallback;
  } catch (err) {
    console.warn(`could not read "${key}" from storage`, err);
    return fallback;
  }
}

export function save(key, value) {
  ready.then(() => RundotGameAPI.appStorage.setItem(key, JSON.stringify(value))).catch((err) => console.warn(`could not save "${key}" to storage`, err));
}
