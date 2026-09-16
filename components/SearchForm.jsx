"use client";

import { useState } from "react";

export default function SearchForm({ initialQuery = "", onSearch, size = "default" }) {
  const [value, setValue] = useState(initialQuery);
  const large = size === "large";

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="catalogue-search"
        className={large ? "block text-base font-medium mb-2" : "visually-hidden"}
      >
        Search for books, articles and archive material
      </label>

      <div className="flex gap-2">
        <input
          id="catalogue-search"
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Try: climate change, Philippine history, photosynthesis"
          autoComplete="off"
          aria-describedby="catalogue-search-hint"
          className={`min-w-0 flex-1 rounded-lg border border-line bg-card px-4 text-ink placeholder:text-muted ${
            large ? "py-4 text-lg" : "py-2.5 text-base"
          }`}
        />
        <button
          type="submit"
          className={`flex-none rounded-lg bg-brand font-semibold ${
            large ? "px-7 py-4 text-lg" : "px-5 py-2.5"
          }`}
          // Brand flips light/dark between themes, so the label tracks the page
          // background to stay readable in both.
          style={{ color: "var(--paper)" }}
        >
          Search
        </button>
      </div>

      <p id="catalogue-search-hint" className="mt-2 mb-0 text-sm text-muted">
        Searches open access collections worldwide. You can also paste a DOI.
      </p>
    </form>
  );
}
