import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "doaj",
  label: "DOAJ",
  fullName: "Directory of Open Access Journals",
  homepage: "https://doaj.org",
  description: "Peer-reviewed articles from vetted fully open access journals.",
};

export function isAvailable() {
  return true; // no key required
}

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl(
    `https://doaj.org/api/v4/search/articles/${encodeURIComponent(query)}`,
    { pageSize: limit }
  );

  const data = await fetchJson(url);
  return (data?.results ?? []).map(normalize).filter(Boolean);
}

function normalize(record) {
  const bib = record?.bibjson;
  if (!bib?.title) return null;

  const doi = bib.identifier?.find((id) => id.type === "doi")?.id ?? null;
  const fulltext = bib.link?.find((link) => link.type === "fulltext")?.url;
  const subjects = (bib.subject ?? []).map((s) => s.term).filter(Boolean);

  return {
    id: `doaj:${record.id}`,
    title: bib.title,
    authors: (bib.author ?? []).map((a) => a.name).filter(Boolean),
    year: bib.year ? Number(bib.year) : null,
    publisher: bib.journal?.publisher ?? bib.journal?.title ?? null,
    format: "Journal article",
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: "Published in a fully open access, peer-reviewed journal.",
    coverUrl: null,
    subjects,
    category: categorize(subjects),
    doi,
    url: fulltext ?? (doi ? `https://doi.org/${doi}` : `https://doaj.org/article/${record.id}`),
  };
}
