import Link from "next/link";
import ExternalLink from "@/components/ExternalLink.jsx";
import { sourceMeta } from "@/lib/sources/index.js";
import { resourceCounts } from "@/lib/catalogue.js";
import { ACCESS, ACCESS_LABELS, ACCESS_DESCRIPTIONS, ACCESS_ORDER } from "@/lib/access.js";

export const metadata = {
  title: "About",
  description:
    "How the Valenzuela City Library OPAC searches open access collections, and what its access labels mean.",
};

// Column-reverse so the number reads first on screen while the markup keeps the
// term before its description, which is what a screen reader announces.
function Stat({ value, label }) {
  return (
    <div className="flex flex-col-reverse rounded-lg border border-line bg-card p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="m-0 text-3xl font-bold text-brand">{value}</dd>
    </div>
  );
}

export default function AboutPage() {
  const counts = resourceCounts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="m-0 text-3xl font-bold tracking-tight">About this catalogue</h1>
      <p className="mt-3 text-lg text-muted">
        The Valenzuela City Library OPAC is an open public access catalogue. It
        searches open collections around the world at the same time and shows the
        results in one list. There is no account, no membership and no paywall
        between you and anything it finds.
      </p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat value={counts.total} label="e-resources in total" />
        <Stat value={counts.live} label="searched live, in one go" />
        <Stat value={counts.portals} label="collections you can browse" />
      </dl>
      <p className="mt-3 text-sm text-muted">
        {counts.searchableAndBrowsable} of these are both: searched through their API
        and listed as a collection, so they are counted once in the total.{" "}
        {counts.philippine} are Philippine collections.
      </p>

      <h2 className="mt-12 text-xl font-bold">Who it is for</h2>
      <p className="text-muted">
        Students, teachers, researchers, and anyone who simply wants to read something
        and does not have a university login. Everything here is reachable from a public
        library terminal, a shared phone, or a slow connection at home.
      </p>

      <h2 className="mt-12 text-xl font-bold">What the access labels mean</h2>
      <p className="text-muted">
        &ldquo;Open access&rdquo; is used loosely across the web. Some sites advertise open
        access but still ask you to borrow, wait, register or pay. So every result here
        carries one of three plain labels, and we would rather under-promise than send
        you to a dead end.
      </p>
      <dl className="mt-4 space-y-4">
        {ACCESS_ORDER.map((level) => (
          <div key={level} className="rounded-lg border border-line bg-card p-4">
            <dt className="font-semibold">{ACCESS_LABELS[level]}</dt>
            <dd className="mt-1 ml-0 text-sm text-muted">{ACCESS_DESCRIPTIONS[level]}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-xl font-bold">Where the results come from</h2>
      <p className="text-muted">
        When you search, the request fans out to every collection below at once. Each
        one is given a few seconds to answer; if it is slow or down, the search carries
        on without it and tells you which collections it missed. Results are then merged,
        duplicates are folded together, and openly readable material is ranked first.
      </p>
      <ul className="mt-4 space-y-3 list-none p-0">
        {sourceMeta.map((source) => (
          <li key={source.key} className="rounded-lg border border-line bg-card p-4">
            <h3 className="m-0 text-base font-semibold">
              <ExternalLink href={source.homepage} className="text-brand underline">
                {source.fullName}
              </ExternalLink>
            </h3>
            <p className="mt-1 mb-0 text-sm text-muted">{source.description}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-bold">A note on Google Books</h2>
      <p className="text-muted">
        Google Books is included, but it is a commercial catalogue rather than an open
        access repository, and most of what it holds is preview or snippet only. This
        catalogue asks it for free ebooks specifically, and labels a volume{" "}
        <strong>{ACCESS_LABELS[ACCESS.OPEN]}</strong> only when it is genuinely public
        domain. Everything else from Google Books is marked as a preview so you know
        before you click.
      </p>

      <h2 className="mt-12 text-xl font-bold">Accessibility</h2>
      <p className="text-muted">
        This catalogue is built to WCAG 2.1 AA. It works with a keyboard alone, with a
        screen reader, at 200% zoom, and in both light and dark themes. Status is never
        signalled by colour by itself, search results are announced when they arrive,
        and the kiosk countdown can be paused or cancelled. If something here is hard
        to use, that is a bug worth reporting.
      </p>

      <h2 className="mt-12 text-xl font-bold">What this prototype does not do yet</h2>
      <p className="text-muted">
        This is an early version. It has no database, so there are no saved searches, no
        reading lists, no staff tools, and the kiosk survey does not record anything.
        Those arrive with the full release.
      </p>

      <p className="mt-10">
        <Link href="/collections" className="text-brand underline">
          See every collection this catalogue covers
        </Link>
      </p>
    </div>
  );
}
