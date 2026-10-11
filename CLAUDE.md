# Boneyard Bangers

Monster band game for the RUN.world October Jam. Vanilla JS + Vite, no framework, no runtime dependencies.

## Commands
- `npm run dev` / `npm run build` (output in `dist/`, relative asset paths for RUN.world)
- `npm test` runs `scripts/rank.mjs --check`; run it after touching anything in `src/features/music/` or `src/config/gigs.js`
- `npm run rank` prints every mix with its score and verdict

## How it fits together
- `src/features/music/parts.js` holds the notes. `features.js` measures a mix, `score.js` turns that into a score and verdict. These three have no browser code and run in Node.
- `src/features/audio/` plays the same note data with samples; `performance.js` reports each note to the stage so animation stays in sync.
- `src/config/gigs.js` is the tour: each gig lists the verdicts that clear it (`wants`), who can play (`roster`), tempo and the crowd's costume. `src/main.js` switches between the tour map (`features/tour/tourScreen.js`) and one gig.
- `src/features/game/game.js` owns one gig: pick, MASH, verdict after the first pass, stars or a hint, reset.
- `src/features/tour/hints.js` brute-forces the nearest winning band, so hints are always true. Miss 1 says how many can stay, miss 2 names who must go, miss 3 gives the swap.
- Crowd reactions are CSS, switched by `data-mood` on `.stage` and `.crowd`; `crowd.js` adds thrown props, costumes (`--hat`, `--prop`) and speech bubbles.

## Rules of thumb
- Changing a part's notes or adding a monster changes the ranking. Re-run `npm run rank`, then update `MAX`, `GOOD` and `LEGEND` in `score.js` so `npm test` passes.
- Sample pitches in `src/config/instruments.js` are the measured pitch, one octave above the VCSL file name.
- Changing notes or scoring can make a gig unwinnable; `npm test` fails if so. Fix the gig's `wants` or `roster`.
- Stars per gig are saved in localStorage (`src/lib/storage.js`, key `boneyard-bangers-tour`). RUN SDK storage is not wired yet.
- Keep files under about 150 lines, one job per file.
