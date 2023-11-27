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
const deleteGame = (gameId) => {
  const games = getGames();
  const game = games[gameId];
  if (!game) {
    console.warn(`Tried to delete game ${gameId} but it did not exist`);
    return;
  }
  game.machine.stop();
  delete games[gameId];
  console.info(`Deleted game ${gameId}`);
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

export { getGame as a, addGame as b, deleteGame as d, getGames as g };
//# sourceMappingURL=global-b99bb08b.js.map
