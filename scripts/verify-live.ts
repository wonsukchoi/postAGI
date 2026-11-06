/**
 * Checks that the live site is whole after a deploy: every page in the sitemap returns
 * 200, and every script and stylesheet those pages reference returns 200 too. A page
 * that loads but points at a file that is missing looks "broken" to visitors, which is
 * the failure a stale cache causes right after a deploy.
 *
 * Retries for up to 90 seconds (set VERIFY_DEADLINE_SECONDS to change), because new pages can take a moment to appear at every
 * edge location. Usage: npm run verify:live [base-url]
 */
import { SITE_URL } from "../src/lib/site";

const base = (process.argv[2] ?? SITE_URL).replace(/\/$/, "");
const DEADLINE_MS = Number(process.env.VERIFY_DEADLINE_SECONDS ?? 90) * 1000;
const WAIT_MS = 5_000;

async function status(url: string): Promise<number> {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "Cache-Control": "no-cache" } });
    await res.arrayBuffer();
    return res.status;
  } catch {
    return 0;
  }
}

/** One full pass. Returns the problems found, empty when the site is whole. */
async function pass(): Promise<string[]> {
  const problems: string[] = [];
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE_URL, base));
  if (pages.length === 0) return ["sitemap.xml lists no pages"];

  const assets = new Set<string>();
  for (const page of pages) {
    const res = await fetch(page, { headers: { "Cache-Control": "no-cache" } }).catch(() => null);
    if (!res || res.status !== 200) {
      problems.push(`${page} -> ${res ? res.status : "no response"}`);
      continue;
    }
    const html = await res.text();
    for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);
  }
  for (const path of assets) {
    const code = await status(`${base}${path}`);
    if (code !== 200) problems.push(`${base}${path} -> ${code}`);
  }
  if (problems.length === 0) console.log(`OK: ${pages.length} pages and ${assets.size} assets all return 200.`);
  return problems;
}

async function main() {
  const start = Date.now();
  let problems = await pass();
  while (problems.length > 0 && Date.now() - start < DEADLINE_MS) {
    console.log(`${problems.length} problem(s), retrying in ${WAIT_MS / 1000}s...`);
    await new Promise((r) => setTimeout(r, WAIT_MS));
    problems = await pass();
  }
  if (problems.length > 0) {
    console.error("Live site is NOT whole:\n" + problems.map((p) => `  ${p}`).join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`Check failed: ${(e as Error).message}`);
  process.exit(1);
});
