import type { Occupation } from "./schema";

/**
 * Short, readable name for a source, taken from its full title.
 * "Qiao, Rui and Xiong: AI and Jobs, ..." becomes "Qiao, Rui and Xiong".
 * A trailing note in brackets is dropped: "European ... report (ELIS)" becomes "European ... report".
 */
export function shortSourceName(title: string): string {
  const beforeColon = title.split(":")[0];
  const withoutNote = beforeColon.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return withoutNote || title.trim();
}

/** The name to show for a task's source link. Falls back to the site's host name. */
export function taskSourceName(occ: Pick<Occupation, "sources">, url: string): string {
  const match = occ.sources.find((s) => s.url === url);
  if (match) return shortSourceName(match.title);
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
