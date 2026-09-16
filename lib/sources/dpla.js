import { fetchJson, buildUrl } from "../http.js";
import { ACCESS } from "../access.js";
import { categorize } from "../subjects.js";

export const meta = {
  key: "dpla",
  label: "DPLA",
  fullName: "Digital Public Library of America",
  homepage: "https://dp.la",
  description: "Digitised items from thousands of US libraries, archives and museums.",
};

// DPLA needs a free API key. Without one the source is skipped rather than
// failing every search.
export function isAvailable() {
  return Boolean(process.env.DPLA_API_KEY);
}

export async function search(query, { limit = 12 } = {}) {
  const url = buildUrl("https://api.dp.la/v2/items", {
    q: query,
    page_size: limit,
    api_key: process.env.DPLA_API_KEY,
  });

  const data = await fetchJson(url);
  return (data?.docs ?? []).map(normalize).filter(Boolean);
}

function normalize(doc) {
  const resource = doc?.sourceResource;
  const title = first(resource?.title);
  if (!title) return null;

  const subjects = (resource.subject ?? [])
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean);

  return {
    id: `dpla:${doc.id}`,
    title,
    authors: asArray(resource.creator),
    year: yearOf(first(resource.date)),
    publisher: first(doc.provider?.name) ?? null,
    format: formatOf(resource.type),
    source: meta.key,
    sourceLabel: meta.label,
    access: ACCESS.OPEN,
    accessNote: "Digitised by a US library, archive or museum and free to view.",
    coverUrl: first(doc.object) ?? null,
    subjects,
    category: categorize(subjects),
    doi: null,
    url: first(doc.isShownAt) ?? null,
  };
}

function first(value) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function yearOf(date) {
  if (!date) return null;
  const raw = typeof date === "string" ? date : date.displayDate ?? date.begin;
  const match = String(raw ?? "").match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function formatOf(type) {
  const value = String(first(type) ?? "").toLowerCase();
  const map = {
    text: "Text",
    image: "Image",
    "moving image": "Video",
    sound: "Audio",
    physical: "Object",
  };
  return map[value] ?? "Archive item";
}
