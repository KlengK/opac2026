import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">
        <p className="m-0 max-w-2xl">
          OPAC 2026 searches open access collections directly. It never asks you to
          register, and it always tells you how much of an item you can actually read
          before you click through.
        </p>
        <p className="mt-4 mb-0">
          <Link href="/about" className="text-brand underline">
            How this catalogue works
          </Link>
          <span aria-hidden="true"> · </span>
          <Link href="/collections" className="text-brand underline">
            Browse collections
          </Link>
        </p>
      </div>
    </footer>
  );
}
