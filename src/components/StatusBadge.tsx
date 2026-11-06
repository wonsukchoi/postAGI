import { STATUS_LABEL, type Status } from "@/lib/schema";

const STYLE: Record<Status, string> = {
  replaced: "bg-neutral-900 text-white",
  partial: "bg-neutral-600 text-white",
  augmented: "bg-neutral-200 text-neutral-900",
  "not-yet": "border border-neutral-400 bg-white text-neutral-900",
};

/**
 * A circle that fills up with the level, so the badge reads without relying on shade:
 * empty, a quarter, a half, full. Same order as the "Where this job stands" scale.
 * It shows the level, not a measured percentage. The label text carries the meaning
 * for screen readers, so the glyph is hidden from them.
 */
const FILL: Record<Status, string | null> = {
  "not-yet": null,
  augmented: "M6 6V1.5A4.5 4.5 0 0 1 10.5 6Z",
  partial: "M6 6V1.5A4.5 4.5 0 0 1 6 10.5Z",
  replaced: "M6 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z",
};

function Glyph({ status }: { status: Status }) {
  const fill = FILL[status];
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {fill && <path d={fill} fill="currentColor" />}
    </svg>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] whitespace-nowrap ${STYLE[status]}`}
    >
      <Glyph status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}
