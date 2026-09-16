import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "pmc",
  label: "PubMed Central",
  fullName: "PubMed Central (NIH/NLM)",
  homepage: "https://pmc.ncbi.nlm.nih.gov",
  description: "Free full-text biomedical and life sciences literature from the US National Library of Medicine.",
};

export function isAvailable() {
  return true; // key optional, raises rate limit only
}

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export async function search(query, { limit = 12 } = {}) {
  const searchUrl = buildUrl(`${EUTILS}/esearch.fcgi`, {
    db: "pmc",
    term: query,
    retmode: "json",
    retmax: limit,
    // PMC's open access subset is the part that is genuinely reusable, but the
    // whole of PMC is free to read, which is what matters to a reader.
    api_key: process.env.NCBI_API_KEY,
  });

  const ids = (await fetchJson(searchUrl))?.esearchresult?.idlist ?? [];
  if (ids.length === 0) return [];

  const summaryUrl = buildUrl(`${EUTILS}/esummary.fcgi`, {
    db: "pmc",
    id: ids.join(","),
    retmode: "json",
    api_key: process.env.NCBI_API_KEY,
  });

  const result = (await fetchJson(summaryUrl))?.result ?? {};
  return ids.map((id) => normalize(result[id], id)).filter(Boolean);
}

function normalize(record, id) {
  if (!record?.title) return null;

  const subjects = record.fulljournalname ? [record.fulljournalname] : [];

  return {
    id: `pmc:${id}`,
    title: stripTags(record.title),
    authors: (record.authors ?? []).map((a) => a.name).filter(Boolean),
    year: yearOf(record.pubdate),
    publisher: record.fulljournalname ?? null,
    format: "Journal article",
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: "Free full text in PubMed Central.",
    coverUrl: null,
    subjects,
    category: categorize(subjects.concat("medicine")),
    doi: record.articleids?.find((a) => a.idtype === "doi")?.value ?? null,
    url: `https://pmc.ncbi.nlm.nih.gov/articles/PMC${id}/`,
  };
}

function stripTags(text) {
  return String(text).replace(/<[^>]*>/g, "").trim();
}

function yearOf(pubdate) {
  const match = String(pubdate ?? "").match(/\d{4}/);
  return match ? Number(match[0]) : null;
}
