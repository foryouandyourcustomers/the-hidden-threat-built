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

export { getSharedGameContext as g };
//# sourceMappingURL=utils-6b09c87a.js.map
