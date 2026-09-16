// Maps raw subject strings from any source onto one shared taxonomy so results
// from a dozen different vocabularies can share a single facet.
//
// Matching is whole-word, not substring: the previous system used a substring
// check, so "art" matched "cart", "particle" and "Descartes".

const TAXONOMY = {
  "Science & Technology": [
    "science", "sciences", "physics", "chemistry", "biology", "astronomy", "geology",
    "mathematics", "math", "statistics", "engineering", "technology", "computing",
    "computer", "computers", "informatics", "robotics", "environment", "environmental",
    "climate", "ecology", "agriculture", "energy", "materials",
  ],
  "Health & Medicine": [
    "health", "medicine", "medical", "clinical", "nursing", "public health",
    "epidemiology", "pharmacology", "psychiatry", "anatomy", "physiology",
    "nutrition", "disease", "diseases", "oncology", "pediatrics", "surgery",
  ],
  "Business & Economics": [
    "business", "economics", "economic", "finance", "financial", "management",
    "marketing", "accounting", "trade", "commerce", "entrepreneurship", "labor",
    "labour", "development studies",
  ],
  "History & Geography": [
    "history", "historical", "archaeology", "geography", "anthropology",
    "civilization", "heritage", "genealogy", "cartography",
  ],
  "Education": [
    "education", "educational", "teaching", "pedagogy", "curriculum", "learning",
    "literacy", "schools", "students",
  ],
  "Literature & Language": [
    "literature", "literary", "fiction", "poetry", "drama", "novels", "language",
    "languages", "linguistics", "philology", "rhetoric", "filipino", "translation",
  ],
  "Arts & Culture": [
    "art", "arts", "music", "painting", "sculpture", "photography", "architecture",
    "design", "theatre", "theater", "film", "dance", "culture", "cultural", "museum",
  ],
  "Law & Government": [
    "law", "legal", "jurisprudence", "legislation", "constitution",
    "politics", "political", "government", "governance", "policy", "human rights",
    "public administration",
  ],
  "Philosophy & Religion": [
    "philosophy", "philosophical", "ethics", "logic", "metaphysics", "religion",
    "religious", "theology", "spirituality",
  ],
  "Social Sciences": [
    "sociology", "social", "society", "psychology", "psychological", "demography",
    "population", "gender", "communication", "media studies", "urban studies",
  ],
};

const LOOKUP = buildLookup();

function buildLookup() {
  const lookup = new Map();
  for (const [category, keywords] of Object.entries(TAXONOMY)) {
    for (const keyword of keywords) {
      if (!lookup.has(keyword)) lookup.set(keyword, category);
    }
  }
  return lookup;
}

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

export function categorize(subjects = []) {
  const counts = new Map();

  for (const subject of subjects) {
    if (!subject) continue;
    const normalized = String(subject).toLowerCase().trim();

    // Try the whole phrase first ("public health" beats "health").
    if (LOOKUP.has(normalized)) {
      bump(counts, LOOKUP.get(normalized), 2);
      continue;
    }

    for (const token of tokenize(normalized)) {
      const category = LOOKUP.get(token);
      if (category) bump(counts, category, 1);
    }
  }

  if (counts.size === 0) return "General";

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function bump(counts, key, weight) {
  counts.set(key, (counts.get(key) ?? 0) + weight);
}

export const CATEGORIES = Object.keys(TAXONOMY);
