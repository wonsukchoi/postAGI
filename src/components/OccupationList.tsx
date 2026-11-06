"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STATUSES, STATUS_LABEL, type Occupation, type Status } from "@/lib/schema";
import { StatusBadge } from "./StatusBadge";

type Sort = "replaced" | "updated" | "name";

const STATUS_RANK: Record<Status, number> = {
  replaced: 0,
  partial: 1,
  augmented: 2,
  "not-yet": 3,
};

const SORT_LABEL: Record<Sort, string> = {
  replaced: "Most replaced",
  updated: "Recently updated",
  name: "Name",
};

export function OccupationList({ occupations }: { occupations: Occupation[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "any">("any");
  const [sector, setSector] = useState("any");
  const [sort, setSort] = useState<Sort>("replaced");

  const sectors = useMemo(
    () => [...new Set(occupations.map((o) => o.sector))].sort(),
    [occupations],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return occupations
      .filter((o) => status === "any" || o.status === status)
      .filter((o) => sector === "any" || o.sector === sector)
      .filter(
        (o) =>
          !q ||
          o.title.toLowerCase().includes(q) ||
          o.summary.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        if (sort === "name") return a.title.localeCompare(b.title);
        if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
        return (
          STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
          a.title.localeCompare(b.title)
        );
      });
  }, [occupations, query, status, sector, sort]);

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm ${
      active
        ? "border border-neutral-300 bg-neutral-100 font-semibold"
        : "border border-transparent text-neutral-600 hover:text-neutral-900"
    }`;

  return (
    <div className="flex flex-wrap items-start gap-10">
      <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
        <div className="flex h-[52px] items-center gap-3 rounded-xl bg-neutral-100 px-4">
          <label htmlFor="q" className="sr-only">
            Search occupations
          </label>
          <input
            id="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search occupations"
            className="min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-transparent text-sm text-neutral-700"
          >
            {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {SORT_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {rows.length === 0 ? (
          <p className="py-10 text-center text-neutral-600">
            No occupations match.
          </p>
        ) : (
          <ul className="flex flex-col rounded-xl border border-neutral-200">
            {rows.map((o) => (
              <li key={o.slug} className="border-b border-neutral-100 last:border-b-0">
                <Link
                  href={`/occupations/${o.slug}`}
                  className="flex flex-col gap-2 px-6 py-5 hover:bg-neutral-50"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-xl font-medium">{o.title}</span>
                      <span className="text-[13px] text-neutral-600">
                        updated {o.updatedAt}
                      </span>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-[15px] leading-normal text-neutral-800">
                    {o.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-600">
                    <span>
                      {o.tasksAutomatedPct === null
                        ? "tasks automated: unknown"
                        : `${o.tasksAutomatedPct}% of tasks`}
                    </span>
                    <span>{o.aiTools.length} AI tools</span>
                    <span>{o.sources.length} sources</span>
                    <span className="rounded bg-neutral-100 px-2 py-0.5">
                      {o.sector}
                    </span>
                    {o.draft && (
                      <span className="rounded border border-neutral-400 px-2 py-0.5">
                        Draft
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="flex min-w-[200px] flex-[1_1_220px] flex-col gap-7">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Status filter">
          <button type="button" onClick={() => setStatus("any")} className={chip(status === "any")}>
            Any
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={chip(status === s)}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="sector" className="text-sm text-neutral-600">
            Sector
          </label>
          <select
            id="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="h-11 rounded-lg border border-neutral-200 bg-white px-3 text-[15px]"
          >
            <option value="any">Any sector</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </aside>
    </div>
  );
}
