# Graveyard Gigs

A monster band game for the RUN.world October Jam (theme: Monster Mash).

The monster band goes on a tour of 12 gigs, each with its own track. Each gig has a ghost crowd in costume that wants one style of music: a lullaby for the nursery, a grave rumble for the demolition crew, a perfect banger for the final. Pick four monsters, hit **MASH**, and the crowd reacts. The gig then plays out as a cutscene on the stage: the ghosts cheer and the band earns up to 3 stars, or they boo, throw tomatoes and shout a hint that gets plainer with every miss. Stars rate the band, not the number of tries: only the best band for each crowd earns 3, and it gets a showstopper with spotlights and fireworks. New monsters join as the tour goes on.

The verdict is not hand-written per mix. The game measures the notes each monster plays and scores the mix on four things, calibrated per track:

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
npm run rank     # verdict counts per track and winning bands per gig; add a song id for its full table
npm test         # check every track scores sensibly and every gig can be won by following the hints
```

## Folder structure

```
src/
  config/            song constants, monsters, instruments, verdict text, the gig list
  features/music/    notation, arranger, measurements, scoring
  features/music/songs/  the 12 tracks as note data
  features/audio/    Web Audio engine and performance scheduler
  features/stage/    monsters, instruments, ghost crowd, scenery
  features/game/     picker, cutscene ending, one gig's flow, star progress
  features/tour/     tour map screen, win check, stars and hints
  lib/               small DOM and storage helpers
  styles/            CSS, one file per area
scripts/             ranking check, sample and crowd-sound conversion, art copy
public/samples/      instrument samples (mp3)
public/sfx/          crowd reaction sounds (mp3)
public/monsters/     monster art pieces (png)
```

## Rebuilding the assets

`raw-assets/` is not committed. To rebuild `public/`:

1. Unzip Kenney's Monster Builder Pack into `raw-assets/kenney/` and run `node scripts/copy-art.mjs`.
2. Put the VCSL wav files named in `src/config/instruments.js` into `raw-assets/samples/` and run `bash scripts/convert-samples.sh` (needs ffmpeg).
3. Put the crowd sounds listed below into `raw-assets/sfx/`, named after their verdict, and run `bash scripts/convert-sfx.sh`.

Add `?unlock` to the address to open every gig while testing.

## Credits

- Tunes, all public domain, arranged for this game: Korobeiniki (Russian folk), Twinkle, Twinkle, Little Star (French melody, 1761), Symphony No. 5 (Beethoven, 1808), Dance of the Sugar Plum Fairy (Tchaikovsky, 1892), Toccata and Fugue in D minor (Bach), Flight of the Bumblebee (Rimsky-Korsakov, 1900), Canon in D (Pachelbel), The Entertainer (Joplin, 1902), William Tell Overture (Rossini, 1829), Infernal Galop (Offenbach, 1858), Frère Jacques (French nursery song), In the Hall of the Mountain King (Grieg, 1875).
- Crowd sounds, all CC0 from [freesound.org](https://freesound.org) (sound id, author): legend 221567 AlaskaRobotics, dance 333404 jayfrosting, meh 561020 TurboFool, offbeat 678672 mglennsound, ouch 353925 dr_skitz, quake 199802 TheMinkman, dizzy 235845 hermengarde, sleep 610994 AlanKidd88.
- Monster art: [Monster Builder Pack](https://kenney.nl/assets/monster-builder-pack) by Kenney, CC0.
- Instrument samples: [Versilian Community Sample Library](https://github.com/sgossner/VCSL), CC0.
- Scoring ideas: Longuet-Higgins and Lee (syncopation), Witek et al. 2014 (groove), Plomp and Levelt / Sethares (roughness).
