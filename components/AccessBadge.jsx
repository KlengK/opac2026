import { ACCESS, ACCESS_LABELS } from "@/lib/access.js";

// Never colour alone: each level carries its own shape and its own words, so the
// meaning survives greyscale, colour blindness and a screen reader.
const STYLES = {
  [ACCESS.OPEN]: {
    className: "bg-open-soft text-open border-open",
    symbol: "●",
  },
  [ACCESS.PARTIAL]: {
    className: "bg-partial-soft text-partial border-partial",
    symbol: "◐",
  },
  [ACCESS.METADATA]: {
    className: "bg-meta-soft text-meta border-meta",
    symbol: "○",
  },
};

export default function AccessBadge({ access, note }) {
  const style = STYLES[access] ?? STYLES[ACCESS.METADATA];
  const label = ACCESS_LABELS[access] ?? ACCESS_LABELS[ACCESS.METADATA];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.className}`}
      title={note || undefined}
    >
      <span aria-hidden="true">{style.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
