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
    () => [S(), S()],
    () => [S(), S(), S()],
    () => [S(), S(), S(), S()],
  ],

  croaky: [
    () => [C(), S(), S()],
    () => [S(), C(), S()],
    () => [S(), S(), C()],
    () => [C(), C(), S()],
    () => [C(), S(), C()],
    () => [S(), C(), C()],
    () => [S(), C(), S(), C()],
    () => [C(), S(), S(), C()],
    () => [C(), C(), S(), S()],
    () => [S(), C(), S(), S()],
    () => [S(), C(), C(), S()],
    () => [S(), S(), C(), C()],
  ],

  simpleRepeating: [
    () => {
      let a = C();

      return [a, a];
    },
    () => {
      let a = S();
      let b = S();

      while (a === b) {
        b = S();
      }

      return [a, b, a, b];
    }
  ],

  clusterRepeating: [
    // one cluster, one simple
    () => {
      let a = C();
      let b = S();

      return [a, b, a, b];
    },
    () => {
      let a = S();
      let b = C();

      return [a, b, a, b];
    },
    // both clusters
    () => {
      let a = C();
      let b = C();
      while (a === b) b = C();
      return [a, b, a, b];
    },
  ],

  ancientLong: [
    () => [C(), S(), C(), S(), S()],
    () => [C(), S(), C(), S(), C()],
    () => [C(), S(), S(), C(), C()],
    () => [C(), C(), S(), S(), S()],
    () => [C(), S(), C(), S(), NAKU()],
    () => [C(), S(), C(), C(), NAKU()],
  ],

  nakuEnding: [
    () => [S(), S(), NAKU()],
    () => [C(), S(), NAKU()],
    () => [S(), C(), NAKU()],
    () => [C(), C(), NAKU()],
    () => [S(), S(), S(), NAKU()],
    () => [C(), S(), S(), NAKU()],
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

// --- Name Generator ---

function generateName(mode) {
  const familyName = chooseFamily(mode);
  const family = patternFamilies[familyName];
  const pattern = rand(family);
  let syllables = pattern();

  let name = syllables.join("");

  // Avoid sacred word "dama"
  if (name.includes("dama")) {
    return generateName(mode);
  }

  // Special capitalization for repeating names (simpleRepeating / clusterRepeating)
  const isRepeat =
    syllables.length === 4 &&
    syllables[0] === syllables[2] &&
    syllables[1] === syllables[3];

  if (isRepeat) {
    const half = syllables.slice(0, 2).join('');
    return capitalize(half) + capitalize(half);
  }

  return capitalize(name);
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
  let base = pattern().join("");

  // Avoid sacred word
  if (base.includes("dama")) {
    return generateBase();
  }

  // Make sure it's a valid base (at least has content)
  return base;
}

export function generateNameset() {
  // Generate a base to work from
  const base = generateBase();
  const baseLower = base.toLowerCase();

  // Child name: repeating (KoroKoro style)
  const childName = base + base;

  // Everyday name: base + modified syllable ending
  const everydayEndings = [
    () => {
      const endings = ["bu", "ru", "mu", "nu", "gu", "du"];
      return baseLower + rand(endings);
    },
    () => {
      const s = S();
      return baseLower + s;
    }
  ];
  const everydayName = capitalize(rand(everydayEndings)());

  // Formal name: base + naku
  const formalName = capitalize(baseLower + "naku");

  // Ancient name: longer, more complex recombination
  const ancientPatterns = [
    () => {
      // Recombine syllables
      const syllables = [C(), baseLower.charAt(0), baseLower.slice(1), C(), S()];
      return syllables.join("");
    },
    () => {
      const syllables = [C(), S(), baseLower, C(), S()];
      return syllables.join("");
    },
    () => {
      const syllables = [baseLower, C(), S(), S()];
      return syllables.join("");
    },
    () => {
      const syllables = [C(), C(), baseLower, S(), S()];
      return syllables.join("");
    }
  ];
  const ancientName = capitalize(rand(ancientPatterns)());

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
