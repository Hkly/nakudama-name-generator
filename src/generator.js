// --- Syllable Pools ---

const simpleSyllables = [
  "ma","mo","mu",
  "na","no","nu",
  "ra","ro","ru",
  "ka","ko","ku",
  "ga","go","gu",
  "ba","bo","bu",
  "sa","so","su",
  "ta","to","tu",
  "da","do","du" // testing D sounds
];

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

function S() {
  return rand(simpleSyllables);
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

  repeating: [
    () => {
      let a = S();
      let b = S();

      while (a === b) {
        b = S();
      }

      return [a, b, a, b];
    }
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
  { name: "repeating", weight: 20 },
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

  // Special capitalization for repeating names
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
