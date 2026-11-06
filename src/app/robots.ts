import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Owner policy: allow every crawler, AI bots included, and block only Bytespider.
      // Do not disallow /_next/: Googlebot needs its JS and CSS to render pages.
      { userAgent: "*", allow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
