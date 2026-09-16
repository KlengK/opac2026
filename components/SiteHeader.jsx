import Link from "next/link";

const NAV = [
  { href: "/", label: "Search" },
  { href: "/collections", label: "Collections" },
  { href: "/kiosk", label: "Kiosk" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-baseline gap-2 no-underline">
          <span className="text-xl font-bold tracking-tight text-ink">OPAC 2026</span>
          <span className="text-sm text-muted">Open Public Access Catalog</span>
        </Link>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-ink no-underline hover:bg-brand-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
