import AccessBadge from "./AccessBadge.jsx";
import ExternalLink from "./ExternalLink.jsx";

export default function ResultCard({ result }) {
  const authors = result.authors.slice(0, 3).join(", ");
  const moreAuthors = result.authors.length > 3 ? ` and ${result.authors.length - 3} more` : "";

  return (
    <li className="liftable rounded-lg border border-line bg-card p-4">
      <article className="flex gap-4">
        {result.coverUrl ? (
          // The title sits right beside it, so the cover adds nothing for a
          // screen reader — marked decorative rather than read out twice.
          <img
            src={result.coverUrl}
            alt=""
            width={64}
            height={90}
            loading="lazy"
            className="h-[90px] w-16 flex-none rounded object-cover border border-line bg-meta-soft"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-base font-semibold leading-snug">
            {result.url ? (
              <ExternalLink href={result.url} className="text-brand underline">
                {result.title}
              </ExternalLink>
            ) : (
              result.title
            )}
          </h3>

          {authors ? (
            <p className="mt-1 mb-0 text-sm text-muted">
              {authors}
              {moreAuthors}
            </p>
          ) : null}

          <p className="mt-1 mb-0 text-sm text-muted">
            {[result.format, result.year, result.publisher].filter(Boolean).join(" · ")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <AccessBadge access={result.access} note={result.accessNote} />
            <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {result.sourceLabel}
            </span>
            {result.category && result.category !== "General" ? (
              <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                {result.category}
              </span>
            ) : null}
          </div>

          {result.accessNote ? (
            <p className="mt-2 mb-0 text-sm text-muted">{result.accessNote}</p>
          ) : null}

          {result.alsoIn?.length ? (
            <p className="mt-2 mb-0 text-xs text-muted">
              Also found in: {result.alsoIn.join(", ")}
            </p>
          ) : null}
        </div>
      </article>
    </li>
  );
}
