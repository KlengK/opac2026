import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "googlebooks",
  label: "Google Books",
  fullName: "Google Books (free ebooks)",
  homepage: "https://books.google.com",
  description:
    "A commercial catalogue, included only for its free and public domain ebooks. Not an open access repository.",
};

// In practice a key is required: Google's keyless quota is shared across every
// anonymous caller worldwide and is normally already exhausted, so without a key
// this source returns 429 on every search. Better to report it as unconfigured.
export function isAvailable() {
  return Boolean(process.env.GOOGLE_BOOKS_API_KEY);
}

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl("https://www.googleapis.com/books/v1/volumes", {
    q: query,
    // Restrict to the part of Google Books that is actually free to read.
    filter: "free-ebooks",
    maxResults: Math.min(limit, 40),
    key: process.env.GOOGLE_BOOKS_API_KEY,
  });

  const data = await fetchJson(url);
  return (data?.items ?? []).map(normalize).filter(Boolean);
}

function normalize(item) {
  const info = item?.volumeInfo;
  if (!info?.title) return null;

  const subjects = info.categories ?? [];
  const { access, accessNote } = accessOf(item.accessInfo);

  return {
    id: `googlebooks:${item.id}`,
    title: info.title,
    authors: info.authors ?? [],
    year: info.publishedDate ? Number(info.publishedDate.slice(0, 4)) || null : null,
    publisher: info.publisher ?? null,
    format: "Book",
    source: meta.key,
    sourceLabel: meta.label,
    access,
    accessNote,
    coverUrl: (info.imageLinks?.thumbnail ?? "").replace(/^http:/, "https:") || null,
    subjects,
    category: categorize(subjects),
    doi: null,
    url: info.previewLink ?? info.infoLink ?? null,
  };
}

// The previous system described Google Books alongside Open Library as an
// "open-source e-book" provider, which ERESOURCES_AUDIT.md flagged as an
// overstatement. Only genuine public domain volumes are labelled open.
function accessOf(accessInfo) {
  if (accessInfo?.publicDomain && accessInfo?.viewability === "ALL_PAGES") {
    return {
      access: ACCESS.OPEN,
      accessNote: "Public domain. The complete book is free to read and download.",
    };
  }
  if (accessInfo?.viewability === "ALL_PAGES") {
    return {
      access: ACCESS.PARTIAL,
      accessNote: "Free to read in full on Google Books, but under standard copyright.",
    };
  }
  return {
    access: ACCESS.METADATA,
    accessNote: "Preview or snippet only — this is not an open access copy.",
  };
}
