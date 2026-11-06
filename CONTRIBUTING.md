# Contributing

The most useful contribution is a well-sourced occupation file or a correction to an existing one.

## Add or fix an occupation

1. Copy an existing file in `content/occupations/` and name it `<slug>.json`. The slug is lowercase kebab-case and must match the `slug` field.
2. Fill in every field. The schema is `src/lib/schema.ts`.
3. Cite at least one source in `sources`. Prefer primary sources: studies, company filings, official statistics, or the vendor's own documentation.
4. Set `draft` to `false` only when the claims are checked against those sources.
5. Run `npm run validate`, `npm run lint` and `npm run build`.
6. Open a pull request using the template.

## Status levels

| Status | Meaning |
|---|---|
| `replaced` | AI performs the core work end to end, and employers have stopped hiring humans for it at meaningful scale. |
| `partial` | AI performs a large share of the tasks and demand for human workers has measurably fallen, but humans still do part of the job. |
| `augmented` | AI is in common use but mainly makes workers faster. Headcount has not fallen because of it. |
| `not-yet` | No credible evidence of AI doing the core work today. |

`replaced` needs the strongest evidence. A claim with no source will not be merged.

## Code changes

Open an issue first for anything bigger than a small fix.
