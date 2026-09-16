"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchForm from "./SearchForm.jsx";
import FacetPanel from "./FacetPanel.jsx";
import ResultCard from "./ResultCard.jsx";
import PortalCard from "./PortalCard.jsx";
import SourceStatus from "./SourceStatus.jsx";

const EMPTY_SELECTION = { access: new Set(), source: new Set(), category: new Set(), format: new Set() };

export default function SearchExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [state, setState] = useState({ status: "idle", data: null, error: null });
  const [selected, setSelected] = useState(EMPTY_SELECTION);
  const resultsHeading = useRef(null);

  useEffect(() => {
    if (!query) {
      setState({ status: "idle", data: null, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading", data: null, error: null });
    setSelected(EMPTY_SELECTION);

    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Search failed.");
        return body;
      })
      .then((data) => setState({ status: "done", data, error: null }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error: error.message });
      });

    return () => controller.abort();
  }, [query]);

  // Move focus to the results heading once a search resolves, so keyboard and
  // screen reader users land on the new content instead of the top of the page.
  useEffect(() => {
    if (state.status === "done" && resultsHeading.current) {
      resultsHeading.current.focus();
    }
  }, [state.status]);

  const runSearch = useCallback(
    (next) => {
      router.push(`/?q=${encodeURIComponent(next)}`);
    },
    [router]
  );

  const toggleFacet = useCallback((group, value) => {
    setSelected((current) => {
      const next = new Set(current[group]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...current, [group]: next };
    });
  }, []);

  const clearFacets = useCallback(() => setSelected(EMPTY_SELECTION), []);

  const results = state.data ? applyFacets(state.data.results, selected) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {!query ? <Hero onSearch={runSearch} /> : null}

      {query ? (
        <div className="mb-8">
          <SearchForm initialQuery={query} onSearch={runSearch} key={query} />
        </div>
      ) : null}

      {/* Every status change is announced once, politely. */}
      <div aria-live="polite" className="visually-hidden">
        {state.status === "loading" ? `Searching for ${query}.` : null}
        {state.status === "done"
          ? `${results.length} ${results.length === 1 ? "result" : "results"} for ${query}.`
          : null}
        {state.status === "error" ? `Search failed. ${state.error}` : null}
      </div>

      {state.status === "loading" ? <LoadingState /> : null}

      {state.status === "error" ? (
        <div className="rounded-lg border border-partial bg-partial-soft p-4">
          <h2 className="m-0 text-base font-semibold">That search did not work</h2>
          <p className="mt-1 mb-0 text-sm">{state.error}</p>
        </div>
      ) : null}

      {state.status === "done" && state.data ? (
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <FacetPanel
              facets={state.data.facets}
              selected={selected}
              onToggle={toggleFacet}
              onClear={clearFacets}
            />
            <SourceStatus sources={state.data.sources} tookMs={state.data.tookMs} />
          </div>

          <div>
            <h2
              ref={resultsHeading}
              tabIndex={-1}
              className="m-0 text-xl font-bold"
            >
              {results.length} {results.length === 1 ? "result" : "results"} for{" "}
              <span className="text-brand">{query}</span>
            </h2>

            {state.data.portals?.length ? (
              <section aria-labelledby="portals-heading" className="mt-6">
                <h3 id="portals-heading" className="m-0 text-sm font-bold uppercase tracking-wide text-muted">
                  Whole collections worth browsing
                </h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
                  {state.data.portals.map((portal) => (
                    <PortalCard key={portal.slug} portal={portal} />
                  ))}
                </ul>
              </section>
            ) : null}

            {results.length === 0 ? (
              <EmptyState query={query} hasFacets={hasSelection(selected)} onClear={clearFacets} />
            ) : (
              <ul className="mt-6 space-y-3 list-none p-0 m-0">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Hero({ onSearch }) {
  return (
    <div className="py-10 sm:py-16">
      <h1 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight max-w-3xl">
        One search box for the world&apos;s open libraries
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-lg text-muted">
        Books, journal articles, theses and archive material that are genuinely free
        to read. No account, no institution, no paywall — and every result tells you
        up front how much of it you can actually open.
      </p>
      <div className="max-w-3xl">
        <SearchForm onSearch={onSearch} size="large" />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <p className="text-muted">Searching open collections…</p>
      <ul className="space-y-3 list-none p-0 m-0" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <li key={index} className="h-28 rounded-lg border border-line bg-card opacity-60" />
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ query, hasFacets, onClear }) {
  return (
    <div className="mt-6 rounded-lg border border-line bg-card p-6">
      <h3 className="m-0 text-base font-semibold">
        {hasFacets ? "Nothing matches those filters" : `No open access results for “${query}”`}
      </h3>
      <p className="mt-2 mb-0 text-sm text-muted">
        {hasFacets
          ? "Try removing a filter to see the full set of results again."
          : "Try a broader phrase, check the spelling, or browse a whole collection from the Collections page."}
      </p>
      {hasFacets ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-brand-soft"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}

function hasSelection(selected) {
  return Object.values(selected).some((set) => set.size > 0);
}

function applyFacets(results, selected) {
  return results.filter((result) => {
    if (selected.access.size && !selected.access.has(result.access)) return false;
    if (selected.source.size && !selected.source.has(result.sourceLabel)) return false;
    if (selected.category.size && !selected.category.has(result.category)) return false;
    if (selected.format.size && !selected.format.has(result.format)) return false;
    return true;
  });
}
