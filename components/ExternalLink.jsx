// Every link that leaves the catalogue opens in a new tab so the reader keeps
// their search results. Opening a new tab unannounced is disorienting for screen
// reader users, so the hint is always in the accessible name.
export default function ExternalLink({ href, className, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
