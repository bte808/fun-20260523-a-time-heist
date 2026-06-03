export const runDate = "2026-05-23";
export const defaultShareUrl = "https://bte808.github.io/fun-20260523-a-time-heist/";

export const cases = [
  {
    id: "gallery-lights",
    title: "Gallery Lights Went Out",
    brief:
      "Six stolen display pieces reappeared in one cabinet. Rebuild the cabinet from earliest to latest before the audit bell rings.",
    clues: [
      "Coral Key is the oldest piece; Echo Crown is the newest piece.",
      "Brass Compass belongs before Glass Lotus.",
      "Static Lantern belongs after Glass Lotus and before Moon Ticket.",
      "Moon Ticket sits immediately before Echo Crown."
    ],
    artifacts: [
      {
        id: "coral-key",
        name: "Coral Key",
        tag: "salt mark",
        rank: 10,
        hue: "#f05d42",
        motif: "key"
      },
      {
        id: "brass-compass",
        name: "Brass Compass",
        tag: "north scar",
        rank: 20,
        hue: "#d9a21b",
        motif: "compass"
      },
      {
        id: "glass-lotus",
        name: "Glass Lotus",
        tag: "petal code",
        rank: 30,
        hue: "#2c9a7a",
        motif: "lotus"
      },
      {
        id: "static-lantern",
        name: "Static Lantern",
        tag: "hum line",
        rank: 40,
        hue: "#7b55c8",
        motif: "lantern"
      },
      {
        id: "moon-ticket",
        name: "Moon Ticket",
        tag: "silver fare",
        rank: 50,
        hue: "#3d8bd8",
        motif: "ticket"
      },
      {
        id: "echo-crown",
        name: "Echo Crown",
        tag: "last chime",
        rank: 60,
        hue: "#d44f7c",
        motif: "crown"
      }
    ]
  },
  {
    id: "vault-rain",
    title: "Rain in the Clock Vault",
    brief:
      "The archive sprinkler shuffled a shelf of contraband time stamps. Put the tags back before the ink dries.",
    clues: [
      "Seed Dial opens the shelf; Sun Lens closes it.",
      "Velvet Mask happened before Map Tile.",
      "Pocket Engine sits immediately after Map Tile.",
      "Relay Drone happened after Pocket Engine and before Sun Lens."
    ],
    artifacts: [
      {
        id: "seed-dial",
        name: "Seed Dial",
        tag: "sprout notch",
        rank: 10,
        hue: "#5ca446",
        motif: "dial"
      },
      {
        id: "velvet-mask",
        name: "Velvet Mask",
        tag: "quiet seam",
        rank: 20,
        hue: "#784bc4",
        motif: "mask"
      },
      {
        id: "map-tile",
        name: "Map Tile",
        tag: "fold grid",
        rank: 30,
        hue: "#e07a3f",
        motif: "tile"
      },
      {
        id: "pocket-engine",
        name: "Pocket Engine",
        tag: "warm gear",
        rank: 40,
        hue: "#c99a18",
        motif: "engine"
      },
      {
        id: "relay-drone",
        name: "Relay Drone",
        tag: "blue ping",
        rank: 50,
        hue: "#2f8fc9",
        motif: "drone"
      },
      {
        id: "sun-lens",
        name: "Sun Lens",
        tag: "bright rim",
        rank: 60,
        hue: "#f05d42",
        motif: "lens"
      }
    ]
  },
  {
    id: "roof-auction",
    title: "Rooftop Auction Loop",
    brief:
      "A pop-up auction keeps repeating the same minute. Sort the six bids so the loop can finally end.",
    clues: [
      "Bell Token is the first bid; Neon Beacon is the last bid.",
      "Cipher Card was shown before Needle Jar.",
      "Porcelain Vase was sold immediately after Needle Jar.",
      "Battery Pearl happened after Porcelain Vase and before Neon Beacon."
    ],
    artifacts: [
      {
        id: "bell-token",
        name: "Bell Token",
        tag: "first ring",
        rank: 10,
        hue: "#cf8a1e",
        motif: "bell"
      },
      {
        id: "cipher-card",
        name: "Cipher Card",
        tag: "ink lock",
        rank: 20,
        hue: "#3b9b8f",
        motif: "card"
      },
      {
        id: "needle-jar",
        name: "Needle Jar",
        tag: "thin glass",
        rank: 30,
        hue: "#7867ce",
        motif: "jar"
      },
      {
        id: "porcelain-vase",
        name: "Porcelain Vase",
        tag: "blue crack",
        rank: 40,
        hue: "#2d89cf",
        motif: "vase"
      },
      {
        id: "battery-pearl",
        name: "Battery Pearl",
        tag: "soft spark",
        rank: 50,
        hue: "#d34d75",
        motif: "pearl"
      },
      {
        id: "neon-beacon",
        name: "Neon Beacon",
        tag: "last pulse",
        rank: 60,
        hue: "#e25c43",
        motif: "beacon"
      }
    ]
  }
];

