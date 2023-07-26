const getSharedGameContext = (context) => ({
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenarios: context.globalAttackScenarios,
  users: context.users,
  actions: context.actions,
  defense: context.defense,
  attack: context.attack
});

export { getSharedGameContext as g };
//# sourceMappingURL=utils-83a2361e.js.map
