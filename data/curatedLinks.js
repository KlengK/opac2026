import { ACCESS } from "../lib/access.js";

// Curated portals: collections worth sending a reader to directly, whether or
// not we can search them through an API.
//
// This file is the prototype's stand-in for a database table. Every entry uses
// flat, column-shaped fields so moving it into a `curated_links` table later is
// a mechanical change rather than a rewrite.
//
// `searchUrlTemplate` uses a {query} placeholder so a portal can be deep-linked
// into its own search when we cannot federate it.

export const curatedLinks = [
  // --- Philippines ---
  {
    slug: "starbooks",
    title: "DOST STARBOOKS",
    description:
      "The Philippines' science and technology digital library from DOST-STII, with thousands of Filipino science, technology and livelihood resources.",
    url: "https://www.starbooks.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["science", "technology", "livelihood", "Philippines"],
    access: ACCESS.OPEN,
    accessNote: "Free to browse and read.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "nlp-eportal",
    title: "National Library of the Philippines e-Portal",
    description:
      "Digitised Filipiniana, rare books, manuscripts and periodicals from the National Library of the Philippines.",
    // ERESOURCES_AUDIT.md flagged the old ?q=node/1449 e-resources URL as stale
    // after NLP's site migration. The e-Portal is the live replacement.
    url: "https://eportal.nlp.gov.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["Filipiniana", "rare books", "manuscripts", "national library"],
    access: ACCESS.OPEN,
    accessNote: "Free to browse and read.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "philippine-elib",
    title: "Philippine eLib",
    description:
      "A shared catalogue from five major Philippine government libraries, covering theses, research and government publications.",
    url: "https://www.elib.gov.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["theses", "research", "government", "Philippines"],
    access: ACCESS.PARTIAL,
    accessNote: "Records are open; some full text requires an eLib account.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "technoaklatan",
    title: "TechnoAklatan",
    description:
      "The National Library of the Philippines' digital library of local and cultural collections.",
    url: "https://nlpdl.nlp.gov.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["digital library", "culture", "Philippines"],
    access: ACCESS.OPEN,
    accessNote: "Free to browse and read.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "kwf-library",
    title: "Komisyon sa Wikang Filipino Library",
    description:
      "Library of the Commission on the Filipino Language, covering Philippine languages, linguistics and literature.",
    url: "https://library.kwf.gov.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["language", "linguistics", "literature", "Filipino"],
    access: ACCESS.OPEN,
    accessNote: "Free to browse and read.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "acta-medica-philippina",
    title: "Acta Medica Philippina",
    description:
      "The national health science journal of the Philippines, published by the University of the Philippines Manila.",
    url: "https://actamedicaphilippina.upm.edu.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["medicine", "health", "journal", "Philippines"],
    access: ACCESS.OPEN,
    accessNote: "Open access journal, free to read in full.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "pids",
    title: "Philippine Institute for Development Studies",
    description:
      "Open policy research, working papers and economic studies on Philippine development.",
    url: "https://www.pids.gov.ph/",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["economics", "policy", "development", "research"],
    access: ACCESS.OPEN,
    accessNote: "Working papers and studies are free to download.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "valenzuela-opac",
    title: "Valenzuela City Library Catalogue",
    description:
      "The public catalogue of the Valenzuela City Library system — for physical books available on the shelf.",
    url: "https://library.valenzuela.gov.ph",
    searchUrlTemplate: null,
    region: "Philippines",
    tags: ["local", "physical books", "Valenzuela"],
    access: ACCESS.METADATA,
    accessNote: "Catalogue of physical holdings — borrow in person at the library.",
    featured: false,
    showInKiosk: true,
  },

  // --- International ---
  {
    slug: "project-gutenberg",
    title: "Project Gutenberg",
    description:
      "More than 70,000 public domain ebooks, free to download in any format, with no account required.",
    url: "https://www.gutenberg.org/",
    searchUrlTemplate: "https://www.gutenberg.org/ebooks/search/?query={query}",
    region: "International",
    tags: ["ebooks", "public domain", "literature", "classics"],
    access: ACCESS.OPEN,
    accessNote: "Entirely public domain. Download the full text freely.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "doaj",
    title: "Directory of Open Access Journals",
    description:
      "An index of vetted, fully open access, peer-reviewed journals covering every discipline.",
    url: "https://doaj.org/",
    searchUrlTemplate: "https://doaj.org/search/articles?source=%7B%22query%22%3A%7B%22query_string%22%3A%7B%22query%22%3A%22{query}%22%7D%7D%7D",
    region: "International",
    tags: ["journals", "articles", "peer-reviewed", "open access"],
    access: ACCESS.OPEN,
    accessNote: "Every journal indexed here is fully open access.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "doab",
    title: "Directory of Open Access Books",
    description:
      "Peer-reviewed academic books that are free to download in full, from hundreds of scholarly publishers.",
    url: "https://www.doabooks.org/",
    searchUrlTemplate: "https://directory.doabooks.org/discover?query={query}",
    region: "International",
    tags: ["books", "academic", "peer-reviewed", "open access"],
    access: ACCESS.OPEN,
    accessNote: "Every book indexed here is free to download in full.",
    featured: true,
    showInKiosk: false,
  },
  {
    slug: "open-book-publishers",
    title: "Open Book Publishers",
    description:
      "A scholar-led open access press in the humanities and social sciences. Its full catalogue is also searchable through DOAB above.",
    url: "https://www.openbookpublishers.com",
    searchUrlTemplate: null,
    region: "International",
    tags: ["books", "humanities", "social sciences", "open access"],
    access: ACCESS.OPEN,
    accessNote: "All titles are free to read online in full.",
    featured: false,
    showInKiosk: false,
  },
  {
    slug: "pmc",
    title: "PubMed Central",
    description:
      "The US National Library of Medicine's free archive of biomedical and life sciences journal literature.",
    url: "https://pmc.ncbi.nlm.nih.gov",
    searchUrlTemplate: "https://pmc.ncbi.nlm.nih.gov/?term={query}",
    region: "International",
    tags: ["medicine", "health", "biomedical", "articles"],
    access: ACCESS.OPEN,
    accessNote: "Free full text for everything in the archive.",
    featured: true,
    showInKiosk: true,
  },
  {
    slug: "springeropen",
    title: "SpringerOpen",
    description:
      "Springer's fully open access journal portfolio. Its articles also appear in DOAJ and OpenAlex results here.",
    url: "https://www.springeropen.com",
    searchUrlTemplate: "https://www.springeropen.com/search?query={query}",
    region: "International",
    tags: ["journals", "articles", "science", "open access"],
    access: ACCESS.OPEN,
    accessNote: "Fully open access journals, free to read in full.",
    featured: false,
    showInKiosk: false,
  },
  {
    slug: "dpla",
    title: "Digital Public Library of America",
    description:
      "Digitised books, photographs, manuscripts and records from thousands of US libraries, archives and museums.",
    url: "https://dp.la",
    searchUrlTemplate: "https://dp.la/search?q={query}",
    region: "International",
    tags: ["archives", "digitised", "photographs", "manuscripts"],
    access: ACCESS.OPEN,
    accessNote: "Free to view and use.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "internet-archive",
    title: "Internet Archive",
    description:
      "A vast library of texts, audio and video. Public domain items are free to read; in-copyright books are lending-only.",
    url: "https://archive.org",
    searchUrlTemplate: "https://archive.org/search?query={query}",
    region: "International",
    tags: ["texts", "audio", "video", "public domain"],
    access: ACCESS.PARTIAL,
    accessNote:
      "Public domain items are free to read. In-copyright books use Controlled Digital Lending, so you may need to borrow or join a waitlist.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "hathitrust",
    title: "HathiTrust Digital Library",
    description:
      "A large academic digital library. This link searches only the full-view titles, which are the ones you can actually read in full.",
    url: "https://catalog.hathitrust.org/Search/Home?filter%5B%5D=ht_availability%3AFull+text",
    searchUrlTemplate:
      "https://catalog.hathitrust.org/Search/Home?lookfor={query}&type=all&filter%5B%5D=ht_availability%3AFull+text",
    region: "International",
    tags: ["books", "academic", "digitised", "public domain"],
    access: ACCESS.PARTIAL,
    accessNote:
      "Only pre-1931 US and pre-1901 foreign works are fully readable. Everything else is search-only, so this link filters to full-view titles.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "open-library",
    title: "Open Library",
    description:
      "A catalogue entry for every book ever published. Many titles can be read or borrowed online.",
    url: "https://openlibrary.org",
    searchUrlTemplate: "https://openlibrary.org/search?q={query}",
    region: "International",
    tags: ["books", "catalogue", "lending"],
    access: ACCESS.PARTIAL,
    accessNote:
      "Public domain books are free to read. In-copyright titles are borrowable for a limited time.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "un-digital-library",
    title: "UN Digital Library",
    description:
      "United Nations documents, resolutions, voting records and open publications.",
    url: "https://digitallibrary.un.org/",
    searchUrlTemplate: "https://digitallibrary.un.org/search?p={query}",
    region: "International",
    tags: ["united nations", "policy", "documents", "international"],
    access: ACCESS.OPEN,
    accessNote: "Free to read and download.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "unesco-digital-library",
    title: "UNESCO Digital Library",
    description:
      "UNESCO's open archive of reports and publications on education, science, culture and communication.",
    url: "https://unesdoc.unesco.org/",
    searchUrlTemplate: "https://unesdoc.unesco.org/search/{query}",
    region: "International",
    tags: ["education", "culture", "science", "reports"],
    access: ACCESS.OPEN,
    accessNote: "Free to read and download.",
    featured: false,
    showInKiosk: true,
  },
  {
    slug: "openalex",
    title: "OpenAlex",
    description:
      "An open catalogue of the world's scholarly output — papers, authors, institutions and how they connect.",
    url: "https://openalex.org",
    searchUrlTemplate: "https://openalex.org/works?search={query}",
    region: "International",
    tags: ["scholarly", "metadata", "research", "open data"],
    access: ACCESS.OPEN,
    accessNote: "Metadata is CC0. Links out to free copies where they exist.",
    featured: false,
    showInKiosk: false,
  },
  {
    slug: "ssrn",
    title: "SSRN",
    description:
      "Early-stage research papers across the social sciences, shared before formal publication.",
    url: "https://www.ssrn.com",
    searchUrlTemplate: null,
    region: "International",
    tags: ["preprints", "social sciences", "working papers"],
    access: ACCESS.PARTIAL,
    accessNote:
      "Free to read, but these are preprints — they have not been peer-reviewed. SSRN is owned by Elsevier.",
    featured: false,
    showInKiosk: false,
  },
];

export function kioskLinks() {
  return curatedLinks.filter((link) => link.showInKiosk);
}

export function findBySlug(slug) {
  return curatedLinks.find((link) => link.slug === slug) ?? null;
}

export function buildSearchUrl(link, query) {
  if (!link.searchUrlTemplate || !query) return link.url;
  return link.searchUrlTemplate.replace("{query}", encodeURIComponent(query));
}
