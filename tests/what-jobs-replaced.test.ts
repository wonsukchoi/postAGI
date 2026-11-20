/**
 * Run: npm test
 *
 * /what-jobs-has-ai-replaced answers the head question of the site ("what jobs has AI already replaced",
 * 2026-11-19: OpenSEO "how many jobs has ai replaced" 720 a month, "what jobs has ai already replaced" 260;
 * no page answered it). Its text comes from the data, so these tests pin the data-to-page contract.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import sitemap from "../src/app/sitemap";
import { getOccupations, groupByStatus } from "../src/lib/occupations";
import { STATUSES } from "../src/lib/schema";

const live = getOccupations().filter((o) => !o.draft);

describe("groupByStatus", () => {
  it("puts every live occupation in exactly one group", () => {
    const g = groupByStatus(getOccupations());
    const slugs = STATUSES.flatMap((s) => g[s].map((o) => o.slug));
    assert.equal(slugs.length, live.length);
    assert.equal(new Set(slugs).size, live.length);
  });

  it("keeps each group sorted by title", () => {
    const g = groupByStatus(getOccupations());
    for (const s of STATUSES) {
      const titles = g[s].map((o) => o.title);
      assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b)));
    }
  });
});

describe("the page is reachable", () => {
  it("is in the sitemap", () => {
    assert.ok(sitemap().some((e) => e.url === "https://postagi.fyi/what-jobs-has-ai-replaced"));
  });

  it("is linked from the home page, the occupations hub and the methodology page", () => {
    for (const f of ["src/app/page.tsx", "src/app/occupations/page.tsx", "src/app/methodology/page.tsx"]) {
      assert.match(fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), /href="\/what-jobs-has-ai-replaced"/, f);
    }
  });

  it("states no number of lost jobs: counts come from the data only", () => {
    const src = fs.readFileSync(new URL("../src/app/what-jobs-has-ai-replaced/page.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(src, /\d[\d,]*\s*(million|thousand|jobs lost)/i);
  });
});
