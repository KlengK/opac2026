import Link from "next/link";
import { VALACE_URL } from "@/lib/site.js";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-tint mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">
        <p className="m-0 max-w-2xl">
          The Valenzuela City Library OPAC searches open access collections directly.
          It never asks you to register, and it always tells you how much of an item
          you can actually read before you click through.
        </p>
        <p className="mt-4 mb-0">
          <Link href="/about" className="text-brand underline">
            How this catalogue works
          </Link>
          <span aria-hidden="true"> · </span>
          <Link href="/collections" className="text-brand underline">
            Browse collections
          </Link>
          <span aria-hidden="true"> · </span>
          <a
            href={VALACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline"
          >
            ValACE
            <span className="visually-hidden">
              , Valenzuela City Academic Center for Excellence (opens in a new tab)
            </span>
          </a>
        </p>
        <p className="mt-6 mb-0 border-t border-line pt-4">
          Developed by Valenzuela City Library IT-Unit · Copyright &copy; 2026
        </p>
      </div>
    </footer>
  );
}
