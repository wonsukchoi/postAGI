import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOccupation, getOccupations } from "@/lib/occupations";
import { STATUS_LABEL, type Occupation } from "@/lib/schema";
import { StatusBadge } from "@/components/StatusBadge";
import { REPO_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getOccupations().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata(
  props: PageProps<"/occupations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const occ = getOccupation(slug);
  return occ ? { title: occ.title, description: occ.summary } : {};
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-neutral-200 px-5 py-4 last:border-r-0">
      <dt className="text-xs text-neutral-600">{label}</dt>
      <dd className="mt-1.5 text-[26px] leading-tight">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function OccupationPage(
  props: PageProps<"/occupations/[slug]">,
) {
  const { slug } = await props.params;
  const occ: Occupation | undefined = getOccupation(slug);
  if (!occ) notFound();

  const paragraphs = occ.evidence.split(/\n\s*\n/);

  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col gap-8 px-6 pt-8 pb-16">
      <div className="flex flex-col gap-3">
        <Link href="/occupations" className="text-sm text-neutral-600 hover:text-neutral-900">
          ← All occupations
        </Link>
        <h1 className="text-[28px] font-semibold">{occ.title}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-600">
          <span>{occ.sources.length} sources</span>
          <span>Updated {occ.updatedAt}</span>
          <span>Sector: {occ.sector}</span>
        </div>
        <p className="text-[17px] leading-normal text-neutral-800">{occ.summary}</p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={occ.status} />
        </div>
        {occ.draft && (
          <p
            role="note"
            className="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
          >
            Draft: this page holds placeholder content and has not been verified.
          </p>
        )}
      </div>

      <dl className="grid grid-cols-3 rounded-xl border border-neutral-200">
        <Stat
          label="Tasks automated"
          value={occ.tasksAutomatedPct === null ? "Unknown" : `${occ.tasksAutomatedPct}%`}
        />
        <Stat
          label="Year replaced"
          value={occ.yearReplaced === null ? "Unknown" : String(occ.yearReplaced)}
        />
        <Stat
          label="Confidence"
          value={occ.confidence[0].toUpperCase() + occ.confidence.slice(1)}
        />
      </dl>

      <Section title="AI tools doing this job">
        {occ.aiTools.length === 0 ? (
          <p className="text-sm text-neutral-600">None listed yet.</p>
        ) : (
          <ul className="flex flex-col rounded-xl border border-neutral-200">
            {occ.aiTools.map((t) => (
              <li key={t.name} className="border-b border-neutral-100 last:border-b-0">
                <a
                  href={t.url}
                  className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-neutral-50"
                >
                  {t.logo ? (
                    <Image
                      src={t.logo}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="size-8 shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white"
                    >
                      {(t.name.match(/[A-Za-z0-9]/)?.[0] ?? "?").toUpperCase()}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-medium">{t.name}</span>
                    <span className="text-[13px] text-neutral-600">{t.description}</span>
                  </span>
                  <span className="text-[13px] text-neutral-600">source ↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Task breakdown">
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-600">
                <th className="border-b border-neutral-200 px-4 py-3 font-medium">Task</th>
                <th className="border-b border-neutral-200 px-4 py-3 font-medium">Status</th>
                <th className="border-b border-neutral-200 px-4 py-3 font-medium">Tool</th>
                <th className="border-b border-neutral-200 px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {occ.tasks.map((t) => (
                <tr key={t.task}>
                  <td className="border-b border-neutral-100 px-4 py-3">{t.task}</td>
                  <td className="border-b border-neutral-100 px-4 py-3">{STATUS_LABEL[t.status]}</td>
                  <td className="border-b border-neutral-100 px-4 py-3">{t.tool ?? "-"}</td>
                  <td className="border-b border-neutral-100 px-4 py-3">
                    {t.sourceUrl ? (
                      <a href={t.sourceUrl} className="underline">
                        link
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/methodology" className="text-[13px] text-neutral-600 hover:text-neutral-900">
          How we rate →
        </Link>
      </Section>

      <Section title="Evidence">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-neutral-800">
            {p}
          </p>
        ))}
      </Section>

      <Section title="References">
        <ul className="flex flex-col gap-2.5">
          {occ.sources.map((s) => (
            <li key={s.url + s.title}>
              <a href={s.url} className="text-sm underline">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`${REPO_URL}/blob/main/content/occupations/${occ.slug}.json`}
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          Suggest a correction on GitHub →
        </a>
      </Section>
    </main>
  );
}
