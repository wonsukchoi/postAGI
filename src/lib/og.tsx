/* Building blocks for the generated social preview images (next/og, Satori).
   Satori needs display:flex on any element with more than one child, and only
   supports a subset of CSS, so keep this plain. */
import { STATUS_LABEL, type Status } from "./schema";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

const ORDER: Status[] = ["not-yet", "augmented", "partial", "replaced"];

const BADGE: Record<Status, { background: string; color: string; border: string }> = {
  replaced: { background: "#111111", color: "#ffffff", border: "#111111" },
  partial: { background: "#525252", color: "#ffffff", border: "#525252" },
  augmented: { background: "#e5e5e5", color: "#111111", border: "#e5e5e5" },
  "not-yet": { background: "#ffffff", color: "#111111", border: "#a3a3a3" },
};

export function OgLogo({ size = 52 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="#111111"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 8V4" />
      <rect x="13" y="8" width="22" height="19" rx="6" />
      <path d="M6 44c0-8 7-12 18-12s18 4 18 12" />
      <circle cx="19.5" cy="17.5" r="2" fill="#111111" stroke="none" />
      <circle cx="28.5" cy="17.5" r="2" fill="#111111" stroke="none" />
      <circle cx="24" cy="3" r="1.8" fill="#111111" stroke="none" />
    </svg>
  );
}

/** White card with the logo and site name on top and the domain on the right. */
export function OgFrame({ children, domain }: { children: React.ReactNode; domain: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        color: "#111111",
        padding: "56px 64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <OgLogo />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#525252" }}>{domain}</div>
      </div>
      {children}
    </div>
  );
}

export function OgBadge({ status }: { status: Status }) {
  const s = BADGE[status];
  return (
    <div
      style={{
        display: "flex",
        background: s.background,
        color: s.color,
        border: `2px solid ${s.border}`,
        borderRadius: 10,
        padding: "8px 20px",
        fontSize: 28,
      }}
    >
      {STATUS_LABEL[status]}
    </div>
  );
}

/**
 * Line with four stops. With a status, the line fills up to it and the current
 * stop is enlarged. Without one, every stop is hollow (used on the default card).
 */
export function OgSpectrum({ status }: { status?: Status }) {
  const current = status ? ORDER.indexOf(status) : -1;
  const colWidth = 1072 / 4;
  const lineLeft = colWidth / 2;
  const lineWidth = colWidth * 3;
  const filled = current > 0 ? (current / 3) * lineWidth : 0;

  return (
    <div style={{ display: "flex", position: "relative", width: 1072, height: 96 }}>
      <div
        style={{
          position: "absolute",
          top: 14,
          left: lineLeft,
          width: lineWidth,
          height: 4,
          background: "#e5e5e5",
          display: "flex",
        }}
      />
      {filled > 0 && (
        <div
          style={{
            position: "absolute",
            top: 14,
            left: lineLeft,
            width: filled,
            height: 4,
            background: "#111111",
            display: "flex",
          }}
        />
      )}
      {ORDER.map((s, i) => {
        const isCurrent = i === current;
        const reached = i < current;
        const dot = isCurrent ? 32 : 24;
        return (
          <div
            key={s}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: colWidth,
            }}
          >
            <div style={{ display: "flex", height: 32, alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: dot,
                  height: dot,
                  borderRadius: 999,
                  background: isCurrent || reached ? "#111111" : "#ffffff",
                  border: isCurrent || reached ? "none" : "4px solid #d4d4d4",
                  boxShadow: isCurrent ? "0 0 0 8px #e5e5e5" : "none",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 26,
                fontWeight: isCurrent ? 700 : 400,
                color: isCurrent ? "#111111" : "#737373",
              }}
            >
              {STATUS_LABEL[s]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
