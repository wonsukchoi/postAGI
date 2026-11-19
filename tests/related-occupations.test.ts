/**
 * Run: npm test
 *
 * Occupation pages link to each other (2026-11-19): before, only the /occupations hub linked to them,
 * and 24 of 36 sitemap URLs were still unknown to Google or discovered but not indexed.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getOccupations, getRelatedOccupations } from "../src/lib/occupations";

const live = getOccupations().filter((o) => !o.draft);

describe("getRelatedOccupations", () => {
  it("gives every live occupation 4 other live occupations, never itself or a draft", () => {
    for (const o of live) {
      const rel = getRelatedOccupations(o.slug);
      assert.equal(rel.length, 4, o.slug);
      assert.equal(new Set(rel.map((r) => r.slug)).size, 4, `${o.slug} repeats`);
      for (const r of rel) {
        assert.notEqual(r.slug, o.slug);
        assert.equal(r.draft, false, `${o.slug} links draft ${r.slug}`);
      }
    }
  });

  it("puts same-sector occupations first", () => {
    const finance = live.find((o) => live.filter((x) => x.sector === o.sector).length >= 3)!;
    const sameSector = live.filter((x) => x.sector === finance.sector && x.slug !== finance.slug).length;
    const rel = getRelatedOccupations(finance.slug);
    const lead = Math.min(4, sameSector);
    assert.ok(rel.slice(0, lead).every((r) => r.sector === finance.sector));
  });

  it("is stable between calls", () => {
    const a = getRelatedOccupations(live[0].slug).map((r) => r.slug);
    const b = getRelatedOccupations(live[0].slug).map((r) => r.slug);
    assert.deepEqual(a, b);
  });
});
