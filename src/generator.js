const simpleSyllables = [
  "ma", "mo", "mu",
  "na", "no", "nu",
  "ra", "ro", "ru",
  "ka", "ko", "ku",
  "ga", "go", "gu",
  "ba", "bo", "bu",
  "sa", "so", "su",
  "ta", "to", "tu",
  "da", "do", "du",
];

const clusterSyllables = [
  "kra", "kro", "kru",
  "gra", "gro", "gru",
  "bra", "bro", "bru",
];

const endings = [
  "na", "no", "ra", "ro", "mo", "bu", "ku", "ru", "du", "do", "naku",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function S() { return pick(simpleSyllables); }
function C() { return pick(clusterSyllables); }
function E() { return pick(endings); }

// Patterns: each returns an array of syllable strings
const patterns = [
  () => [S(), E()],
  () => [S(), E()],                   // weighted double: 2-syl is common
  () => [S(), S(), E()],
  () => [S(), S(), E()],              // weighted double: 3-syl is common
  () => [C(), S(), E()],
  () => [S(), C(), E()],
  () => [S(), S(), S(), E()],
  () => { const a = S(); const b = S(); return [a, b, a, b]; }, // full repeat
  () => { const a = S(); const b = S(); return [a, b, a, b]; }, // weighted double
];

function containsDama(syllables) {
  return syllables.join('').includes('dama');
}

export function generateName() {
  let syllables;
  let attempts = 0;

  do {
    const pattern = pick(patterns);
    syllables = pattern();

    // "naku" as ending requires at least 3 syllables total
    const joined = syllables.join('');
    if (joined === 'naku') { continue; }
    if (joined.endsWith('naku') && syllables.length < 3) { continue; }

    attempts++;
  } while (containsDama(syllables) && attempts < 20);

  // Occasionally duplicate a 2-syllable result (outside of patterns) for extra repetition
  if (syllables.length === 2 && Math.random() < 0.25) {
    syllables = [...syllables, ...syllables];
  }

  // Capitalize: first letter, and first letter of the repeated half if applicable
  const isRepeat = syllables.length === 4 &&
    syllables[0] === syllables[2] &&
    syllables[1] === syllables[3];

  if (isRepeat) {
    const half = syllables.slice(0, 2).join('');
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    return cap(half) + cap(half);
  }

  const raw = syllables.join('');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function generateNames(count = 8) {
  return Array.from({ length: count }, generateName);
}
