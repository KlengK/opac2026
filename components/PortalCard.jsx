import AccessBadge from "./AccessBadge.jsx";
import ExternalLink from "./ExternalLink.jsx";

export default function PortalCard({ portal }) {
  const href = portal.searchUrl ?? portal.url;

  return (
    <li className="liftable rounded-lg border border-line bg-card p-4">
      <h4 className="m-0 text-base font-semibold leading-snug">
        <ExternalLink href={href} className="text-brand underline">
          {portal.title}
        </ExternalLink>
      </h4>
      <p className="mt-1 mb-3 text-sm text-muted">{portal.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <AccessBadge access={portal.access} note={portal.accessNote} />
        <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
          {portal.region}
        </span>
      </div>
    </li>
  );
}
