const getSharedGameContext = (context) => ({
  timestamp: context.timestamp,
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenario: context.globalAttackScenario,
  targetedAttacks: context.targetedAttacks,
  users: context.users,
  events: context.events,
  defense: context.defense,
  attack: context.attack
});
const createDefaultDefender = (hostUserId, id) => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: "order-manager",
  isConfigured: false
});
const createDefaultAttacker = (hostUserId) => ({
  id: "attacker",
  userId: hostUserId,
  faceId: 0,
  character: "frustrated",
  isConfigured: false
});

export { createDefaultAttacker as a, createDefaultDefender as c, getSharedGameContext as g };
//# sourceMappingURL=utils-84124f51.js.map
