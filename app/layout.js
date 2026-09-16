import "./globals.css";
import SiteHeader from "@/components/SiteHeader.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";

export const metadata = {
  title: {
    default: "Valenzuela City Library OPAC — Open Public Access Catalog",
    template: "%s — Valenzuela City Library OPAC",
  },
  description:
    "Search millions of genuinely open access books, articles and archive items in one place. Free, no account required.",
};

// Runs before first paint so a reader who chose night mode never sees a white flash.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("opac-theme");
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
