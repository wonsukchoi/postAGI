import { STATUS_LABEL, type Status } from "@/lib/schema";

const STYLE: Record<Status, string> = {
  replaced: "bg-neutral-900 text-white",
  partial: "bg-neutral-600 text-white",
  augmented: "bg-neutral-200 text-neutral-900",
  "not-yet": "border border-neutral-400 bg-white text-neutral-900",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-[13px] whitespace-nowrap ${STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
