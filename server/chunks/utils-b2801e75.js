const getSharedGameContext = (context) => ({
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
//# sourceMappingURL=utils-b2801e75.js.map
