import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "unpaywall",
  label: "Unpaywall",
  fullName: "Unpaywall",
  homepage: "https://unpaywall.org",
  description: "Finds a legal free copy of an article when you have its DOI.",
};

// Unpaywall's terms require a real, monitored contact address. Without one the
// source stays switched off rather than sending a placeholder.
export function isAvailable() {
  const email = process.env.UNPAYWALL_EMAIL;
  return Boolean(email && !email.endsWith(".local"));
}

const DOI_PATTERN = /10\.\d{4,9}\/[-._;()/:a-z0-9]+/i;

export async function search(query) {
  const doi = query.match(DOI_PATTERN)?.[0];
  if (!doi) return []; // Unpaywall is a DOI lookup, not a keyword search

  const url = buildUrl(`https://api.unpaywall.org/v2/${encodeURIComponent(doi)}`, {
    email: process.env.UNPAYWALL_EMAIL,
  });

  const record = await fetchJson(url);
  const normalized = normalize(record, doi);
  return normalized ? [normalized] : [];
}

function normalize(record, doi) {
  if (!record?.title) return null;

  const location = record.best_oa_location;
  const subjects = record.subject ?? [];

  return {
    id: `unpaywall:${doi}`,
    title: record.title,
    authors: (record.z_authors ?? [])
      .map((a) => [a.given, a.family].filter(Boolean).join(" "))
      .filter(Boolean),
    year: record.year ?? null,
    publisher: record.publisher ?? record.journal_name ?? null,
    format: "Journal article",
    source: meta.key,
    sourceLabel: meta.label,
    access: record.is_oa ? ACCESS.OPEN : ACCESS.METADATA,
    accessNote: record.is_oa
      ? "A free, legal copy of this article was found."
      : "No free copy found — this article appears to be paywalled.",
    coverUrl: null,
    subjects,
    category: categorize(subjects),
    doi,
    url: location?.url_for_pdf ?? location?.url ?? `https://doi.org/${doi}`,
  };
}