export function orderedArtifacts(caseFile) {
  return [...caseFile.artifacts].sort((left, right) => left.rank - right.rank);
}

export function getArtifact(caseFile, artifactId) {
  const artifact = caseFile.artifacts.find((item) => item.id === artifactId);
  if (!artifact) {
    throw new Error(`Unknown artifact id: ${artifactId}`);
  }
  return artifact;
}

export function buildInitialOrder(caseFile, seed = runDate) {
  const ids = orderedArtifacts(caseFile).map((artifact) => artifact.id);
  const shuffled = [...ids];
  let hash = hashSeed(buildCaseSeed(caseFile, seed));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const swapIndex = hash % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.join("|") === ids.join("|") ? shuffled.reverse() : shuffled;
}

export function normalizeSeed(value = runDate) {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return normalized || runDate;
}

export function buildCaseSeed(caseFile, seed = runDate) {
  return `${normalizeSeed(seed)}:${caseFile.id}`;
}

function hashSeed(value) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

export function moveItem(order, fromIndex, toIndex) {
  if (fromIndex === toIndex) {
    return [...order];
  }
  if (fromIndex < 0 || fromIndex >= order.length || toIndex < 0 || toIndex >= order.length) {
    return [...order];
  }
  const next = [...order];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function swapItems(order, firstId, secondId) {
  const firstIndex = order.indexOf(firstId);
  const secondIndex = order.indexOf(secondId);
  if (firstIndex < 0 || secondIndex < 0 || firstIndex === secondIndex) {
    return [...order];
  }
  const next = [...order];
  next[firstIndex] = secondId;
  next[secondIndex] = firstId;
  return next;
}

export function evaluateOrder(caseFile, order, moves = 0, elapsedSeconds = 0) {
  const answer = orderedArtifacts(caseFile).map((artifact) => artifact.id);
  const answerPositions = new Map(answer.map((id, index) => [id, index]));
  const feedback = order.map((id, index) => {
    const answerIndex = answerPositions.get(id);
    const distance = Math.abs(answerIndex - index);
    return {
      id,
      slot: index,
      answerSlot: answerIndex,
      state: distance === 0 ? "exact" : distance === 1 ? "near" : "off"
    };
  });
  const exact = feedback.filter((item) => item.state === "exact").length;
  const near = feedback.filter((item) => item.state === "near").length;
  const solved = exact === answer.length;
  const base = exact * 120 + near * 35 + (solved ? 200 : 0);
  const penalty = Math.min(160, moves * 3 + Math.floor(elapsedSeconds / 6));
  const score = Math.max(0, base - penalty);

  return {
    answer,
    exact,
    near,
    off: answer.length - exact - near,
    feedback,
    solved,
    score
  };
}

export function buildReplayUrl(baseUrl, seed = runDate) {
  const url = new URL(baseUrl);
  url.searchParams.set("seed", normalizeSeed(seed));
  url.hash = "";
  return url.toString();
}

export function buildShareText(results, options = {}) {
  const { seed = runDate, replayUrl = defaultShareUrl } = options;
  const normalizedSeed = normalizeSeed(seed);
  const total = results.reduce((sum, result) => sum + result.score, 0);
  const solved = results.filter((result) => result.solved).length;
  const marks = results
    .map((result) => (result.solved ? "OK" : `${result.exact}/6`))
    .join(" ");
  return `Time Heist Shuffle ${runDate}\n${solved}/3 cases solved, ${total} pts\n${marks}\nSeed: ${normalizedSeed}\nReplay: ${replayUrl}`;
}
