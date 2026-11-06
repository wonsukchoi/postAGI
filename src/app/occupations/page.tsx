import type { Metadata } from "next";
import { getOccupations } from "@/lib/occupations";
import { OccupationList } from "@/components/OccupationList";
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
    <main className="mx-auto w-full max-w-[1040px] px-6 pt-6 pb-16">
      <OccupationList occupations={getOccupations()} />
    </main>
  );
}
