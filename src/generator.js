// --- Sound Weights (tune these to control consonant frequency) ---

const soundWeights = [
  { sound: "r", weight: 30 },
  { sound: "g", weight: 20 },
  { sound: "k", weight: 15 },
  { sound: "b", weight: 15 },
  { sound: "m", weight: 10 },
  { sound: "n", weight: 10 },
  { sound: "s", weight: 7 },
  { sound: "t", weight: 7 },
  { sound: "d", weight: 4 },
];

// --- Syllable Pools ---

const vowels = ["a", "o", "u"];

const clusterSyllables = [
  "kra","kro","kru",
  "gra","gro","gru",
  "bra","bro","bru"
];

// Special ending pool used by ending-heavy patterns
const specialEndings = ["naku", "muru", "raku", "kura"];

// --- Helpers ---

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedSound() {
  const total = soundWeights.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * total;
  for (const s of soundWeights) {
    if (r < s.weight) return s.sound;
    r -= s.weight;
  }
}

function S() {
  return weightedSound() + rand(vowels);
}

function C() {
  return rand(clusterSyllables);
}

function NAKU() {
  return rand(specialEndings);
}

// Capitalize final name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Pattern Families ---

const patternFamilies = {
  smooth: [
    ([rootA, rootB]) => [rootA, S()],
    ([rootA, rootB]) => [rootA, rootB],
    ([rootA, rootB]) => [rootA, rootB, S()],
    ([rootA, rootB]) => [rootA, S(), rootB, S()],
    ([rootA, rootB]) => [rootA, rootB, S(), S()],
    // Root appears later (less common than root-first forms)
    ([rootA, rootB]) => [S(), rootA, rootB],
    ([rootA, rootB]) => [S(), S(), rootA, rootB],
    ([rootA, rootB]) => [S(), rootA, rootB, S()],
    ([rootA, rootB]) => [S(), S(), rootA, rootB],
  ],

  croaky: [
    ([rootA, rootB]) => [rootA, S(), rootB],
    ([rootA, rootB]) => [rootA, C(), rootB],
    ([rootA, rootB]) => [rootA, rootB, C()],
    ([rootA, rootB]) => [rootA, C(), rootB],
    ([rootA, rootB]) => [rootA, S(), rootB, C()],
    ([rootA, rootB]) => [rootA, C(), rootB, C()],
    ([rootA, rootB]) => [rootA, C(), rootB, C()],
    ([rootA, rootB]) => [rootA, S(), rootB, C()],
    ([rootA, rootB]) => [rootA, C(), rootB, S()],
    ([rootA, rootB]) => [rootA, C(), rootB, S()],
    ([rootA, rootB]) => [rootA, C(), C(), rootB],
    ([rootA, rootB]) => [rootA, rootB, C(), C()],
    // Root-later croaky openings
    ([rootA, rootB]) => [C(), rootA, rootB],
    ([rootA, rootB]) => [S(), C(), rootA, rootB],
    ([rootA, rootB]) => [C(), S(), C(), rootA, rootB],
    ([rootA, rootB]) => [C(), rootA, rootB, C()],
  ],

  simpleRepeating: [
    ([rootA]) => {
      return [rootA, rootA];
    },
    ([rootA, rootB]) => {
      let b = rootB;

      while (rootA === b) {
        b = S();
      }

      return [rootA, b, rootA, b];
    }
  ],

  clusterRepeating: [
    // one cluster, one simple
    ([rootA, rootB]) => {
      let b = rootB;
      while (rootA === b) b = S();

      return [rootA, b, rootA, b];
    },
    ([rootA, rootB]) => {
      let b = rootB;
      while (rootA === b) b = C();

      return [rootA, b, rootA, b];
    },
    // both clusters
    ([rootA, rootB]) => {
      let b = rootB;
      while (rootA === b) b = C();
      return [rootA, b, rootA, b];
    },
  ],

  ancientLong: [
    ([rootA, rootB]) => [rootA, S(), rootB, S(), S()],
    ([rootA, rootB]) => [rootA, S(), rootB, S(), C()],
    ([rootA, rootB]) => [rootA, S(), rootB, C(), C()],
    ([rootA, rootB]) => [rootA, C(), rootB, S(), S()],
    ([rootA, rootB]) => [rootA, S(), rootB, S(), NAKU()],
    ([rootA, rootB]) => [rootA, S(), rootB, C(), NAKU()],
    // Ancient variants where root enters mid-word
    ([rootA, rootB]) => [C(), S(), rootA, rootB, NAKU()],
    ([rootA, rootB]) => [C(), C(), S(), rootA, rootB],
    ([rootA, rootB]) => [C(), rootA, rootB, S(), NAKU()],
  ],

  nakuEnding: [
    ([rootA, rootB]) => [rootA, rootB, NAKU()],
    ([rootA, rootB]) => [rootA, S(), rootB, NAKU()],
    ([rootA, rootB]) => [rootA, rootB, C(), NAKU()],
    ([rootA, rootB]) => [C(), rootA, rootB, NAKU()],
    ([rootA, rootB]) => [rootA, rootB, S(), NAKU()],
    ([rootA, rootB]) => [rootA, C(), rootB, S(), NAKU()],
    // Root-later + ending variants
    ([rootA, rootB]) => [S(), rootA, rootB, NAKU()],
    ([rootA, rootB]) => [C(), S(), rootA, rootB, NAKU()],
  ]
};

