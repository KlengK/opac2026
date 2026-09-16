import Link from "next/link";
import ThemeToggle from "./ThemeToggle.jsx";

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
        <Link href="/" className="pressable flex items-center gap-3 no-underline">
          <img
            src="/ValACELogo.png"
            alt="ValACE — Valenzuela City Academic Center for Excellence"
            width={64}
            height={64}
            className="h-32 w-32 flex-none object-contain"
          />
          <span>
            <span className="block text-xl font-bold tracking-tight text-ink">
              Valenzuela City Library
            </span>
            <span className="block text-sm text-muted">
              OPAC · Open Public Access Catalog
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="pressable block rounded-md px-3 py-2 text-sm font-medium text-ink no-underline hover:bg-brand-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
