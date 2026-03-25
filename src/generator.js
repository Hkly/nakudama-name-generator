const CONSONANTS = ['k', 'n', 'm', 'r', 's', 'h', 'b', 'p', 't', 'd'];
const VOWELS = ['a', 'o', 'u', 'a', 'o', 'u', 'i']; // i appears less often
const CLUSTERS = ['kr', 'gr', 'br'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeSyllable(useCluster = false) {
  const onset = useCluster ? pick(CLUSTERS) : pick(CONSONANTS);
  return onset + pick(VOWELS);
}

export function generateName() {
  const totalSyllables = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4

  // Determine special ending
  let specialEnding = null;
  const roll = Math.random();
  if (roll < 0.2) {
    specialEnding = 'na';
  } else if (roll < 0.35 && totalSyllables >= 3) {
    // "naku" ending occupies 2 syllable slots, so requires at least 3 total
    specialEnding = 'naku';
  }

  const endingSlots = specialEnding === 'naku' ? 2 : specialEnding === 'na' ? 1 : 0;
  const freeSlots = totalSyllables - endingSlots;

  // 0, 1, or 2 clusters among the free syllables
  const numClusters = Math.random() < 0.35 ? (Math.random() < 0.6 ? 1 : 2) : 0;

  // Pick cluster positions, no two clusters adjacent
  const clusterPositions = new Set();
  let attempts = 0;
  while (clusterPositions.size < numClusters && attempts < 50) {
    const pos = Math.floor(Math.random() * freeSlots);
    if (!clusterPositions.has(pos - 1) && !clusterPositions.has(pos + 1)) {
      clusterPositions.add(pos);
    }
    attempts++;
  }

  // Build the name
  const parts = [];
  for (let i = 0; i < freeSlots; i++) {
    parts.push(makeSyllable(clusterPositions.has(i)));
  }

  if (specialEnding === 'naku') {
    parts.push('na', 'ku');
  } else if (specialEnding === 'na') {
    parts.push('na');
  }

  const raw = parts.join('');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function generateNames(count = 8) {
  return Array.from({ length: count }, generateName);
}
