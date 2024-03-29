const isDefenderId = (id) => id !== "attacker";
const isAttackerId = (id) => id === "attacker";
const isPlayerIdOfSide = (playerId, side) => side === "attack" ? isAttackerId(playerId) : isDefenderId(playerId);
const gameEventRequiresReaction = (event) => !![
  "ask-question",
  "quarter-reveal",
  "is-attacking-stage",
  "is-next-to-attacker"
].find((action) => isActionEventOf(event, action));
const isGameEventOf = (event, type) => event?.type === type;
const isActionEventOf = (event, action) => event?.type === "action" && event.action === action;
const isAdminActionEventOf = (event, action) => event?.type === "system" && event.action === action;
const guardForGameEventType = (type) => (event) => isGameEventOf(event, type);
const isPlayerGameEvent = (event) => event.type === "action" || event.type === "placement" || event.type === "move" || event.type === "reaction";
const guardForGameEventAction = (action) => (event) => isActionEventOf(event, action);
const guardForGameEventAdminAction = (action) => (event) => isAdminActionEventOf(event, action);
const isDefenseCharacter = (character) => Object.hasOwn(character, "ability");
const ABILITIES = {
  "quarter-reveal": "Darf fragen, auf welchem Viertel des Spielbretts sich der/die Angreifer:in befindet.",
  "is-attacking-stage": "Darf fragen, ob der/die Angreifer:in, eine Stufe angreift, wenn sie sich auf dieser Stufe oder auf einem angrenzenden Feld zu dazu befindet.",
  "is-next-to-attacker": "Darf fragen, ob der/die Angreifer:in sich auf seinem oder einem angrenzenden Feld, befindet.",
  "exchange-digital-footprint": "Darf den Gegenstand „Digital Footprint“ als Joker für einen beliebigen Gegenstand einsetzen."
};
const CHARACTERS = [
  {
    id: "order-manager",
    name: "Auftragsmanagement",
    description: "Die Auftragsmanager:innen sind für die Koordination und Überwachung des Bestell- und Lieferprozesses eines Unternehmens zuständig und kümmern sich auch um die Beauftragung von Großhandel und Lieferanten.",
    ability: "quarter-reveal",
    side: "defense"
  },
  {
    id: "dispatch-manager",
    name: "Speditionsleitung",
    description: "Die Leiter:innen in der Spedition müssen sicherstellen, das alle Produkte den hohen Qualitätsstandards entsprechen.",
    ability: "is-attacking-stage",
    side: "defense"
  },
  {
    id: "quality-manager",
    name: "Qualitätsmanagement",
    description: "Die Qualitätsmanager:innen sind für die Sicherstellung der Qualität der Produkte verantwortlich. Sie stellen sicher, dass alle Standards eingehalten werden",
    ability: "is-next-to-attacker",
    side: "defense"
  },
  {
    id: "it-specialist",
    name: "IT Fachkraft",
    description: "Die IT-Spezialist:innen sind für die Sicherstellung von Informations-Systeme zuständig. Sie kümmern sich auch um den Schutz der Systeme gegen Cyberangriffe",
    ability: "exchange-digital-footprint",
    side: "defense"
  },
  {
    id: "frustrated",
    name: "Frustration",
    description: "Du wurdest bei der letzten Beförderungsrunde übergangen – schon wieder! Frustriert über diese andauernde Ungerechtigkeit ziehst du den Schlussstrich und verlässt deine Firma; aber nicht, ohne dich vorher durch einen Sabotageakt bei ihr zu „bedanken“ – als ihr ehemaliger Risikomanager weißt du schließlich über die Schwachstellen im System Bescheid",
    side: "attack"
  },
  {
    id: "disappointed",
    name: "Enttäuschung",
    description: "Als System-Administratorin hast du Zugriff auf die sensibelsten Daten. Durch einen Blick in die interne Kommunikation der Geschäftsführung erfährt deine Kollegin, dass länger geplant ist, eure Abteilung demnächst zu outsourcen. Zutiefst enttäuscht darüber, dass man euch vor vollendete Tatsachen stellen wird. Jetzt willst du ihnen einen Denkzettel verpassen",
    side: "attack"
  }
];
const getPlayer = (playerId, context) => {
  if (isDefenderId(playerId)) {
    const player = context.defense.defenders.find((player2) => player2.id === playerId);
    if (!player)
      throw new Error(`Player ${playerId} not found in context`);
    return player;
  } else {
    return context.attack.attacker;
  }
};
const getPlayerSide = (playerId) => isDefenderId(playerId) ? "defense" : "attack";
const getCharacter = (characterId) => (
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  CHARACTERS.find((character) => character.id === characterId)
);
const getAbility = (character) => {
  if (isDefenseCharacter(character)) {
    return ABILITIES[character.ability];
  } else {
    return void 0;
  }
};

export { ABILITIES as A, CHARACTERS as C, isDefenderId as a, isAttackerId as b, getPlayerSide as c, isPlayerGameEvent as d, getAbility as e, gameEventRequiresReaction as f, getCharacter as g, isPlayerIdOfSide as h, isDefenseCharacter as i, getPlayer as j, guardForGameEventType as k, isActionEventOf as l, isGameEventOf as m, guardForGameEventAdminAction as n, guardForGameEventAction as o };
//# sourceMappingURL=player-81938fab.js.map
