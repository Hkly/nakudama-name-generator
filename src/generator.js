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

// Special ending only
const specialEndings = ["naku"];

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
  return "naku";
}

// Capitalize final name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Pattern Families ---

const patternFamilies = {
  smooth: [
    (roots = []) => [roots[0] || S(), S()],
    (roots = []) => [roots[0] || S(), roots[1] || S(), S()],
    (roots = []) => [roots[0] || S(), S(), roots[1] || S(), S()],
  ],

  croaky: [
    (roots = []) => [roots[0] || C(), S(), roots[1] || S()],
    (roots = []) => [roots[0] || S(), C(), roots[1] || S()],
    (roots = []) => [roots[0] || S(), roots[1] || S(), C()],
    (roots = []) => [roots[0] || C(), C(), roots[1] || S()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || C()],
    (roots = []) => [roots[0] || S(), C(), roots[1] || C()],
    (roots = []) => [roots[0] || S(), C(), roots[1] || S(), C()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || S(), C()],
    (roots = []) => [roots[0] || C(), C(), roots[1] || S(), S()],
    (roots = []) => [roots[0] || S(), C(), roots[1] || S(), S()],
    (roots = []) => [roots[0] || S(), C(), C(), roots[1] || S()],
    (roots = []) => [roots[0] || S(), roots[1] || S(), C(), C()],
  ],

  simpleRepeating: [
    (roots = []) => {
      const a = roots[0] || C();

      return [a, a];
    },
    (roots = []) => {
      const a = roots[0] || S();
      let b = roots[1] || S();

      while (a === b) {
        b = S();
      }

      return [a, b, a, b];
    }
  ],

  clusterRepeating: [
    // one cluster, one simple
    (roots = []) => {
      const a = roots[0] || C();
      let b = roots[1] || S();
      while (a === b) b = S();

      return [a, b, a, b];
    },
    (roots = []) => {
      const a = roots[0] || S();
      let b = roots[1] || C();
      while (a === b) b = C();

      return [a, b, a, b];
    },
    // both clusters
    (roots = []) => {
      const a = roots[0] || C();
      let b = roots[1] || C();
      while (a === b) b = C();
      return [a, b, a, b];
    },
  ],

  ancientLong: [
    (roots = []) => [roots[0] || C(), S(), roots[1] || C(), S(), S()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || C(), S(), C()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || S(), C(), C()],
    (roots = []) => [roots[0] || C(), C(), roots[1] || S(), S(), S()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || C(), S(), NAKU()],
    (roots = []) => [roots[0] || C(), S(), roots[1] || C(), C(), NAKU()],
  ],

  nakuEnding: [
    (roots = []) => [roots[0] || S(), roots[1] || S(), NAKU()],
    (roots = []) => [roots[0] || C(), roots[1] || S(), NAKU()],
    (roots = []) => [roots[0] || S(), roots[1] || C(), NAKU()],
    (roots = []) => [roots[0] || C(), roots[1] || C(), NAKU()],
    (roots = []) => [roots[0] || S(), roots[1] || S(), S(), NAKU()],
    (roots = []) => [roots[0] || C(), roots[1] || S(), S(), NAKU()],
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
    simpleRepeating: 5,
    clusterRepeating: 15,
    nakuEnding: 35
  },
  ancient: {
    smooth: 5,
    croaky: 40,
    simpleRepeating: 0,
    clusterRepeating: 20,
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

function generateName(mode) {
  const familyName = chooseFamily(mode);
  const family = patternFamilies[familyName];
  const pattern = rand(family);
  const syllables = pattern();
  const name = syllablesToName(syllables);

  if (!name) {
    return generateName(mode);
  }

  return name;
}
export function generateNames(count = 8, mode = "modern") {
  const names = new Set();
  while (names.size < count) {
    names.add(generateName(mode));
  }
  return [...names];
}

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
  const base = baseSyllables.join("");

  // Avoid sacred word
  if (base.includes("dama")) {
    return generateBase();
  }

  return {
    base,
    syllables: baseSyllables,
  };
}

function buildVariantFromBase(rootSyllables, mode) {
  const family = patternFamilies[chooseFamily(mode)];
  const pattern = rand(family);
  const rootA = rootSyllables[0] || S();
  const rootB = rootSyllables[rootSyllables.length - 1] || rootA;
  const syllables = pattern([rootA, rootB]);
  return syllablesToName(syllables);
}

export function generateNameset() {
  const { syllables: rootSyllables } = generateBase();

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
