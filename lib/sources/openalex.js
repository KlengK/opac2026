import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "openalex",
  label: "OpenAlex",
  fullName: "OpenAlex",
  homepage: "https://openalex.org",
  description: "Open catalogue of scholarly works, with CC0 metadata.",
};

export function isAvailable() {
  return true; // works without a key; mailto just gets the polite pool
}

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl("https://api.openalex.org/works", {
    search: query,
    // Only surface work we can actually send a reader to.
    filter: "is_oa:true",
    per_page: limit,
    mailto: process.env.OPENALEX_MAILTO,
  });

  const data = await fetchJson(url);
  return (data?.results ?? []).map(normalize).filter(Boolean);
}

function normalize(work) {
  const title = work?.display_name;
  if (!title) return null;

  const subjects = (work.concepts ?? [])
    .filter((c) => c.score > 0.3)
    .map((c) => c.display_name);

  const oaUrl = work.open_access?.oa_url ?? work.primary_location?.landing_page_url;
  const doi = work.doi ? work.doi.replace(/^https?:\/\/doi\.org\//, "") : null;

  return {
    id: `openalex:${work.id?.split("/").pop()}`,
    title,
    authors: (work.authorships ?? []).map((a) => a.author?.display_name).filter(Boolean),
    year: work.publication_year ?? null,
    publisher: work.primary_location?.source?.display_name ?? null,
    format: formatOf(work.type),
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: oaStatusNote(work.open_access?.oa_status),
    coverUrl: null,
    subjects,
    category: categorize(subjects),
    doi,
    url: oaUrl ?? (doi ? `https://doi.org/${doi}` : work.id),
  };
}

function formatOf(type) {
  if (!type) return "Scholarly work";
  const map = {
    article: "Journal article",
    book: "Book",
    "book-chapter": "Book chapter",
    dissertation: "Thesis",
    report: "Report",
    dataset: "Dataset",
    preprint: "Preprint",
  };
  return map[type] ?? "Scholarly work";
}

function oaStatusNote(status) {
  const notes = {
    gold: "Open access in a fully open journal.",
    hybrid: "Open access article in a subscription journal.",
    green: "Free author-archived copy in a repository.",
    bronze: "Free to read on the publisher site, licence unclear.",
    diamond: "Open access, no author or reader charges.",
  };
  return notes[status] ?? "Open access copy available.";
}
