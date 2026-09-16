# OPAC 2026 — Open Public Access Catalog

One search box across the world's open access collections. No account, no
institution, no paywall — and every result states up front how much of it you can
actually read.

Built for students, teachers, researchers and the general public, including people
using a shared library terminal or a phone on a slow connection.

## What it does

- **Federated search** across nine collections at once, merged into one ranked list.
- **Honest access labelling.** Every result is marked *Free full text*, *Limited
  access*, or *Preview or record only*. Openly readable material always ranks first,
  because a catalogue that promises open access should not lead with records nobody
  can open.
- **Curated portals.** Philippine and international collections that have no usable
  search API are surfaced as whole-collection cards, deep-linked into their own search
  where possible.
- **Kiosk mode** for library terminals, with an optional demographic survey and an
  accessible, pausable countdown before leaving the site.
- **WCAG 2.1 AA.** Zero axe-core violations across every page in both light and dark
  themes, verified in-browser.

## Sources

| Source | How it is used |
|---|---|
| DOAJ | Live API. Peer-reviewed articles from fully open journals. |
| OpenAlex | Live API, filtered to `is_oa:true`. |
| PubMed Central | Live API (NCBI E-utilities). |
| DOAB | Live API (DSpace 5 REST). Also covers the Open Book Publishers catalogue. |
| Internet Archive | Live API, `mediatype:texts`, with the lending-only `inlibrary` collection excluded. |
| Open Library | Live API. Access level derived from `ebook_access`, so lending-only titles are not called open. |
| DPLA | Live API. Requires a free API key. |
| Google Books | Live API, `filter=free-ebooks`. Requires a key in practice. Only genuine public domain volumes are labelled open. |
| Unpaywall | DOI lookup only. Requires a real contact email per its terms. |
| HathiTrust, SpringerOpen, SSRN, and the Philippine portals | Curated cards, deep-linked into their own search. HathiTrust is pre-filtered to full-view titles only. |

Sources that are down, slow or unconfigured never break a search — the results page
reports exactly which collections it reached.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the keys you have
npm run dev
```

Open http://localhost:3000. The catalogue works with no keys at all; DPLA, Google
Books and Unpaywall simply report themselves as unconfigured until you add theirs.

```bash
npm test        # unit tests plus axe accessibility assertions
npm run build   # production build
```

## Deploying

This prototype targets **Vercel**. Import the repository, then set the environment
variables from `.env.example` in the project settings. Everything under `app/api/`
runs as a serverless function; there is no database and no other backing service.

External responses are cached for 24 hours through Next's fetch cache, and the search
route sets `s-maxage=3600`, which is enough for a prototype's traffic.

## What this prototype does not do

There is no database, so there are deliberately no user accounts, no saved searches,
no reading lists, no staff admin panel, and no analytics. The kiosk survey collects
nothing — the screen exists to demonstrate the flow, and says so on the page itself.

Curated portals live in `data/curatedLinks.js` as a static file. Its fields are shaped
like database columns so moving them into a `curated_links` table later is mechanical.

## Roadmap

The production release adds persistence, containerized with Docker:

- Postgres/MySQL, replacing `data/curatedLinks.js` with a real table plus admin CRUD.
- A staff admin panel with its own local password auth — explicitly not Koha-backed.
- Persistent analytics: search events, click telemetry, and kiosk survey responses.
- Redis caching in place of Next's route cache once traffic justifies it.
- Docker Compose deployment for self-hosting on library infrastructure.
- CI running lint, unit tests, axe checks and a build on every pull request.

## Layout

```
app/
  api/search/route.js     search endpoint — fans out, merges, returns JSON
  page.js                 search UI
  collections/, about/, kiosk/
lib/
  aggregate.js            merge, dedupe, rank, facet
  access.js               the three-level access vocabulary
  subjects.js             subject to taxonomy mapping
  sources/                one module per collection
data/curatedLinks.js      curated portals (static stand-in for a DB table)
components/               UI
tests/                    unit and accessibility tests
```
