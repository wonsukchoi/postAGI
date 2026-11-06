import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./site";

type PageMeta = {
  /** Page title without the site name; the layout template adds " | postAGI". */
  title?: string;
  /** Full title for link previews. Defaults to "<title> | postAGI". */
  ogTitle?: string;
  description?: string;
  /** Preview image path for pages without their own opengraph-image file. */
  image?: string;
  /** Path starting with "/", used for the canonical URL and og:url. */
  path: string;
  type?: "website" | "article";
};

/**
 * Builds title, canonical URL, OpenGraph and Twitter metadata in one place.
 * Next.js replaces (does not merge) nested openGraph objects, so every page
 * needs the full set. The preview image comes from the opengraph-image files.
 */
export function pageMetadata({
  title,
  ogTitle,
  description = SITE_DESCRIPTION,
  image,
  path,
  type = "website",
}: PageMeta): Metadata {
  const fullTitle = ogTitle ?? (title ? `${title} | ${SITE_NAME}` : undefined);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
