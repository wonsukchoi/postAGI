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
  if (cache) return cache;

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
