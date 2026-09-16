"use client";

import { useEffect, useState } from "react";
import { ACCESS_LABELS } from "@/lib/access.js";

const GROUPS = [
  { key: "access", legend: "How much you can read" },
  { key: "source", legend: "Collection" },
  { key: "category", legend: "Subject" },
  { key: "format", legend: "Format" },
];

export default function FacetPanel({ facets, selected, onToggle, onClear }) {
  // Open by default, including before hydration and without JavaScript. On a
  // phone the filters collapse so results are not pushed off the screen.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOpen(wide.matches);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  const activeCount = Object.values(selected).reduce((total, set) => total + set.size, 0);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="rounded-lg border border-line bg-card p-4"
    >
      <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-muted">
        Narrow these results
        {activeCount > 0 ? (
          <span className="ml-2 normal-case tracking-normal text-brand">
            {activeCount} active
          </span>
        ) : null}
      </summary>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 rounded-md border border-line px-2 py-1 text-xs font-medium text-ink hover:bg-brand-soft"
        >
          Clear all filters
        </button>
      ) : null}

      {GROUPS.map((group) => {
        const options = facets[group.key] ?? [];
        if (options.length === 0) return null;

        return (
          <fieldset key={group.key} className="mt-5 border-0 p-0 m-0">
            <legend className="mb-2 p-0 text-sm font-semibold text-ink">
              {group.legend}
            </legend>
            <ul className="list-none p-0 m-0 space-y-1">
              {options.map((option) => {
                const id = `facet-${group.key}-${slug(option.value)}`;
                const label =
                  group.key === "access"
                    ? ACCESS_LABELS[option.value] ?? option.value
                    : option.value;

                return (
                  <li key={option.value}>
                    <label
                      htmlFor={id}
                      className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-brand-soft"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={selected[group.key]?.has(option.value) ?? false}
                        onChange={() => onToggle(group.key, option.value)}
                        className="h-4 w-4 flex-none accent-[var(--brand)]"
                      />
                      <span className="flex-1">{label}</span>
                      <span className="text-xs text-muted">{option.count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </details>
  );
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
