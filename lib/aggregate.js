import { sources } from "./sources/index.js";
import { ACCESS } from "./access.js";
import { curatedLinks, buildSearchUrl } from "../data/curatedLinks.js";

export async function aggregate(query, { limit = 12 } = {}) {
  const started = Date.now();
  const active = sources.filter((source) => source.isAvailable());

  const settled = await Promise.allSettled(
    active.map(async (source) => {
      const sourceStarted = Date.now();
      const results = await source.search(query, { limit });
      return { meta: source.meta, results, ms: Date.now() - sourceStarted };
    })
  );

  const collected = [];
  const status = [];

  active.forEach((source, index) => {
    const outcome = settled[index];

    if (outcome.status === "fulfilled") {
      collected.push(...outcome.value.results);
      status.push({
        key: source.meta.key,
        label: source.meta.label,
        count: outcome.value.results.length,
        ms: outcome.value.ms,
        ok: true,
      });
    } else {
      // One source failing must never take down the whole search.
      status.push({
        key: source.meta.key,
        label: source.meta.label,
        count: 0,
        ok: false,
        error: describeError(outcome.reason),
      });
    }
  });

  // Sources that need a key we do not have are reported too, so the gap is
  // visible instead of silently missing.
  for (const source of sources) {
    if (!source.isAvailable()) {
      status.push({
        key: source.meta.key,
        label: source.meta.label,
        count: 0,
        ok: false,
        skipped: true,
        error: "Not configured on this deployment.",
      });
    }
  }

  const merged = sortResults(dedupe(collected.map((result) => score(result, query))));

  return {
    query,
    results: merged,
    facets: buildFacets(merged),
    portals: matchPortals(query),
    sources: status,
    tookMs: Date.now() - started,
  };
}

function describeError(reason) {
  const message = reason?.message ?? String(reason);
  if (reason?.name === "AbortError" || /abort/i.test(message)) {
    return "Timed out.";
  }
  return message;
}

// --- relevance -------------------------------------------------------------

export function score(result, query) {
  const title = result.title.toLowerCase();
  const needle = query.toLowerCase().trim();
  const terms = needle.split(/\s+/).filter(Boolean);

  let relevance = 0;

  if (title === needle) relevance += 100;
  else if (title.startsWith(needle)) relevance += 60;
  else if (title.includes(needle)) relevance += 35;

  const matchedTerms = terms.filter((term) => title.includes(term)).length;
  relevance += (matchedTerms / Math.max(terms.length, 1)) * 25;

  const authors = result.authors.join(" ").toLowerCase();
  if (terms.some((term) => authors.includes(term))) relevance += 10;

  if (result.coverUrl) relevance += 2;

  return { ...result, relevance: Math.round(relevance * 10) / 10 };
}

const ACCESS_RANK = { [ACCESS.OPEN]: 0, [ACCESS.PARTIAL]: 1, [ACCESS.METADATA]: 2 };

// Readability comes first, textual relevance second. A catalogue whose whole
// promise is open access should not lead with three records nobody can open,
// however well their titles happen to match.
export function sortResults(results) {
  return [...results].sort((a, b) => {
    const tier = (ACCESS_RANK[a.access] ?? 2) - (ACCESS_RANK[b.access] ?? 2);
    if (tier !== 0) return tier;
    return b.relevance - a.relevance;
  });
}

// --- dedupe ----------------------------------------------------------------

function fingerprint(result) {
  const title = result.title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  const author = (result.authors[0] ?? "").toLowerCase().trim();
  return `${title}::${author}`;
}

export function dedupe(results) {
  const byKey = new Map();

  for (const result of results) {
    const key = result.doi ? `doi:${result.doi.toLowerCase()}` : fingerprint(result);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, { ...result, alsoIn: [] });
      continue;
    }

    // Keep the better record, but remember everywhere else it was found.
    const [keep, drop] =
      result.relevance > existing.relevance ? [result, existing] : [existing, result];

    const alsoIn = new Set([
      ...(existing.alsoIn ?? []),
      ...(result.alsoIn ?? []),
      drop.sourceLabel,
    ]);
    alsoIn.delete(keep.sourceLabel);

    byKey.set(key, {
      ...keep,
      coverUrl: keep.coverUrl ?? drop.coverUrl,
      doi: keep.doi ?? drop.doi,
      alsoIn: [...alsoIn],
    });
  }

  return [...byKey.values()];
}

// --- facets ----------------------------------------------------------------

function buildFacets(results) {
  return {
    source: tally(results, (r) => r.sourceLabel),
    category: tally(results, (r) => r.category),
    format: tally(results, (r) => r.format),
    access: tally(results, (r) => r.access),
  };
}

function tally(results, pick) {
  const counts = new Map();
  for (const result of results) {
    const key = pick(result);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

// --- curated portals -------------------------------------------------------

// Surface a whole collection when the query looks like it is about that
// collection's subject, or names the portal itself.
function matchPortals(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return curatedLinks
    .map((link) => {
      const haystack = [link.title, link.description, ...link.tags]
        .join(" ")
        .toLowerCase();
      const hits = terms.filter((term) => haystack.includes(term)).length;
      return { link, hits };
    })
    .filter(({ hits }) => hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 4)
    .map(({ link }) => ({ ...link, searchUrl: buildSearchUrl(link, query) }));
}
