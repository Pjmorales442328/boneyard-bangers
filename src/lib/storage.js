// Saves small JSON values in the browser. Storage can be blocked (private mode, embedded frames), so never throw.
// ponytail: localStorage only; switch to the RUN SDK's cloud storage once the game is wired to RUN accounts.
export function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (err) {
    console.warn(`could not read "${key}" from storage`, err);
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`could not save "${key}" to storage`, err);
  }
}
