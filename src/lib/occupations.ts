import fs from "node:fs";
import path from "node:path";
import { OccupationSchema, type Occupation } from "./schema";

const DIR = path.join(process.cwd(), "content", "occupations");

let cache: Occupation[] | null = null;

/**
 * Reads and validates every file in content/occupations.
 * Throws with a readable message on the first bad file, which fails `next build`.
 */
export function getOccupations(): Occupation[] {
  // Cache only in production builds. In dev, re-read so edits to JSON show up.
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
  const seen = new Set<string>();
  const list: Occupation[] = [];

  for (const file of files) {
    const where = `content/occupations/${file}`;
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
    } catch (e) {
      throw new Error(`${where}: invalid JSON (${(e as Error).message})`);
    }

    const parsed = OccupationSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`${where} failed validation:\n${issues}`);
    }

    const occ = parsed.data;
    for (const tool of occ.aiTools) {
      if (tool.logo && !fs.existsSync(path.join(process.cwd(), "public", tool.logo))) {
        throw new Error(
          `${where}: logo "${tool.logo}" for "${tool.name}" does not exist in public/`,
        );
      }
    }
    if (`${occ.slug}.json` !== file) {
      throw new Error(`${where}: slug "${occ.slug}" must match the file name`);
    }
    if (seen.has(occ.slug)) {
      throw new Error(`${where}: duplicate slug "${occ.slug}"`);
    }
    seen.add(occ.slug);
    list.push(occ);
  }

  cache = list;
  return list;
}

export function getOccupation(slug: string): Occupation | undefined {
  return getOccupations().find((o) => o.slug === slug);
}

/**
 * Other occupation pages to link from one occupation page, so the pages link to each other and
 * not only through the /occupations hub (Search Console 2026-11-20: 24 of 36 sitemap URLs were
 * "unknown" or "discovered, not indexed" two weeks after launch; the occupation pages had no
 * links between them). Same sector first, then same status, then the rest; ties by slug, so the
 * list never changes unless the data does. Drafts are never offered.
 */
export function getRelatedOccupations(slug: string, limit = 4): Occupation[] {
  const all = getOccupations().filter((o) => !o.draft);
  const self = all.find((o) => o.slug === slug);
  const rank = (o: Occupation) => (self && o.sector === self.sector ? 0 : self && o.status === self.status ? 1 : 2);
  return all
    .filter((o) => o.slug !== slug)
    .sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}
