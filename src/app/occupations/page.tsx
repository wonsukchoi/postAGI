import type { Metadata } from "next";
import { getOccupations } from "@/lib/occupations";
import { JsonLd } from "@/components/JsonLd";
import { OccupationList } from "@/components/OccupationList";
import { breadcrumbJsonLd, occupationListJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Occupations",
  description:
    "Browse occupations and see what AI has already replaced, with a status, evidence and sources for each.",
  path: "/occupations",
  image: "/opengraph-image",
});

export default function OccupationsPage() {
  return (
    <main className="mx-auto w-full max-w-[700px] px-6 pt-6 pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Occupations", path: "/occupations" },
        ])}
      />
      <JsonLd data={occupationListJsonLd(getOccupations())} />
      <h1 className="sr-only">Occupations: what has AI already replaced?</h1>
      <OccupationList occupations={getOccupations()} />
    </main>
  );
}
