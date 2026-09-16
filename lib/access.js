// Honest access vocabulary. ERESOURCES_AUDIT.md found that the previous system
// described lending-restricted and preview-only sources as "open access", which
// misleads users about what they will actually be able to read. Every result
// carries one of these three levels, and the UI always shows it.

export const ACCESS = {
  OPEN: "open",
  PARTIAL: "partial",
  METADATA: "metadata",
};

export const ACCESS_LABELS = {
  [ACCESS.OPEN]: "Free full text",
  [ACCESS.PARTIAL]: "Limited access",
  [ACCESS.METADATA]: "Preview or record only",
};

export const ACCESS_DESCRIPTIONS = {
  [ACCESS.OPEN]: "Openly licensed or public domain. You can read the whole thing for free.",
  [ACCESS.PARTIAL]: "Free to read, but with a restriction such as borrowing, a waitlist, or partial coverage.",
  [ACCESS.METADATA]: "Catalogue record or preview only. Full text is not openly available here.",
};

export const ACCESS_ORDER = [ACCESS.OPEN, ACCESS.PARTIAL, ACCESS.METADATA];
