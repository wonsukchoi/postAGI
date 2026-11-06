import type { Occupation } from "./schema";
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

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