// --- Weights (tune these for vibe) ---
const modes = {
  any: {
    smooth: 20,
    croaky: 20,
    simpleRepeating: 20,
    clusterRepeating: 20,
    nakuEnding: 20,
    ancientLong: 20
  },
  child: {
    smooth: 25,
    croaky: 5,
    simpleRepeating: 65,
    clusterRepeating: 15,
    nakuEnding: 0
  },
  modern: {
    smooth: 30,
    croaky: 30,
    simpleRepeating: 25,
    clusterRepeating: 5,
    nakuEnding: 10
  },
  formal: {
    smooth: 10,
    croaky: 35,
    simpleRepeating: 0,
    clusterRepeating: 0,
    nakuEnding: 35
  },
  ancient: {
    smooth: 5,
    croaky: 40,
    simpleRepeating: 0,
    clusterRepeating: 0,
    nakuEnding: 35,
    ancientLong: 30
  }
};

function chooseFamily(mode) {
  const weights = modes[mode];
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;

  for (const [name, weight] of entries) {
    if (r < weight) return name;
    r -= weight;
  }
}

function syllablesToName(syllables) {
  const name = syllables.join("");

  if (name.includes("dama")) {
    return null;
  }

  const isRepeat =
    syllables.length === 4 &&
    syllables[0] === syllables[2] &&
    syllables[1] === syllables[3];

  if (isRepeat) {
    const half = syllables.slice(0, 2).join("");
    return capitalize(half) + capitalize(half);
  }

  return capitalize(name);
}

// --- Name Generator ---

function generateBase() {
  // Generate 2-3 syllables as a base
  const baseFamilies = [
    () => {
      let a = C();
      let b = S();
      return [a, b];
    },
    () => {
      let a = S();
      let b = S();
      return [a, b];
    },
    () => {
      let a = C();
      let b = S();
      let c = S();
      return [a, b, c];
    },
  ];

  const pattern = rand(baseFamilies);
  const baseSyllables = pattern();
  const [rootA, ...rest] = baseSyllables;
  const rootB = rest[rest.length - 1] || rootA;
  const base = [rootA, rootB].join("");

  // Avoid sacred word
  if (base.includes("dama")) {
    return generateBase();
  }

  return [rootA, rootB];
}

function buildVariantFromBase(rootSyllables, mode) {
  const family = patternFamilies[chooseFamily(mode)];
  const pattern = rand(family);
  const syllables = pattern(rootSyllables);
  return syllablesToName(syllables);
}

export function generateNameset() {
  const rootSyllables = generateBase();

  let childName = null;
  let everydayName = null;
  let formalName = null;
  let ancientName = null;

  while (!childName) childName = buildVariantFromBase(rootSyllables, "child");
  while (!everydayName) everydayName = buildVariantFromBase(rootSyllables, "modern");
  while (!formalName) formalName = buildVariantFromBase(rootSyllables, "formal");
  while (!ancientName) ancientName = buildVariantFromBase(rootSyllables, "ancient");

  return {
    child: childName,
    everyday: everydayName,
    formal: formalName,
    ancient: ancientName,
    // Store which field to display for "any" mode - chosen once per nameset
    anyModeField: rand(["child", "everyday", "formal", "ancient"])
  };
}


export function generateNamesets(count = 8) {
  const sets = [];
  const seenChild = new Set();

  while (sets.length < count) {
    const nameset = generateNameset();
    // Avoid duplicates based on child name
    if (!seenChild.has(nameset.child)) {
      seenChild.add(nameset.child);
      sets.push(nameset);
    }
  }

  return sets;
}
