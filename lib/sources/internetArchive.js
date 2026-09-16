import { fetchJson } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "internetarchive",
  label: "Internet Archive",
  fullName: "Internet Archive",
  homepage: "https://archive.org",
  description: "Public domain and openly licensed texts. Lending-only items are excluded.",
};

export function isAvailable() {
  return true;
}

const FIELDS = ["identifier", "title", "creator", "year", "subject", "licenseurl", "mediatype"];

export async function search(query, { limit = 12 } = {}) {
  // ERESOURCES_AUDIT.md: in-copyright items use Controlled Digital Lending
  // (borrow/waitlist). The `inlibrary` collection is exactly that set, so it is
  // excluded here — this source only returns things a reader can open now.
  const solr = `(${query}) AND mediatype:texts AND NOT collection:inlibrary`;

  const url = new URL("https://archive.org/advancedsearch.php");
  url.searchParams.set("q", solr);
  for (const field of FIELDS) url.searchParams.append("fl[]", field);
  url.searchParams.set("rows", String(limit));
  url.searchParams.set("page", "1");
  url.searchParams.set("output", "json");

  const data = await fetchJson(url.toString());
  return (data?.response?.docs ?? []).map(normalize).filter(Boolean);
}

function normalize(doc) {
  if (!doc?.title || !doc.identifier) return null;

  const subjects = asArray(doc.subject).slice(0, 12);

  return {
    id: `internetarchive:${doc.identifier}`,
    title: Array.isArray(doc.title) ? doc.title[0] : doc.title,
    authors: asArray(doc.creator),
    year: doc.year ? Number(doc.year) : null,
    publisher: null,
    format: "Text",
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: doc.licenseurl
      ? "Openly licensed and free to read in full."
      : "Public domain. Free to read and download in full.",
    coverUrl: `https://archive.org/services/img/${doc.identifier}`,
    subjects,
    category: categorize(subjects),
    doi: null,
    url: `https://archive.org/details/${doc.identifier}`,
  };
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
