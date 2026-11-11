/**
 * Run: npm test
 *
 * The home page carries Dataset JSON-LD for the occupation data (MIT, owner 2026-11-11). Every
 * download URL must point at a real data file, and the description must stay within Google's
 * 50-5,000 character range.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import { datasetJsonLd } from "../src/lib/jsonld";
import { getOccupations } from "../src/lib/occupations";

const occupations = getOccupations();
const ld = JSON.parse(JSON.stringify(datasetJsonLd(occupations)));

describe("Dataset JSON-LD", () => {
  it("is a Dataset with an MIT licence, a creator and a description Google accepts", () => {
    assert.equal(ld["@type"], "Dataset");
    assert.equal(ld.license, "https://opensource.org/license/mit");
    assert.equal(ld.creator.name, "postAGI contributors");
    assert.ok(ld.description.length >= 50 && ld.description.length <= 5000);
    assert.ok(ld.description.includes(String(occupations.length)));
  });

  it("offers one JSON download per occupation file that exists in the repo", () => {
    const files = fs.readdirSync("content/occupations").filter((f) => f.endsWith(".json")).sort();
    assert.equal(ld.distribution.length, files.length);
    for (const d of ld.distribution) {
      assert.equal(d.encodingFormat, "application/json");
      const file = d.contentUrl.split("/").at(-1);
      assert.ok(files.includes(file), `${d.contentUrl} has no file in content/occupations`);
    }
  });

  it("is dated by the newest occupation update and cites each source once", () => {
    const newest = occupations.map((o) => o.updatedAt).sort().at(-1);
    assert.equal(ld.dateModified, newest);
    const urls = ld.citation.map((c: { url: string }) => c.url);
    assert.equal(new Set(urls).size, urls.length);
  });

  it("the licence and the data are linked from the visible footer", () => {
    const footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
    assert.ok(footer.includes("Data (JSON)") && footer.includes("License"));
  });
});
