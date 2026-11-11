export const SITE_NAME = "postAGI";
export const SITE_URL = "https://postagi.fyi";
export const SITE_TAGLINE = "Which occupations AI has already replaced.";
export const SITE_DESCRIPTION =
  "An open, sourced list of occupations and what AI has already replaced. Every claim links to a source.";
export const REPO_URL = "https://github.com/wonsukchoi/postAGI";
/** The occupation data files in the repo (MIT, like the code). */
export const DATA_URL = `${REPO_URL}/tree/main/content/occupations`;
export function rawDataUrl(slug: string): string {
  return `https://raw.githubusercontent.com/wonsukchoi/postAGI/main/content/occupations/${slug}.json`;
}

/** Self-hosted analytics. Loaded only in production builds. */
export const ANALYTICS = {
  src: "https://analytics.wonsukchoi.com/script.js",
  websiteId: "2f20c0d4-16c8-4017-afd0-8842d5764bec",
};
