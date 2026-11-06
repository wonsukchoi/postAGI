import { STATUS_LABEL, type Status } from "@/lib/schema";

/** Left = not replaced, right = fully replaced. */
const ORDER: Status[] = ["not-yet", "augmented", "partial", "replaced"];

/**
 * A line with four stops and a marker on the current status.
 * Position shows the status level, not a measured percentage.
 */
export function StatusSpectrum({ status }: { status: Status }) {
  const current = ORDER.indexOf(status);
  // The line runs between the first and last stop centers: 12.5% to 87.5% of the width.
  const filled = (current / (ORDER.length - 1)) * 75;

  return (
    <figure className="flex flex-col gap-5 rounded-xl border border-neutral-200 px-5 py-5">
      <figcaption className="text-sm font-medium">Where this job stands</figcaption>

      <div className="relative">
        <div aria-hidden="true" className="absolute top-2 left-[12.5%] h-0.5 w-[75%] bg-neutral-200" />
        <div
          aria-hidden="true"
          className="absolute top-2 left-[12.5%] h-0.5 bg-neutral-900"
          style={{ width: `${filled}%` }}
        />

        <ol aria-label="From not replaced to fully replaced" className="relative grid grid-cols-4">
          {ORDER.map((s, i) => {
            const isCurrent = i === current;
            const reached = i < current;
            return (
              <li
                key={s}
                aria-current={isCurrent ? "true" : undefined}
                className="flex flex-col items-center gap-2.5 text-center"
              >
                <span className="flex h-[18px] items-center justify-center">
                  <span
                    aria-hidden="true"
                    className={
                      isCurrent
                        ? "size-[18px] rounded-full bg-neutral-900 ring-4 ring-neutral-200"
                        : reached
                          ? "size-3.5 rounded-full bg-neutral-900"
                          : "size-3.5 rounded-full border-2 border-neutral-300 bg-white"
                    }
                  />
                </span>
                <span
                  className={`text-xs leading-tight sm:text-sm ${
                    isCurrent ? "font-semibold text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  {STATUS_LABEL[s]}
                  {isCurrent && <span className="sr-only"> (current status)</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-xs text-neutral-500">
        The marker shows the status level, not a measured percentage.
      </p>
    </figure>
  );
}
