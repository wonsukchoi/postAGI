/**
 * Run: npx tsx --test tests/occupation-list-search-layout.test.ts
 *
 * /mobbin pass on postagi.fyi (2026-11-20): on a 390px phone the search field shared one 52px row
 * with the sort select and was squeezed to about 135px, so its placeholder read "Search occupatic".
 * Below sm the search now takes its own full-width row and the sort select sits under it, right
 * aligned; from sm up it is the old single 52px row. Source-level check of the three classes.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const src = readFileSync("src/components/OccupationList.tsx", "utf8");
const line = (needle: string) => src.split("\n").find((l) => l.includes(needle)) ?? "";

describe("OccupationList search and sort bar", () => {
  it("wraps below sm and keeps the single 52px row from sm up", () => {
    const bar = line("rounded-xl bg-neutral-100 px-4");
    assert.match(bar, /\bflex-wrap\b/);
    assert.match(bar, /sm:flex-nowrap/);
    assert.match(bar, /sm:h-\[52px\]/);
    assert.doesNotMatch(bar, /(^|\s)h-\[52px\]/, "no unconditional fixed height");
  });

  it("gives the search input its own row below sm", () => {
    const input = line("min-w-0 basis-full");
    assert.match(input, /\bbasis-full\b/);
    assert.match(input, /sm:flex-1/);
    assert.match(input, /\btext-base\b/);
  });

  it("right-aligns the sort select under the search, without moving it from sm up", () => {
    const wrap = line("relative mb-2 ml-auto");
    assert.match(wrap, /sm:ml-0/);
    assert.match(wrap, /sm:mb-0/);
  });
});
