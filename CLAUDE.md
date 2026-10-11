# Boneyard Bangers

Monster band game for the RUN.world October Jam. Vanilla JS + Vite, no framework, no runtime dependencies.

## Commands
- `npm run dev` / `npm run build` (output in `dist/`, relative asset paths for RUN.world)
- `npm test` runs `scripts/rank.mjs --check`; run it after touching anything in `src/features/music/` or `src/config/gigs.js`
- `npm run rank` prints verdict counts per song and winning bands per gig; `npm run rank <songId>` prints that song's 70 mixes

## How it fits together
- `src/features/music/songs/` holds the 12 tracks as note data: `mountainKing.js` is written by hand, `arranged.js` gives a tune, bell line, chords and feel per song and `arrange.js` builds the eight parts. `notation.js` is the shorthand (`line` throws if a melody does not fill the 64-step loop).
- `features.js` measures a mix, `score.js` turns that into a score and verdict, calibrated per song from its own 70 mixes (no hand-tuned numbers). None of this has browser code; it runs in Node.
- `src/features/audio/` plays the same note data with samples; `performance.js` reports each note to the stage so animation stays in sync.
- `src/config/gigs.js` is the tour: each gig lists its track (`song`), the verdicts that clear it (`wants`), who can play (`roster`) and the crowd's costume. `src/main.js` switches between the tour map (`features/tour/tourScreen.js`) and one gig.
- `src/features/game/game.js` owns one gig: pick, MASH, verdict after the first pass, stars or a hint, reset.
- `src/features/tour/hints.js` brute-forces the nearest winning band, so hints are always true. Miss 1 says how many can stay, miss 2 names who must go, miss 3 gives the swap.
- Crowd reactions are CSS, switched by `data-mood` on `.stage` and `.crowd`; `crowd.js` adds thrown props, costumes (`--hat`, `--prop`) and speech bubbles.

## Rules of thumb
- Changing a song's notes changes its ranking. Re-run `npm run rank` and `npm test`; the scoring recalibrates itself, but a gig's `wants` or `roster` may need changing.
- To add a track: add an `arrange({...})` export in `arranged.js` (tune notes at C5 or above count as the lead), then point a gig's `song` at it.
- Crowd sounds are in `public/sfx/<verdict>.mp3`, levels in `SFX_LEVELS` (`src/config/instruments.js`), played by `playCrowd` in `engine.js`. `?unlock` in the address opens every gig.
- Sample pitches in `src/config/instruments.js` are the measured pitch, one octave above the VCSL file name.
- Changing notes or scoring can make a gig unwinnable; `npm test` fails if so. Fix the gig's `wants` or `roster`.
- Stars per gig are saved in localStorage (`src/lib/storage.js`, key `boneyard-bangers-tour`). RUN SDK storage is not wired yet.
- Keep files under about 150 lines, one job per file.
