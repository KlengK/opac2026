import { describe, it, expect } from "vitest";
import { dedupe, score, sortResults } from "@/lib/aggregate.js";
import { ACCESS } from "@/lib/access.js";

function result(overrides = {}) {
  return {
    id: "x:1",
    title: "Climate Change and Agriculture",
    authors: ["Jane Reyes"],
    year: 2020,
    publisher: null,
    format: "Journal article",
    source: "doaj",
    sourceLabel: "DOAJ",
    access: ACCESS.OPEN,
    accessNote: "",
    coverUrl: null,
    subjects: [],
    category: "Science & Technology",
    doi: null,
    url: "https://example.org",
    relevance: 0,
    ...overrides,
  };
}

describe("score", () => {
  it("ranks an exact title match above a partial one", () => {
    const exact = score(result(), "climate change and agriculture");
    const partial = score(result({ title: "Notes on climate policy" }), "climate change and agriculture");
    expect(exact.relevance).toBeGreaterThan(partial.relevance);
  });

  it("credits an author match", () => {
    const withAuthor = score(result(), "reyes");
    const withoutAuthor = score(result({ authors: ["Someone Else"] }), "reyes");
    expect(withAuthor.relevance).toBeGreaterThan(withoutAuthor.relevance);
  });
});

describe("sortResults", () => {
  it("puts readable material above an exact title match nobody can open", () => {
    const sorted = sortResults([
      result({ id: "a", title: "Rice Farming", access: ACCESS.METADATA, relevance: 125 }),
      result({ id: "b", title: "Rice farming in the tropics", access: ACCESS.OPEN, relevance: 40 }),
    ]);
    expect(sorted[0].id).toBe("b");
  });

  it("orders the three access tiers open, limited, record-only", () => {
    const sorted = sortResults([
      result({ id: "meta", access: ACCESS.METADATA, relevance: 90 }),
      result({ id: "partial", access: ACCESS.PARTIAL, relevance: 90 }),
      result({ id: "open", access: ACCESS.OPEN, relevance: 10 }),
    ]);
    expect(sorted.map((entry) => entry.id)).toEqual(["open", "partial", "meta"]);
  });

  it("falls back to relevance within a tier", () => {
    const sorted = sortResults([
      result({ id: "low", access: ACCESS.OPEN, relevance: 5 }),
      result({ id: "high", access: ACCESS.OPEN, relevance: 80 }),
    ]);
    expect(sorted[0].id).toBe("high");
  });
});

describe("dedupe", () => {
  it("folds the same work from two sources into one entry", () => {
    const merged = dedupe([
      result({ id: "doaj:1", source: "doaj", sourceLabel: "DOAJ", relevance: 50 }),
      result({ id: "openalex:1", source: "openalex", sourceLabel: "OpenAlex", relevance: 30 }),
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].sourceLabel).toBe("DOAJ");
    expect(merged[0].alsoIn).toContain("OpenAlex");
  });

  it("matches on DOI even when titles are punctuated differently", () => {
    const merged = dedupe([
      result({ id: "a", doi: "10.1000/abc", title: "A Study: Volume One", relevance: 10 }),
      result({ id: "b", doi: "10.1000/abc", title: "A Study — Volume One", relevance: 20 }),
    ]);
    expect(merged).toHaveLength(1);
  });

  it("keeps genuinely different works apart", () => {
    const merged = dedupe([
      result({ id: "a", title: "Rice Farming" }),
      result({ id: "b", title: "Corn Farming" }),
    ]);
    expect(merged).toHaveLength(2);
  });

  it("fills a missing cover from the duplicate that had one", () => {
    const merged = dedupe([
      result({ id: "a", relevance: 90, coverUrl: null }),
      result({ id: "b", relevance: 10, coverUrl: "https://example.org/cover.jpg", sourceLabel: "Open Library" }),
    ]);
    expect(merged[0].coverUrl).toBe("https://example.org/cover.jpg");
  });
});
