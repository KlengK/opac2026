import { curatedLinks } from "@/data/curatedLinks.js";
import AccessBadge from "@/components/AccessBadge.jsx";
import ExternalLink from "@/components/ExternalLink.jsx";

export const metadata = {
  title: "Collections",
  description:
    "Every open access collection this catalogue searches or links to, with an honest note on what you can actually read.",
};

export default function CollectionsPage() {
  const regions = groupByRegion(curatedLinks);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="m-0 text-3xl font-bold tracking-tight">Collections</h1>
      <p className="mt-3 mb-10 max-w-2xl text-lg text-muted">
        These are the libraries, repositories and archives behind this catalogue.
        Each one says plainly how much of its material you can read for free, because
        &ldquo;open access&rdquo; means different things at different places.
      </p>

      {regions.map(([region, links]) => (
        <section key={region} aria-labelledby={`region-${slug(region)}`} className="mb-12">
          <h2 id={`region-${slug(region)}`} className="m-0 text-xl font-bold">
            {region}
          </h2>
          <ul className="mt-4 space-y-3 list-none p-0 m-0">
            {links.map((link) => (
              <li key={link.slug} className="rounded-lg border border-line bg-card p-4">
                <h3 className="m-0 text-base font-semibold">
                  <ExternalLink href={link.url} className="text-brand underline">
                    {link.title}
                  </ExternalLink>
                </h3>
                <p className="mt-1 mb-3 text-sm text-muted">{link.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <AccessBadge access={link.access} note={link.accessNote} />
                  {link.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 mb-0 text-sm text-muted">{link.accessNote}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function groupByRegion(links) {
  const grouped = new Map();
  for (const link of links) {
    if (!grouped.has(link.region)) grouped.set(link.region, []);
    grouped.get(link.region).push(link);
  }
  return [...grouped.entries()];
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
