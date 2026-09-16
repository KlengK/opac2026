import { curatedLinks } from "../data/curatedLinks.js";
import { sources } from "./sources/index.js";

// A collection can appear in both lists: searched live through its API and also
// listed as a portal so people can browse the whole thing. Counting the two
// lists separately would double-count those, so entries that are both carry a
// `liveSource` key tying them to their API module.
export function resourceCounts() {
  const alsoLive = new Set(curatedLinks.map((link) => link.liveSource).filter(Boolean));
  const liveOnly = sources.filter((source) => !alsoLive.has(source.meta.key));

  return {
    total: curatedLinks.length + liveOnly.length,
    live: sources.length,
    portals: curatedLinks.length,
    searchableAndBrowsable: alsoLive.size,
    philippine: curatedLinks.filter((link) => link.region === "Philippines").length,
  };
}
