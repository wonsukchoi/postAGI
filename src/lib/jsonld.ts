import type { Occupation } from "./schema";
import { DATA_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, rawDataUrl } from "./site";

/** schema.org JSON-LD builders. Only facts that are already on the page go in here. */

const CONTEXT = "https://schema.org";

/** The site as a publisher. The logo is a raster image, as Google requires. */
const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png`, width: 180, height: 180 },
  sameAs: [REPO_URL],
};

export function websiteJsonLd() {
  return {
    "@context": CONTEXT,
    "@graph": [
      ORGANIZATION,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

/** Breadcrumb trail. The last crumb is the current page. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export function occupationListJsonLd(occupations: Occupation[]) {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: "Occupations tracked by postAGI",
    numberOfItems: occupations.length,
    itemListElement: occupations.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: o.title,
      url: `${SITE_URL}/occupations/${o.slug}`,
    })),
  };
}

/** One occupation page as an article that cites its sources. */
export function occupationJsonLd(occ: Occupation) {
  const url = `${SITE_URL}/occupations/${occ.slug}`;
  return {
    "@context": CONTEXT,
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `${occ.title}: has AI replaced it?`,
    description: occ.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    dateModified: occ.updatedAt,
    inLanguage: "en",
    image: [`${url}/opengraph-image`],
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: ORGANIZATION,
    about: { "@type": "Occupation", name: occ.title },
    citation: occ.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })),
  };
}

/**
 * The occupation data as a Dataset (Google Dataset Search). The data files are MIT, like the code
 * (owner, 2026-11-11; the footer links the licence and the data folder), and each occupation's JSON
 * file is downloadable from the public repo.
 */
export function datasetJsonLd(occupations: Occupation[]) {
  const modified = occupations.map((o) => o.updatedAt).sort().at(-1);
  const seen = new Set<string>();
  const citation = occupations
    .flatMap((o) => o.sources)
    .filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)))
    .map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url }));
  return {
    "@context": CONTEXT,
    "@type": "Dataset",
    "@id": `${SITE_URL}/#dataset`,
    name: `${SITE_NAME}: occupations and what AI has already replaced`,
    description: `${SITE_DESCRIPTION} One JSON file per occupation (${occupations.length} today) with its status, confidence, the AI tools involved and the sources behind each claim.`,
    url: SITE_URL,
    sameAs: DATA_URL,
    license: "https://opensource.org/license/mit",
    isAccessibleForFree: true,
    inLanguage: "en",
    creator: { "@type": "Organization", name: "postAGI contributors", url: REPO_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(modified ? { dateModified: modified } : {}),
    keywords: ["artificial intelligence", "automation", "occupations", "jobs", "labour market"],
    distribution: occupations.map((o) => ({
      "@type": "DataDownload",
      name: `${o.title} (JSON)`,
      encodingFormat: "application/json",
      contentUrl: rawDataUrl(o.slug),
    })),
    citation,
  };
}
