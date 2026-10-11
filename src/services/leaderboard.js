// The Rockstars board on RUN.world: one score per player, their total stars. RUN keeps each player's best.
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

// `cleared` rides along so the board can mark players who finished every gig.
export async function submitStars(stars, cleared) {
  try {
    // ponytail: the board wants a run length; total stars have none, so send a fixed minute.
    await RundotGameAPI.leaderboard.submitScore({ score: stars, duration: 60, metadata: { cleared } });
  } catch (err) {
    console.warn('could not send stars to the Rockstars board', err);
  }
}

// Throws if the board cannot be reached; the caller shows that to the player.
export async function topPlayers(limit = 25) {
  const page = await RundotGameAPI.leaderboard.getPagedScores({ limit });
  return page.entries.map((e) => ({ rank: e.rank, name: e.username, stars: e.score, cleared: e.metadata?.cleared ?? 0 }));
}
