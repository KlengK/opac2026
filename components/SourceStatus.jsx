"use client";

// Being honest about coverage matters: if a collection timed out or is not
// configured, the reader should know their search did not reach it.
export default function SourceStatus({ sources, tookMs }) {
  const reached = sources.filter((source) => source.ok);
  const missed = sources.filter((source) => !source.ok);

  return (
    <details className="rounded-lg border border-line bg-card p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        Searched {reached.length} of {sources.length} collections
        {missed.length ? ` · ${missed.length} unavailable` : ""}
      </summary>

      <p className="mt-2 mb-3 text-xs text-muted">
        Completed in {(tookMs / 1000).toFixed(1)} seconds.
      </p>

      <ul className="list-none p-0 m-0 space-y-1 text-sm">
        {sources.map((source) => (
          <li key={source.key} className="flex items-baseline justify-between gap-2">
            <span>{source.label}</span>
            <span className="text-xs text-muted text-right">
              {source.ok
                ? `${source.count} ${source.count === 1 ? "result" : "results"}`
                : source.skipped
                  ? "not configured"
                  : (source.error ?? "unavailable")}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
