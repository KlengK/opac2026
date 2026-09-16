import "./globals.css";
import SiteHeader from "@/components/SiteHeader.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";

export const metadata = {
  title: {
    default: "OPAC 2026 — Open Public Access Catalog",
    template: "%s — OPAC 2026",
  },
  description:
    "Search millions of genuinely open access books, articles and archive items in one place. Free, no account required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
