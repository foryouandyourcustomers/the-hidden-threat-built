const getSharedGameContext = (context) => ({
  gameId: context.gameId,
  items: context.items,
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
  originalPosition: [0, 0],
  faceId: 0,
  role: "dispatch-manager",
  isConfigured: false
});
const createDefaultAttacker = (hostUserId) => ({
  id: "attacker",
  userId: hostUserId,
  faceId: 0,
  originalPosition: [0, 0],
  role: "disappointment",
  isConfigured: false
});

export { createDefaultAttacker as a, createDefaultDefender as c, getSharedGameContext as g };
//# sourceMappingURL=utils-7614c065.js.map
