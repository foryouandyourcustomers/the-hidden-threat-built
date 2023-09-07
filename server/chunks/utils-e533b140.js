const getSharedGameContext = (context) => ({
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenarios: context.globalAttackScenarios,
  users: context.users,
  events: context.events,
  defense: context.defense,
  attack: context.attack
});
const createDefaultDefender = (hostUserId, id) => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: "dispatch-manager",
  isConfigured: false
});
const createDefaultAttacker = (hostUserId) => ({
  id: "attacker",
  userId: hostUserId,
  faceId: 0,
  character: "disappointed",
  isConfigured: false
});

export { createDefaultAttacker as a, createDefaultDefender as c, getSharedGameContext as g };
//# sourceMappingURL=utils-e533b140.js.map
