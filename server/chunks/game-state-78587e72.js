import { d as isPlayerGameEvent, k as guardForGameEventType, f as gameEventRequiresReaction, m as isGameEventOf, c as getPlayerSide, n as guardForGameEventAdminAction, o as guardForGameEventAction, h as isPlayerIdOfSide, l as isActionEventOf } from './player-85f087dd.js';
import { H as seededRandomGenerator, y as isEqual$1, B as BOARD_ITEMS, o as objectEntries, C as BOARD_SUPPLY_CHAINS, E as getStageAt, T as TARGETED_ATTACKS, G as GLOBAL_ATTACK_SCENARIOS, S as STAGES, z as findStageAt } from './targeted-attacks-0c2ef07b.js';

const TOTAL_ROUNDS = 12;
const COLUMN_COUNT = 9;
const ROW_COUNT = 8;
const NEW_GLOBAL_ATTACK_ROUNDS = [0, 3, 6, 9];
const ATTACKER_REVEAL_ROUNDS = [4, 9];
const isDefenseItemId = (itemId) => ITEMS.find((item) => item.id === itemId)?.side === "defense";
const isAttackItemId = (itemId) => !isDefenseItemId(itemId);
const isItemIdOfSide = (itemId, side) => side === "attack" ? isAttackItemId(itemId) : isDefenseItemId(itemId);
const getItem = (itemId) => ITEMS.find((item) => item.id === itemId);
const ITEMS = [
  {
    id: "certificate",
    name: "Zertifikat",
    description: "Mit diesem Zertifikat können Unternehmen nachweisen, dass sie geeignete Schutzmaßnahmen gegen potenzielle Bedrohungen implementiert haben. Es ist ein wichtiges Instrument, um das Vertrauen der Kunden und Geschäftspartner in die Lieferkette zu stärken.",
    side: "defense"
  },
  {
    id: "insurance",
    name: "Versicherung",
    description: "Die Versicherung bietet den Spielern Schutz und eine Absicherung gegen potenzielle Schäden, die durch Angriffe auf die Lieferkette entstehen können. Sie kann verwendet werden, um die Kosten für Reparaturen oder Ersatzteile zu decken und hilft, finanzielle Verluste zu vermeiden.",
    side: "defense"
  },
  {
    id: "security-camera",
    name: "Sicherheitskamera",
    description: "Die Sicherheitskamera bieten Schutz gegen Angriffe in der Lieferkette. Sie helfen dabei, verdächtige Aktivitäten zu erkennen und aufzuzeichnen, um mögliche Bedrohungen zu identifizieren. Die Kameras ermöglichen eine bessere Überwachung der Lieferkette und können dazu beitragen, potenzielle Sicherheitsprobleme frühzeitig zu erkennen.",
    side: "defense"
  },
  {
    id: "alarm-system",
    name: "Alarmanlage",
    description: "Die Alarmanlage erkennt verdächtige Bewegungen oder Geräusche und löst sofort ein akustisches und visuelles Warnsignal aus, um unerwünschte Eindringlinge abzuschrecken. Mit dieser Karte können Spieler ihre Lieferkette vor möglichen Bedrohungen schützen und das Vertrauen ihrer Kunden wahren.",
    side: "defense"
  },
  {
    id: "lock",
    name: "Sicherheitsschloss",
    description: "Das Sicherheitsschloss ist ein Gegenstand, der oft verwendet wird, um die Sicherheit von Gegenständen und Räumen zu gewährleisten. Es hilft, unerwünschten Zugang zu verhindern und kann als zusätzliche Schutzmaßnahme in Kombination mit anderen Sicherheitsvorkehrungen eingesetzt werden, um das Risiko eines Angriffs auf eine Lieferkette zu minimieren.",
    side: "defense"
  },
  {
    id: "gps-tracker",
    name: "GPS-Tracker",
    description: "Der GPS-Tracker kann verwendet werden, um den Spielern einen Vorteil zu verschaffen, indem sie jederzeit den genauen Standort ihrer Waren verfolgen können und so auf mögliche Angriffe schnell reagieren können.",
    side: "defense"
  },
  {
    id: "license",
    name: "License",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    side: "defense"
  },
  {
    id: "encrypted-data",
    name: "Verschlüsselte Daten",
    description: "Verschlüsselte Daten bieten Schutz vor Angriffen auf die Lieferkette, indem sie sicherstellt, dass sensible Informationen in einer undurchdringlichen Verschlüsselung aufbewahrt werden. Dadurch wird verhindert, dass Hacker oder andere Angreifer auf wichtige Daten zugreifen können, selbst wenn sie in das System eindringen.",
    side: "defense"
  },
  {
    id: "extinguisher",
    name: "Feuerlöscher",
    description: "Feuerlöscher sind ein wichtiges Element des Arbeitsschutzes und tragen zur Sicherheit von Mensch und Material bei. Im Falle eines Brandes können Feuerlöscher schnell eingesetzt werden, um das Feuer zu löschen oder einzudämmen. In der Lieferkette können Feuerlöscher dazu beitragen, Brandrisiken zu minimieren und Schäden zu begrenzen.",
    side: "defense"
  },
  {
    id: "firewall",
    name: "Firewall",
    description: "Die Firewall ist ein mächtiges Schutzwerkzeug, das eine digitale Barriere um das Netzwerk errichtet, um unautorisierten Zugriff zu verhindern. Durch das Blockieren von bösartigem Verkehr und das Überwachen des Datenverkehrs hilft die Firewall, die Systeme vor Angriffen und Datenverlust zu schützen und die Integrität der Lieferkette zu gewährleisten.",
    side: "defense"
  },
  {
    id: "digital-footprint",
    name: "Digital Footprint",
    description: "Ein Digital Footprint, kann zum Schutz vor Angriffen auf die Lieferkette verwendet werden. Es bezieht sich auf die Spuren, die digitale Aktivitäten hinterlassen, und kann helfen, potenzielle Schwachstellen in der Lieferkette aufzudecken und zu minimieren.",
    side: "defense"
  },
  {
    id: "fake-identity-card",
    name: "Gefälschter Ausweis",
    description: "Der Ausweis kann dazu genutzt werden, um sich unbefugt Zugang zu verschiedenen Orten und Informationen zu verschaffen. Er kann verwendet werden, um Sicherheitsmaßnahmen zu umgehen und das Vertrauen anderer Mitarbeiter zu gewinnen, um auf geschützte Ressourcen zuzugreifen.",
    side: "attack"
  },
  {
    id: "usb-stick",
    name: "USB-Stick",
    description: "Der USB-Stick dient zur Übertragung von Daten und Informationen zwischen verschiedenen Stationen der Lieferkette, um einen reibungslosen Ablauf sicherzustellen. Er ist ein wichtiger Bestandteil des Prozesses und enthält vertrauliche Informationen, die bei einem Missbrauch zu erheblichen Schäden führen können.",
    side: "attack"
  },
  {
    id: "blueprint",
    name: "Gebäudeplan",
    description: "Der Gebäudeplan zeigt die Struktur und Aufteilung des Firmengebäudes. Mit ihm kann man schnell und gezielt wichtige Bereiche wie das IT-Zentrum oder die Lagerhallen identifizieren und attackieren.",
    side: "attack"
  },
  {
    id: "cloud",
    name: "Cloud",
    description: "Die Cloud kann genutzt werden, um den Datenaustausch zwischen den verschiedenen Akteuren zu erleichtern und zu beschleunigen. Bei einem Angriff auf die Cloud können jedoch vertrauliche Informationen gestohlen, manipuliert oder gelöscht werden, was zu erheblichen Störungen der Lieferkette führen kann.",
    side: "attack"
  },
  {
    id: "virus",
    name: "Computer Virus",
    description: "Der Virus kann das System infizieren, wodurch Daten gelöscht, verändert oder gestohlen werden können. Die Spieler müssen schnell handeln, um den Virus zu identifizieren und zu beseitigen, bevor er noch mehr Schaden anrichtet.",
    side: "attack"
  },
  {
    id: "tools",
    name: "Werkzeug",
    description: "Das Werkzeug kann für einen Angriff eingesetzt werden, wenn es in die falschen Hände gerät, da es potenziell gefährliche Werkzeuge wie Sägen, Bohrer oder Schleifmaschinen enthält. Ein unautorisiertes Eindringen in das Lagerhaus oder ein Diebstahl des Werkzeugs kann die Lieferkette empfindlich stören und erheblichen Schaden verursachen.",
    side: "attack"
  },
  {
    id: "gun",
    name: "Pistole",
    description: "Die Pistole kann eine Bedrohung darstellen und den Spielern zeigen, dass der Angreifer bereit ist, Gewalt einzusetzen, um seine Ziele zu erreichen.",
    side: "attack"
  },
  {
    id: "binoculars",
    name: "Fernglas",
    description: "Das Fernglas ermöglicht den Spielern, einen genaueren Blick auf die Lieferkette zu werfen und mögliche Schwachstellen oder unerwartete Ereignisse zu erkennen. Durch das gezielte Beobachten können Risiken minimiert und Chancen genutzt werden.",
    side: "attack"
  },
  {
    id: "dynamite",
    name: "Dynamit",
    description: "Dynamit enthält einen explosiven Stoff, der in der Lage ist, schwere Schäden an Gebäuden und Infrastrukturen zu verursachen. Es erfordert spezielle Vorsichtsmaßnahmen bei der Lagerung und Handhabung, um Verletzungen und Schäden zu vermeiden. In den falschen Händen kann es zu einem schwerwiegenden Angriff auf die Lieferkette führen.",
    side: "attack"
  },
  {
    id: "data-exchange",
    name: "Datenaustausch",
    description: "Der Datenaustausch ermöglicht dem Angreifer den Zugriff auf vertrauliche Daten innerhalb der Lieferkette. Durch die Verwendung dieses Gegenstands kann der Angreifer Daten manipulieren, löschen oder kopieren, um seine Ziele zu erreichen und den Schaden für das Unternehmen zu maximieren.",
    side: "attack"
  }
];
class GameState {
  /** Use GameState.fromContext() to create a GameState */
  constructor(context) {
    this.context = context;
    const numberGenerator = seededRandomGenerator(context.timestamp);
    this.randomNumbers = Array.from({ length: 23 }, () => numberGenerator());
    this.playersInOrder = [
      context.attack.attacker,
      context.defense.defenders[0],
      context.defense.defenders[1],
      context.attack.attacker,
      context.defense.defenders[2],
      context.defense.defenders[3]
    ];
    this.playerEvents = this.context.events.filter(isPlayerGameEvent);
    this.finalizedEvents = this.playerEvents.filter((event) => event.finalized);
    this.finalizedPlacementEvents = this.finalizedEvents.filter(guardForGameEventType("placement"));
    this.finalizedActionEvents = this.finalizedEvents.filter(guardForGameEventType("action"));
    this.finalizedMoveEvents = this.finalizedEvents.filter(guardForGameEventType("move"));
    this.finalizedReactionEvents = this.finalizedEvents.filter(guardForGameEventType("reaction"));
    this.finalizedActionEventsRequiringReaction = this.finalizedActionEvents.filter(gameEventRequiresReaction);
    this.finalizedMoveOrActionEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, "move") || isGameEventOf(event, "action")
    );
    this.finalizedPlayerEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, "move") || isGameEventOf(event, "action") || isGameEventOf(event, "placement") || isGameEventOf(event, "reaction")
    );
    this.lastEvent = this.playerEvents[this.playerEvents.length - 1];
    this.lastFinalizedEvent = this.finalizedEvents[this.finalizedEvents.length - 1];
    const finalizedAndReactedActionEventCount = this.finalizedActionEvents.length - (this.finalizedActionEventsRequiringReaction.length - this.finalizedReactionEvents.length);
    this.currentRound = Math.floor(finalizedAndReactedActionEventCount / this.playersInOrder.length);
    this.nextEventType = this.finalizedPlacementEvents.length < 5 ? "placement" : this.lastFinalizedEvent && this.lastFinalizedEvent.type === "move" ? "action" : this.finalizedActionEventsRequiringReaction.length > this.finalizedReactionEvents.length ? "reaction" : "move";
    if (this.nextEventType === "reaction") {
      this.activePlayer = context.attack.attacker;
    } else if (this.nextEventType === "placement") {
      if (this.finalizedPlacementEvents.length < 4) {
        this.activePlayer = context.defense.defenders[this.finalizedPlacementEvents.length];
      } else {
        this.activePlayer = context.attack.attacker;
      }
    } else {
      this.activePlayer = this.playersInOrder[Math.floor(this.finalizedMoveOrActionEvents.length / 2) % this.playersInOrder.length];
    }
    this.activeSide = getPlayerSide(this.activePlayer.id);
    this.activePlayerPosition = this.playerPositions[this.activePlayer.id];
  }
  randomNumbers;
  playersInOrder;
  playerEvents;
  finalizedEvents;
  finalizedPlacementEvents;
  finalizedActionEvents;
  finalizedMoveEvents;
  finalizedReactionEvents;
  finalizedPlayerEvents;
  finalizedActionEventsRequiringReaction;
  finalizedMoveOrActionEvents;
  currentRound;
  activePlayer;
  activeSide;
  activePlayerPosition;
  lastEvent;
  lastFinalizedEvent;
  nextEventType;
  static previousState;
  static fromContext(context) {
    if (this.previousState && isEqual$1(this.previousState.context, context)) {
      return this.previousState.state;
    }
    const state = new GameState(context);
    this.previousState = { state, context };
    return state;
  }
  get isFinished() {
    return this.nextEventType !== "reaction" && this.finalizedActionEvents.length >= this.playersInOrder.length * TOTAL_ROUNDS || this.attackerIsCaught;
  }
  get playerPositions() {
    const playerPositions = {
      attacker: [0, 0],
      defender0: [0, 0],
      defender1: [0, 0],
      defender2: [0, 0],
      defender3: [0, 0]
    };
    this.context.events.filter(guardForGameEventType("placement")).filter((event) => event.finalized).forEach((event) => playerPositions[event.playerId] = event.coordinate);
    this.context.events.filter(guardForGameEventType("move")).filter((event) => event.finalized).forEach((event) => playerPositions[event.playerId] = event.to);
    return playerPositions;
  }
  get jokers() {
    return 2 - this.finalizedEvents.filter(
      (event) => event.type === "action" && event.action === "exchange-joker" || event.type === "reaction" && event.action === "joker" && event.useJoker === true
    ).length;
  }
  get defenseInventory() {
    const defenseInventoryIds = Object.values(ITEMS).map((item) => item.id).filter(isDefenseItemId);
    let initialAmount = 0;
    if (this.context.events.find(guardForGameEventAdminAction("fill-inventory"))) {
      initialAmount = 50;
    }
    const inventory = Object.fromEntries(
      defenseInventoryIds.map((id) => [id, initialAmount])
    );
    this.finalizedActionEvents.filter(guardForGameEventAction("collect")).forEach((event) => {
      if (event.itemId && isDefenseItemId(event.itemId)) {
        inventory[event.itemId] += 1;
      }
    });
    this.finalizedActionEvents.filter(guardForGameEventAction("exchange-digital-footprint")).forEach((event) => {
      if (event.item) {
        inventory[event.item]++;
        inventory["digital-footprint"]--;
      }
    });
    return inventory;
  }
  get attackInventory() {
    const attackInventoryIds = Object.values(ITEMS).map((item) => item.id).filter(isAttackItemId);
    let initialAmount = 0;
    if (this.context.events.find(guardForGameEventAdminAction("fill-inventory"))) {
      initialAmount = 50;
    }
    const inventory = Object.fromEntries(
      attackInventoryIds.map((id) => [id, initialAmount])
    );
    this.finalizedActionEvents.filter(guardForGameEventAction("collect")).forEach((event) => {
      if (event.itemId && isAttackItemId(event.itemId)) {
        inventory[event.itemId] += 1;
      }
    });
    this.finalizedActionEvents.filter(guardForGameEventAction("exchange-joker")).forEach((event) => {
      if (event.itemId) {
        inventory[event.itemId] += 1;
      }
    });
    return inventory;
  }
  getItemsForCoordinate(coordinate) {
    const items = BOARD_ITEMS.filter((item) => isEqual$1(item.position, coordinate));
    return items.map((item) => {
      const collectedCount = this.context.events.filter(guardForGameEventAction("collect")).filter((event) => isEqual$1(event.position, coordinate)).filter((event) => event.itemId === item.id).length;
      return {
        item,
        collectedCount
      };
    });
  }
  /** Check if this is a valid target destination for the active player */
  isValidMove(to) {
    if (to[0] < 0 || to[0] > 8 || to[1] < 0 || to[1] > 7)
      return false;
    for (const playerPosition of Object.keys(this.playerPositions).filter((playerId) => isPlayerIdOfSide(playerId, this.activeSide)).map((playerId) => this.playerPositions[playerId])) {
      if (isEqual$1(playerPosition, to))
        return false;
    }
    const currentPosition = this.activePlayerPosition;
    const xDiff = Math.abs(currentPosition[0] - to[0]);
    const yDiff = Math.abs(currentPosition[1] - to[1]);
    return xDiff + yDiff <= 2 && xDiff + yDiff != 0;
  }
  isValidPlacement(coordinate) {
    if (coordinate[0] < 0 || coordinate[0] > 8 || coordinate[1] < 0 || coordinate[1] > 7)
      return false;
    if (this.activePlayer.id === "attacker")
      return true;
    for (const [playerId, position] of objectEntries(this.playerPositions)) {
      if (isEqual$1(position, coordinate) && this.isPlaced(playerId))
        return false;
    }
    let stageIds;
    switch (this.activePlayer.character) {
      case "dispatch-manager":
        stageIds = ["logistics", "storage"];
        break;
      case "it-specialist":
        stageIds = ["datacenter"];
        break;
      case "order-manager":
        stageIds = ["sales", "supply"];
        break;
      case "quality-manager":
        stageIds = ["production"];
        break;
    }
    let allValidCoordinates = BOARD_SUPPLY_CHAINS.flat().filter((stage) => stageIds.includes(stage.id)).map((stage) => stage.coordinate).filter((stageCoordinate) => {
      for (const [playerId, position] of objectEntries(this.playerPositions)) {
        if (isEqual$1(position, stageCoordinate) && this.isPlaced(playerId))
          return false;
      }
      return true;
    });
    if (allValidCoordinates.length === 0) {
      allValidCoordinates = BOARD_SUPPLY_CHAINS.flat().map((stage) => stage.coordinate);
    }
    for (const stageCoordinate of allValidCoordinates) {
      if (isEqual$1(stageCoordinate, coordinate))
        return true;
    }
    return false;
  }
  isPlaced(playerId) {
    return this.context.events.filter(guardForGameEventType("placement")).filter((event) => event.playerId === playerId && event.finalized).length > 0;
  }
  get defendedStages() {
    return this.attackedAndDefendedStages.defended;
  }
  get attackedStages() {
    return this.attackedAndDefendedStages.attacked;
  }
  // Returns a random number, but always the same for i
  getRandomNumber(i) {
    return this.randomNumbers[Math.round(i) % this.randomNumbers.length];
  }
  attackedAndDefendedStagesCache;
  get attackedAndDefendedStages() {
    if (this.attackedAndDefendedStagesCache)
      return this.attackedAndDefendedStagesCache;
    const attackedStages = [];
    const defendedStages = [];
    let defendedStagesInSection = [];
    this.finalizedActionEvents.forEach((event, i) => {
      const round = Math.floor(i / this.playersInOrder.length);
      if (isActionEventOf(event, "attack")) {
        attackedStages.push(getStageAt(event.position));
      } else if (isActionEventOf(event, "defend")) {
        defendedStages.push(getStageAt(event.position));
        defendedStagesInSection.push(getStageAt(event.position).id);
      }
      if ((i + 1) % (this.playersInOrder.length * 3) === 0 && this.nextEventType !== "reaction") {
        const section = Math.floor(round / 3);
        const globalAttack = this.globalAttackScenario.attacks[section];
        globalAttack.targets.forEach((attackedStage) => {
          if (!defendedStagesInSection.includes(attackedStage.stageId)) {
            const allAvailableStages = BOARD_SUPPLY_CHAINS.flat().filter((stage) => stage.id === attackedStage.stageId).filter(
              (stage) => ![...defendedStages, ...attackedStages].find(
                (s) => isEqual$1(s.coordinate, stage.coordinate)
              )
            );
            if (allAvailableStages.length > 0) {
              attackedStages.push(
                allAvailableStages[Math.floor(allAvailableStages.length * this.getRandomNumber(i))]
              );
            }
          }
        });
        defendedStagesInSection = [];
      }
      const chainAttackCounts = [
        attackedStages.filter((stage) => stage.supplyChainId === 0).length,
        attackedStages.filter((stage) => stage.supplyChainId === 1).length,
        attackedStages.filter((stage) => stage.supplyChainId === 2).length
      ];
      chainAttackCounts.forEach((count, chainId) => {
        if (count >= 3) {
          const otherStages = BOARD_SUPPLY_CHAINS[chainId].filter((stage) => ![...attackedStages, ...defendedStages].includes(stage));
          attackedStages.push(...otherStages);
        }
      });
    });
    return this.attackedAndDefendedStagesCache = {
      attacked: attackedStages,
      defended: defendedStages
    };
  }
  isDefended(position) {
    return !!this.defendedStages.find((stage) => isEqual$1(stage.coordinate, position));
  }
  isAttacked(position) {
    return !!this.attackedStages.find((stage) => isEqual$1(stage.coordinate, position));
  }
  get activeTargetedAttacks() {
    if (this.finalizedPlacementEvents.length < 5)
      return [];
    const attackCount = 3 * (Math.floor(this.currentRound / 3) + 1);
    return this.context.targetedAttacks.slice(0, attackCount).map((attackIndex) => TARGETED_ATTACKS[attackIndex]);
  }
  get activeGlobalAttackIndex() {
    return Math.floor(this.currentRound / 3);
  }
  get activeGlobalAttack() {
    return this.globalAttackScenario.attacks[this.activeGlobalAttackIndex];
  }
  get globalAttackScenario() {
    return GLOBAL_ATTACK_SCENARIOS[this.context.globalAttackScenario];
  }
  /** All targeted attacks for which the user has all required items. */
  get executableAttacks() {
    return this.activeTargetedAttacks.filter(
      (attack) => attack.target.requiredItems.every((item) => this.attackInventory[item] > 0)
    );
  }
  get executableDefenseStages() {
    return STAGES.filter(
      (stage) => stage.defenseItems.every((item) => this.defenseInventory[item] > 0)
    );
  }
  static isReachable(a, b) {
    return a[0] === b[0] && Math.abs(a[1] - b[1]) <= 1 || a[1] === b[1] && Math.abs(a[0] - b[0]) <= 1;
  }
  /** Stages that are reachable by the attacker. */
  get reachableStages() {
    return BOARD_SUPPLY_CHAINS.flat().filter(
      (stage) => GameState.isReachable(stage.coordinate, this.activePlayerPosition)
    );
  }
  /** All stages that are reachable and can be attacked. */
  get attackableStages() {
    return this.reachableStages.filter(
      (stage) => !this.isAttacked(stage.coordinate) && !this.isDefended(stage.coordinate) && this.executableAttacks.find(
        (attack) => attack.target.stageId === stage.id && attack.target.supplyChainId === stage.supplyChainId
      )
    );
  }
  /** Returns the stage of the player position if all required conditions are met. */
  get canDefendStage() {
    const currentStage = findStageAt(this.activePlayerPosition);
    if (!currentStage)
      return false;
    if (this.isAttacked(currentStage.coordinate) || this.isDefended(currentStage.coordinate)) {
      return false;
    }
    return !!this.executableDefenseStages.find((stage) => stage.id === currentStage.id);
  }
  get attackerIsCaught() {
    const lastFinalizedActionEvent = this.finalizedActionEvents.at(-1);
    if (lastFinalizedActionEvent?.action !== "ask-question" || lastFinalizedActionEvent.question !== "is-on-field") {
      return false;
    }
    const lastFinalizedPlayerEvent = this.finalizedPlayerEvents.at(-1);
    if (lastFinalizedPlayerEvent?.type === "reaction" && lastFinalizedPlayerEvent.action === "joker" && lastFinalizedPlayerEvent.useJoker === false && lastFinalizedPlayerEvent.finalized) {
      return isEqual$1(lastFinalizedActionEvent.position, this.playerPositions.attacker);
    }
    return false;
  }
  get score() {
    const section = Math.floor(this.currentRound / 3);
    const attackerCaughtPoints = Math.max(1, 3 - section);
    const attack = this.attackedStages.length;
    const defense = this.defendedStages.length + (this.attackerIsCaught ? attackerCaughtPoints : 0);
    return {
      attack,
      defense
    };
  }
  /**
   * Returns the "active" question, meaning: if the last *finalized* action was
   * an action that requires a reaction.
   *
   * This ignores any attacker movement or actions after.
   */
  get activeQuestion() {
    const lastEvent = this.finalizedActionEvents.filter((event) => event.playerId !== "attacker").at(-1);
    if (lastEvent) {
      if (lastEvent.action === "ask-question")
        return lastEvent.question;
      if (gameEventRequiresReaction(lastEvent)) {
        return lastEvent.action;
      }
    }
    return void 0;
  }
}

export { ATTACKER_REVEAL_ROUNDS as A, COLUMN_COUNT as C, GameState as G, ITEMS as I, NEW_GLOBAL_ATTACK_ROUNDS as N, ROW_COUNT as R, TOTAL_ROUNDS as T, isAttackItemId as a, isItemIdOfSide as b, getItem as g, isDefenseItemId as i };
//# sourceMappingURL=game-state-78587e72.js.map
