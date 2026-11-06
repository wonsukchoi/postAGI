import type { Metadata } from "next";
import { getOccupations } from "@/lib/occupations";
import { OccupationList } from "@/components/OccupationList";

export const metadata: Metadata = { title: "Occupations" };

export default function OccupationsPage() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-6 pt-6 pb-16">
      <OccupationList occupations={getOccupations()} />
    </main>
  );
}
