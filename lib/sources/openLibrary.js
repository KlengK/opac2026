import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "openlibrary",
  label: "Open Library",
  fullName: "Open Library / Internet Archive",
  homepage: "https://openlibrary.org",
  description: "Book records from the Internet Archive. Some titles are readable now, others only borrowable.",
};

export function isAvailable() {
  return true;
}

const FIELDS = [
  "key", "title", "author_name", "first_publish_year", "cover_i",
  "subject", "ia", "ebook_access", "language",
].join(",");

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl("https://openlibrary.org/search.json", {
    q: query,
    limit,
    fields: FIELDS,
  });

  const data = await fetchJson(url);
  return (data?.docs ?? []).map(normalize).filter(Boolean);
}

function normalize(doc) {
  if (!doc?.title) return null;

  const subjects = (doc.subject ?? []).slice(0, 12);
  const { access, accessNote } = accessOf(doc.ebook_access);

  return {
    id: `openlibrary:${doc.key}`,
    title: doc.title,
    authors: doc.author_name ?? [],
    year: doc.first_publish_year ?? null,
    publisher: null,
    format: "Book",
    source: meta.key,
    sourceLabel: meta.label,
    access,
    accessNote,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    subjects,
    category: categorize(subjects),
    doi: null,
    url: `https://openlibrary.org${doc.key}`,
  };
}

// ERESOURCES_AUDIT.md flagged that Open Library's in-copyright books are
// lending-restricted, so only "public" counts as genuinely open here.
function accessOf(ebookAccess) {
  switch (ebookAccess) {
    case "public":
      return {
        access: ACCESS.OPEN,
        accessNote: "Public domain. Read the full book online for free.",
      };
    case "borrowable":
      return {
        access: ACCESS.PARTIAL,
        accessNote: "Borrow for a limited time through Controlled Digital Lending. A waitlist may apply.",
      };
    case "printdisabled":
      return {
        access: ACCESS.PARTIAL,
        accessNote: "Full text is restricted to readers with a qualifying print disability.",
      };
    default:
      return {
        access: ACCESS.METADATA,
        accessNote: "Catalogue record only — no online copy available here.",
      };
  }
}
