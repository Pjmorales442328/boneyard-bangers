# Graveyard Gigs

Monster band game for the RUN.world October Jam. Vanilla JS + Vite, no framework, no runtime dependencies.

## Commands
- `npm run dev` / `npm run build` (output in `dist/`, relative asset paths for RUN.world)
- `npm test` runs `scripts/rank.mjs --check`; run it after touching anything in `src/features/music/` or `src/config/gigs.js`
- `npm run rank` prints verdict counts per song and winning bands per gig; `npm run rank <songId>` prints that song's 70 mixes

## How it fits together
- `src/features/music/songs/` holds the 12 tracks as note data: `mountainKing.js` is written by hand, `arranged.js` gives a tune, bell line, chords and feel per song and `arrange.js` builds the eight parts. `notation.js` is the shorthand (`line` throws if a melody does not fill the 64-step loop).
- `features.js` measures a mix, `score.js` turns that into a score and verdict, calibrated per song from its own 70 mixes (no hand-tuned numbers). None of this has browser code; it runs in Node.
- `src/features/audio/` plays the same note data with samples; `performance.js` reports each note to the stage so animation stays in sync.
- `src/config/gigs.js` is the tour: each gig lists its track (`song`), the verdicts that clear it (`wants`), who can play (`roster`) and the crowd's costume. `src/main.js` shows the title screen (`features/title/titleScreen.js`: logo and start button over the stage) and then switches between the tour map (a winding trail of tombstones, not a list; the user called the list version 'too basic') (`features/tour/tourScreen.js`) and one gig.
- `src/features/game/game.js` owns one gig: pick, MASH, then a cutscene: the monster cards fold away and the stage takes their room. A win plays an encore under the celebration; a miss stops after one pass. `finale.js` is the title just above the band (cleared, or what the crowd heard) plus the button row that sits where MASH was (Try again / Go for ★★★ / Tour / Next gig). There is no result card. When the stage is tall, `--lift` in `stage.css` raises band, crowd and ground so the action sits mid-stage.
- `src/features/tour/solutions.js` says whether a verdict clears a gig, ranks the winning bands, and gives stars for the band itself (3 = the best band for that gig, 2 = better half of the rest, 1 = any other win). The user rejected stars counted by tries. `hintFor` gets plainer with each miss: the crowd's wish, what is missing (`brings` in `src/config/monsters.js`), what to trade for it, and from the fourth miss the exact swap. The user rejected a 'N of 4 can stay' hint and naming a monster early.
- A three-star band sets the `perfect` class on the stage: the showstopper in `stage.css` (flash, spotlights, fireworks, bigger hop; shooting stars for a lullaby).
- `src/features/audio/theme.js` loops the menu music quietly on the title screen and the tour map; on the title the monsters move only when their notes sound (the user found constant hopping too busy). Sound cannot start before the player's first touch, so the title shows 'Tap anywhere for sound' until then.
- The title screen is also the main menu: How to play (the tutorial), Rockstars, Settings, About. The last three are sheets in `src/features/menu/` opened with `sheet.js`. Settings (`src/lib/settings.js`: sound, menu music) are saved like progress.
- Tutorial: `TUTORIAL` in `src/config/gigs.js` is a gig outside the tour with `coach: true`; `src/features/game/coach.js` is the talking monster that names each band member to tap until the best band is on stage. A first-time player is sent there from the start button; clearing it is recorded under its id `soundcheck`.
- Rockstars uses the RUN SDK leaderboard through `src/services/leaderboard.js` (score = total stars, `metadata.cleared` = gigs cleared; all 12 earns the guitar). It runs on RUN's default leaderboard config; add `rundot/leaderboard.config.json` only if that needs changing.
- Crowd reactions are CSS, switched by `data-mood` on `.stage` and `.crowd`; `crowd.js` adds thrown props, costumes (`--hat`, `--prop`) and speech bubbles placed over the ghost that speaks. Two extra moods end the cutscene: `cheer` (win) and `boo` (miss).

## Rules of thumb
- Changing a song's notes changes its ranking. Re-run `npm run rank` and `npm test`; the scoring recalibrates itself, but a gig's `wants` or `roster` may need changing.
- To add a track: add an `arrange({...})` export in `arranged.js` (tune notes at C5 or above count as the lead), then point a gig's `song` at it.
- Crowd sounds are in `public/sfx/<verdict>.mp3`, levels in `SFX_LEVELS` (`src/config/instruments.js`), played by `playCrowd` in `engine.js`. `?unlock` in the address opens every gig.
- Sample pitches in `src/config/instruments.js` are the measured pitch, one octave above the VCSL file name.
- Changing notes or scoring can make a gig unwinnable; `npm test` fails if so. Fix the gig's `wants` or `roster`.
- Best stars per gig are saved to the player's RUN.world account through the RUN SDK's `appStorage` (`src/lib/storage.js`, key `graveyard-gigs-tour`); `main.js` awaits `loadProgress()` before the title screen. Browser storage is blocked inside RUN's game frame, so never use `localStorage`.
- RUN.world: game id is in `game.config.prod.json` (keep it). Deploy with `npm run build` then `rundot deploy` (CLI at `%LOCALAPPDATA%\Programs\Rundot\rundot.exe`, not on PATH). `rundot preflight` checks the build. `public/thumbnail.jpg` must be exactly 512×512. SDK docs are in `node_modules/@series-inc/rundot-game-sdk/docs/`.
- Keep files under about 150 lines, one job per file.
