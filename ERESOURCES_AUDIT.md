# E-Resources Audit

**Date:** 2026-09-16
**Scope:** LIT Digital Library graphic, `opac/` (ValACE Discovery Layer), and `opac.valace.local` kiosk launcher (`opaccounter/`)

Each resource was checked for live status (HTTP reachability) and whether it is genuinely open access (free to read *and* not paywalled/restricted) or only partially/marketed as such.

Legend: ✅ genuinely open access · ⚠️ mixed/partial access · ❌ not open access · 🔧 needs fix

---

## 1. LIT Digital Library graphic

| Resource | URL | Status |
|---|---|---|
| DPLA | https://dp.la | ✅ |
| Project Gutenberg | https://www.gutenberg.org | ✅ |
| Internet Archive | https://archive.org | ⚠️ Public domain content is free; in-copyright books use Controlled Digital Lending (borrow/wait-list) |
| HathiTrust | https://www.hathitrust.org | ⚠️ Only pre-1931 (US) / pre-1901 (foreign) works are fully open; most in-copyright items are access-restricted regardless of contributing library |
| Routledge / Taylor & Francis | https://www.routledge.com | ❌ Primarily a subscription publisher; OA only available per-article via paid Open Select/APC |
| DOAB | https://www.doabooks.org | ✅ |
| Open Book Publishers | https://www.openbookpublishers.com | ✅ |
| DOAJ | https://doaj.org | ✅ |
| SpringerOpen | https://www.springeropen.com | ✅ |
| Wiley | https://onlinelibrary.wiley.com | ❌ Mostly subscription; hybrid OA only via paid author charge |
| SSRN | https://www.ssrn.com | ⚠️ Free to read but not peer-reviewed (preprints only); owned by Elsevier |
| NIH / NLM (PubMed Central) | https://pmc.ncbi.nlm.nih.gov | ✅ |
| Unidentified pink/orange geometric icon | — | Not identified — image resolution too low to confirm |

---

## 2. `opac/` project — curated external links
(`backend/database/seeders/CuratedLinksSeeder.php`)

| Resource | URL | Status |
|---|---|---|
| DOST STARBOOKS | https://www.starbooks.ph/ | ✅ |
| NLP-EResources | http://web.nlp.gov.ph/nlp/?q=node/1449 | 🔧 Resolves (301→200) but lands on the generic NLP homepage, not an e-resources page — the old Drupal-style URL is stale after their WordPress migration |
| Philippine eLib | https://www.elib.gov.ph/ | ✅ |
| Project Gutenberg | https://www.gutenberg.org/ | ✅ |
| DOAJ | https://doaj.org/ | ✅ |

## `opac/` project — live API integrations

| Service | Endpoint | Status |
|---|---|---|
| DOAJ API | https://doaj.org/api/v4/search/articles/ | ✅ Open, no key required |
| OpenAlex | https://api.openalex.org/works | ✅ Fully open, CC0 metadata, no key |
| Unpaywall | https://api.unpaywall.org/v2/ | ⚠️ Legitimately OA-focused, but requires a real contact email per its terms — `.env.example` currently defaults to placeholder `admin@valace.local`; set `UNPAYWALL_EMAIL` to a real monitored address in production |
| Open Library | https://openlibrary.org/search.json | ⚠️ Search/metadata API is open, but full-text access to in-copyright books is lending-restricted (Internet Archive backend) |
| Google Books | Google Books API | ❌ Commercial/proprietary API, mostly snippet/preview access — `About.jsx` currently describes it alongside Open Library as "open-source e-books," which overstates it |

---

## 3. `opac.valace.local` kiosk launcher
(LAN-only; source data in `opaccounter/opac_counter.sql`)

| Button | URL | Status |
|---|---|---|
| Valenzuela City OPAC | https://library.valenzuela.gov.ph | ✅ |
| NLP E-PORTAL | https://eportal.nlp.gov.ph/ | ✅ |
| TechnoAklatan | https://nlpdl.nlp.gov.ph/ | ✅ |
| KWF (Komisyon sa Wikang Filipino) | https://library.kwf.gov.ph/ | ✅ |
| Acta Medica Philippina | https://actamedicaphilippina.upm.edu.ph/ | ✅ |
| UN Digital Library | https://digitallibrary.un.org/ | ✅ |
| UNESCO Digital Library | https://unesdoc.unesco.org/ | ✅ |
| PIDS (Philippine Institute for Development Studies) | https://www.pids.gov.ph/ | ✅ |
| DOST-STARBOOKS | ~~http://192.168.100.252/starbooks-admin/login~~ | 🔧 **Fix needed** — currently points to a LAN-only IP admin login screen instead of the public catalog. **Correct URL: https://www.starbooks.ph/** — update row id 8 in `opaccounter/opac_counter.sql` |

---

## Action items

1. **`opaccounter/opac_counter.sql`** (row id 8, DOST-STARBOOKS) — replace `http://192.168.100.252/starbooks-admin/login` with `https://www.starbooks.ph/`.
2. **`opac/backend/database/seeders/CuratedLinksSeeder.php`** — update the NLP-EResources URL to a current, working NLP e-resources page (the existing `?q=node/1449` link is stale).
3. **`opac/backend/.env`** (production) — set `UNPAYWALL_EMAIL` to a real monitored email instead of leaving the `admin@valace.local` placeholder.
4. **`opac/frontend/src/pages/About.jsx`** — revise copy that groups Google Books with Open Library as "open-source e-books"; Google Books is a commercial preview API, not an open access source.
