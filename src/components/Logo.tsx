/** postAGI mark: a robot head on human shoulders. Same artwork as src/app/icon.svg. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 8V4" />
      <rect x="13" y="8" width="22" height="19" rx="6" />
      <path d="M6 44c0-8 7-12 18-12s18 4 18 12" />
      <g fill="currentColor" stroke="none">
        <circle cx="19.5" cy="17.5" r="2" />
        <circle cx="28.5" cy="17.5" r="2" />
        <circle cx="24" cy="3" r="1.8" />
      </g>
    </svg>
  );
}
