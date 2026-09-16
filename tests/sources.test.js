import { describe, it, expect, vi, afterEach } from "vitest";
import * as openLibrary from "@/lib/sources/openLibrary.js";
import * as googleBooks from "@/lib/sources/googleBooks.js";
import * as unpaywall from "@/lib/sources/unpaywall.js";
import { ACCESS } from "@/lib/access.js";

function mockJson(payload) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => payload,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.UNPAYWALL_EMAIL;
});

describe("Open Library access labelling", () => {
  it("labels a public domain book as openly readable", async () => {
    mockJson({ docs: [{ key: "/works/1", title: "Noli Me Tangere", ebook_access: "public" }] });
    const [result] = await openLibrary.search("noli");
    expect(result.access).toBe(ACCESS.OPEN);
  });

  it("labels a lending-only book as limited, not open", async () => {
    mockJson({ docs: [{ key: "/works/2", title: "A Recent Novel", ebook_access: "borrowable" }] });
    const [result] = await openLibrary.search("novel");
    expect(result.access).toBe(ACCESS.PARTIAL);
    expect(result.accessNote).toMatch(/borrow/i);
  });

  it("labels a record with no copy as metadata only", async () => {
    mockJson({ docs: [{ key: "/works/3", title: "Out of Print", ebook_access: "no_ebook" }] });
    const [result] = await openLibrary.search("out of print");
    expect(result.access).toBe(ACCESS.METADATA);
  });
});

describe("Google Books access labelling", () => {
  it("only calls a volume open when it is genuinely public domain", async () => {
    mockJson({
      items: [
        {
          id: "a",
          volumeInfo: { title: "Public Domain Work" },
          accessInfo: { publicDomain: true, viewability: "ALL_PAGES" },
        },
      ],
    });
    const [result] = await googleBooks.search("test");
    expect(result.access).toBe(ACCESS.OPEN);
  });

  it("marks a preview-only volume as metadata, not open access", async () => {
    mockJson({
      items: [
        {
          id: "b",
          volumeInfo: { title: "Preview Only" },
          accessInfo: { publicDomain: false, viewability: "PARTIAL" },
        },
      ],
    });
    const [result] = await googleBooks.search("test");
    expect(result.access).toBe(ACCESS.METADATA);
    expect(result.accessNote).toMatch(/not an open access copy/i);
  });
});

describe("Unpaywall", () => {
  it("stays switched off without a real contact address", () => {
    expect(unpaywall.isAvailable()).toBe(false);
    process.env.UNPAYWALL_EMAIL = "admin@valace.local";
    expect(unpaywall.isAvailable()).toBe(false);
    process.env.UNPAYWALL_EMAIL = "library@example.org";
    expect(unpaywall.isAvailable()).toBe(true);
  });

  it("ignores a query that is not a DOI", async () => {
    process.env.UNPAYWALL_EMAIL = "library@example.org";
    const results = await unpaywall.search("climate change");
    expect(results).toEqual([]);
  });

  it("looks up a DOI found anywhere in the query", async () => {
    process.env.UNPAYWALL_EMAIL = "library@example.org";
    mockJson({ title: "A Paper", is_oa: true, best_oa_location: { url: "https://example.org/pdf" } });
    const [result] = await unpaywall.search("https://doi.org/10.1234/abcd");
    expect(result.access).toBe(ACCESS.OPEN);
    expect(result.url).toBe("https://example.org/pdf");
  });
});
