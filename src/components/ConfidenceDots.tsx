import { CONFIDENCE, CONFIDENCE_DEFINITION, CONFIDENCE_LABEL, type Confidence } from "@/lib/schema";

/** Three dots, filled up to the confidence level. The text carries the meaning. */
export function ConfidenceDots({ level }: { level: Confidence }) {
  const filled = CONFIDENCE.indexOf(level) + 1;
  return (
    <span
      className="flex cursor-help flex-wrap items-center gap-x-3 gap-y-1"
      title={CONFIDENCE_DEFINITION[level]}
    >
      <span>{CONFIDENCE_LABEL[level]}</span>
      <span aria-hidden="true" className="flex items-center gap-1">
        {CONFIDENCE.map((c, i) => (
          <span
            key={c}
            className={`size-2.5 rounded-full ${
              i < filled ? "bg-neutral-900" : "border-[1.5px] border-neutral-300 bg-white"
            }`}
          />
        ))}
      </span>
      <span className="sr-only">. {CONFIDENCE_DEFINITION[level]}</span>
    </span>
  );
}
