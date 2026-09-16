import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import ResultCard from "@/components/ResultCard.jsx";
import AccessBadge from "@/components/AccessBadge.jsx";
import FacetPanel from "@/components/FacetPanel.jsx";
import { ACCESS } from "@/lib/access.js";

const sampleResult = {
  id: "doaj:1",
  title: "Rice Yields Under Climate Stress",
  authors: ["Jane Reyes", "Mark Santos"],
  year: 2021,
  publisher: "Philippine Journal of Science",
  format: "Journal article",
  source: "doaj",
  sourceLabel: "DOAJ",
  access: ACCESS.OPEN,
  accessNote: "Published in a fully open access, peer-reviewed journal.",
  coverUrl: "https://example.org/cover.jpg",
  subjects: ["agriculture"],
  category: "Science & Technology",
  doi: null,
  url: "https://example.org/article",
  alsoIn: ["OpenAlex"],
};

describe("accessibility", () => {
  it("a result card has no axe violations", async () => {
    const { container } = render(
      <ul>
        <ResultCard result={sampleResult} />
      </ul>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("a facet panel has no axe violations", async () => {
    const { container } = render(
      <FacetPanel
        facets={{
          access: [{ value: ACCESS.OPEN, count: 4 }],
          source: [{ value: "DOAJ", count: 4 }],
          category: [],
          format: [],
        }}
        selected={{ access: new Set(), source: new Set(), category: new Set(), format: new Set() }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("states access level in words, not colour alone", () => {
    render(<AccessBadge access={ACCESS.PARTIAL} note="Borrowing required." />);
    expect(screen.getByText("Limited access")).toBeInTheDocument();
  });

  it("treats the cover image as decorative so the title is not read twice", () => {
    render(
      <ul>
        <ResultCard result={sampleResult} />
      </ul>
    );
    // An empty alt keeps it out of the accessibility tree entirely.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("opens a result in a new tab and says so in the link name", () => {
    render(
      <ul>
        <ResultCard result={sampleResult} />
      </ul>
    );
    const link = screen.getByRole("link", { name: /Rice Yields Under Climate Stress/i });
    expect(link).toHaveAttribute("target", "_blank");
    // Without noopener the opened page can reach back through window.opener.
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAccessibleName(/opens in a new tab/i);
  });

  it("labels every facet checkbox", () => {
    render(
      <FacetPanel
        facets={{ access: [{ value: ACCESS.OPEN, count: 2 }], source: [], category: [], format: [] }}
        selected={{ access: new Set(), source: new Set(), category: new Set(), format: new Set() }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByRole("checkbox", { name: /free full text/i })).toBeInTheDocument();
  });
});
