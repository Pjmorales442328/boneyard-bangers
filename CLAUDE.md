# Boneyard Bangers

Monster band game for the RUN.world October Jam. Vanilla JS + Vite, no framework, no runtime dependencies.

## Commands
- `npm run dev` / `npm run build` (output in `dist/`, relative asset paths for RUN.world)
- `npm test` runs `scripts/rank.mjs --check`; run it after touching anything in `src/features/music/`
- `npm run rank` prints every mix with its score and verdict

## How it fits together
- `src/features/music/parts.js` holds the notes. `features.js` measures a mix, `score.js` turns that into a score and verdict. These three have no browser code and run in Node.
- `src/features/audio/` plays the same note data with samples; `performance.js` reports each note to the stage so animation stays in sync.
- `src/features/game/game.js` owns the flow: pick, MASH, verdict after the first pass, reset.
- Crowd reactions are CSS only, switched by `data-mood` on `.stage` and `.crowd`.

## Rules of thumb
- Changing a part's notes or adding a monster changes the ranking. Re-run `npm run rank`, then update `MAX`, `GOOD` and `LEGEND` in `score.js` so `npm test` passes.
- Sample pitches in `src/config/instruments.js` are the measured pitch, one octave above the VCSL file name.
- Progress is saved in localStorage (`src/lib/storage.js`). RUN SDK storage is not wired yet.
- Keep files under about 150 lines, one job per file.
