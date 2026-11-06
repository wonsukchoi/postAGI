"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/** Distance from the top of the viewport at which a section counts as "current". */
const OFFSET = 120;

/**
 * Floating "On this page" list. Renders only on wide screens, in the gutter
 * to the right of its positioned parent (the parent must be `relative`).
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(items[items.length - 1].id);
        return;
      }
      let current = items[0].id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= OFFSET) current = item.id;
      }
      setActive(current);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <aside
      aria-label="On this page"
      className="absolute top-0 left-full ml-10 hidden h-full w-44 xl:block"
    >
      <nav className="sticky top-8">
        <div className="mb-3 text-xs font-medium tracking-wide text-neutral-500 uppercase">
          On this page
        </div>
        <ul className="flex flex-col border-l border-neutral-200">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm ${
                    isActive
                      ? "border-neutral-900 font-medium text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
