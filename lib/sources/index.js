import * as doaj from "./doaj.js";
import * as openalex from "./openalex.js";
import * as unpaywall from "./unpaywall.js";
import * as openLibrary from "./openLibrary.js";
import * as googleBooks from "./googleBooks.js";
import * as dpla from "./dpla.js";
import * as internetArchive from "./internetArchive.js";
import * as pmc from "./pmc.js";
import * as doab from "./doab.js";

export const sources = [
  doaj,
  openalex,
  pmc,
  doab,
  dpla,
  internetArchive,
  openLibrary,
  googleBooks,
  unpaywall,
];

export const sourceMeta = sources.map((source) => ({
  ...source.meta,
  available: source.isAvailable(),
}));
