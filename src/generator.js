// --- Sound Weights (tune these to control consonant frequency) ---

const soundWeights = [
  { sound: "r", weight: 20 },
  { sound: "g", weight: 18 },
  { sound: "k", weight: 15 },
  { sound: "b", weight: 15 },
  { sound: "m", weight: 10 },
  { sound: "n", weight: 10 },
  { sound: "s", weight: 10 },
  { sound: "t", weight: 10 },
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
      while (a === b) b = S();
      return [a, b, a, b];
    },
    () => {
      let a = S();
      let b = C();
      while (a === b) b = C();
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
const familyWeights = [
  { name: "smooth", weight: 35 },
  { name: "croaky", weight: 35 },
  { name: "simpleRepeating", weight: 12 },
  { name: "clusterRepeating", weight: 8 },
  { name: "nakuEnding", weight: 10 }
];

function chooseFamily() {
  const total = familyWeights.reduce((sum, f) => sum + f.weight, 0);
  let r = Math.random() * total;

  for (const f of familyWeights) {
    if (r < f.weight) return f.name;
    r -= f.weight;
  }
}

// --- Name Generator ---

function generateName() {
  const familyName = chooseFamily();
  const family = patternFamilies[familyName];
  const pattern = rand(family);
  let syllables = pattern();

  let name = syllables.join("");

  // Avoid sacred word "dama"
  if (name.includes("dama")) {
    return generateName();
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
export function generateNames(count = 8) {
  return Array.from({ length: count }, generateName);
}
