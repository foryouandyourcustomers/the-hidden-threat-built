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

export { ITEMS as I, isAttackItemId as a, isItemIdOfSide as b, getItem as g, isDefenseItemId as i };
//# sourceMappingURL=items-4883f019.js.map
