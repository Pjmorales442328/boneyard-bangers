// Every song the band can play, by id. A song is { id, title, by, bpm, swing, parts } with one part per monster.
import { mountainKing } from './mountainKing.js';
import * as arranged from './arranged.js';

export const SONGS = Object.fromEntries([mountainKing, ...Object.values(arranged)].map((song) => [song.id, song]));
export const PART_IDS = Object.keys(mountainKing.parts);
