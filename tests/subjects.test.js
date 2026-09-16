import { describe, it, expect } from "vitest";
import { categorize } from "@/lib/subjects.js";

describe("categorize", () => {
  it("maps a subject onto the shared taxonomy", () => {
    expect(categorize(["Epidemiology"])).toBe("Health & Medicine");
    expect(categorize(["Philippine literature"])).toBe("Literature & Language");
  });

  it("does not match a keyword inside an unrelated word", () => {
    // The previous system's substring matching put "Descartes" and "particle
    // physics" under Arts because both contain "art".
    expect(categorize(["Descartes"])).not.toBe("Arts & Culture");
    expect(categorize(["particle"])).not.toBe("Arts & Culture");
    expect(categorize(["Shopping cart"])).not.toBe("Arts & Culture");
  });

  it("prefers the more specific phrase over a single word", () => {
    expect(categorize(["public health"])).toBe("Health & Medicine");
  });

  it("falls back to General when nothing matches", () => {
    expect(categorize(["Zzzz"])).toBe("General");
    expect(categorize([])).toBe("General");
  });

  it("picks the dominant category across several subjects", () => {
    expect(categorize(["chemistry", "physics", "art"])).toBe("Science & Technology");
  });
});
