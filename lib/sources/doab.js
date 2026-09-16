import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "doab",
  label: "DOAB",
  fullName: "Directory of Open Access Books",
  homepage: "https://www.doabooks.org",
  description:
    "Peer-reviewed open access books, including the full Open Book Publishers catalogue.",
};

export function isAvailable() {
  return true;
}

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl("https://directory.doabooks.org/rest/search", {
    query,
    expand: "metadata",
    limit,
  });

  const items = await fetchJson(url);
  return (Array.isArray(items) ? items : []).map(normalize).filter(Boolean);
}

function normalize(item) {
  // DOAB runs DSpace 5, whose REST API returns metadata as a flat list of
  // {key, value} pairs rather than a keyed object.
  const fields = indexMetadata(item?.metadata ?? []);

  const title = fields.get("dc.title")?.[0] ?? item?.name;
  if (!title) return null;

  const subjects = [
    ...(fields.get("dc.subject.other") ?? []),
    ...(fields.get("dc.subject.classification") ?? []).map(stripThema),
  ].slice(0, 12);

  const authors = fields.get("dc.contributor.author") ?? [];
  const editors = fields.get("dc.contributor.editor") ?? [];

  return {
    id: `doab:${item.uuid ?? item.handle}`,
    title,
    authors: authors.length ? authors : editors,
    year: yearOf(fields.get("dc.date.issued")?.[0]),
    publisher: fields.get("publisher.name")?.[0] ?? fields.get("dc.publisher")?.[0] ?? null,
    format: fields.get("dc.type")?.[0] === "book chapter" ? "Book chapter" : "Book",
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: "Peer-reviewed open access book, free to download in full.",
    coverUrl: null,
    subjects,
    category: categorize(subjects),
    doi: fields.get("oapen.identifier.doi")?.[0] ?? null,
    url:
      fields.get("dc.identifier.uri")?.[0] ??
      (item.handle ? `https://directory.doabooks.org/handle/${item.handle}` : meta.homepage),
  };
}

function indexMetadata(metadata) {
  const fields = new Map();
  for (const entry of metadata) {
    if (!entry?.key || !entry.value) continue;
    if (!fields.has(entry.key)) fields.set(entry.key, []);
    fields.get(entry.key).push(entry.value);
  }
  return fields;
}

// "thema EDItEUR::R Earth Sciences, Geography..." -> "Earth Sciences, Geography..."
function stripThema(value) {
  const tail = String(value).split("::").pop() ?? "";
  return tail.replace(/^[A-Z]{1,3}\s+/, "").trim();
}

function yearOf(date) {
  const match = String(date ?? "").match(/\d{4}/);
  return match ? Number(match[0]) : null;
}
