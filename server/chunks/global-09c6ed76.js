import { e as error } from './index-a4865dbd.js';

const GLOBAL_GAMES_KEY = Symbol.for("game.games");
const getGames = () => {
  let games = globalThis[GLOBAL_GAMES_KEY];
  if (!games) {
    games = {};
    globalThis[GLOBAL_GAMES_KEY] = games;
  }
  return games;
};
const addGame = (game) => {
  const games = getGames();
  games[game.id] = game;
};
function getGame(gameIdOrLocals) {
  return typeof gameIdOrLocals === "string" ? findGame(gameIdOrLocals) : getGameFromLocals(gameIdOrLocals);
}
const findGame = (gameId) => getGames()[gameId];
const getGameFromLocals = (locals) => {
  const game = locals.game;
  if (!game)
    throw error(500, "No game found in locals");
  return game;
};

export { addGame as a, getGame as g };
//# sourceMappingURL=global-09c6ed76.js.map
