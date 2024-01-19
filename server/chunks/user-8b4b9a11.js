import { j as getPlayer } from './player-81938fab.js';

const findUserIndex = (userId, context) => {
  const index = context.users.findIndex((user) => user.id === userId);
  return index === -1 ? void 0 : index;
};
const getUser = (userId, context) => {
  const user = context.users.find((user2) => user2.id === userId);
  if (!user)
    throw new Error(`The user with id ${userId} was not found.`);
  return user;
};
const userControlsPlayerId = (userId, playerId, context) => userControlsPlayer(userId, getPlayer(playerId, context), context);
const userControlsPlayer = (userId, player, context) => {
  if (player.userId === userId)
    return true;
  return userIsAdmin(userId, context);
};
const userIsAdmin = (userId, context) => {
  const user = getUser(userId, context);
  return user.isAdmin;
};

export { userIsAdmin as a, userControlsPlayer as b, findUserIndex as f, getUser as g, userControlsPlayerId as u };
//# sourceMappingURL=user-8b4b9a11.js.map
