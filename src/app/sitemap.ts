import type { MetadataRoute } from "next";
import { getOccupations } from "@/lib/occupations";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const occupations = getOccupations();
  const latest = occupations.map((o) => o.updatedAt).sort().at(-1);

  return [
    {
      url: SITE_URL,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/occupations`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...occupations.map((o) => ({
      url: `${SITE_URL}/occupations/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/methodology`,
      lastModified: latest,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
