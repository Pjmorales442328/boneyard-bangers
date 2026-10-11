# Boneyard Bangers

A monster band game for the RUN.world October Jam (theme: Monster Mash).

Pick four of eight monsters, hit **MASH**, and the ghost crowd reacts to the mix. There are 70 possible mixes and 8 crowd reactions to find, including one legendary banger.

The verdict is not hand-written per mix. The game measures the notes each monster plays and scores the mix on four things:

| Measure | What it checks |
|---|---|
| Groove | Syncopation, with a medium amount scoring best |
| Tightness | Parts fill each other's gaps and do not pile up on weak beats |
| Harmony | Roughness between notes from different monsters |
| Full band | A pulse, a low part, a middle part and a tune are all present |

## Run it

```
npm install
npm run dev      # play at the address it prints
npm run build    # production build in dist/
npm run rank     # print all 70 mixes with scores and verdicts
npm test         # check the ranking still has one legend and every verdict
```

## Folder structure

```
src/
  config/            song constants, monsters, instruments, verdict text
  features/music/    note data, measurements, scoring
  features/audio/    Web Audio engine and performance scheduler
  features/stage/    monsters, instruments, ghost crowd, scenery
  features/game/     picker, result card, reaction gallery, game flow, progress
  lib/               small DOM and storage helpers
  styles/            CSS, one file per area
scripts/             ranking check, sample conversion, art copy
public/samples/      instrument samples (mp3)
public/monsters/     monster art pieces (png)
```

## Rebuilding the assets

`raw-assets/` is not committed. To rebuild `public/`:

1. Unzip Kenney's Monster Builder Pack into `raw-assets/kenney/` and run `node scripts/copy-art.mjs`.
2. Put the VCSL wav files named in `src/config/instruments.js` into `raw-assets/samples/` and run `bash scripts/convert-samples.sh` (needs ffmpeg).

## Credits

- Tune: "In the Hall of the Mountain King" by Edvard Grieg (1875), public domain. Arrangement written for this game.
- Monster art: [Monster Builder Pack](https://kenney.nl/assets/monster-builder-pack) by Kenney, CC0.
- Instrument samples: [Versilian Community Sample Library](https://github.com/sgossner/VCSL), CC0.
- Scoring ideas: Longuet-Higgins and Lee (syncopation), Witek et al. 2014 (groove), Plomp and Levelt / Sethares (roughness).
