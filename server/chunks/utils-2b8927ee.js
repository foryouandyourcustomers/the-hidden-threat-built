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

export { getSharedGameContext as g };
//# sourceMappingURL=utils-2b8927ee.js.map
