# Contributing

The most useful contribution is a well-sourced occupation file or a correction to an existing one.

## Add or fix an occupation

1. Copy an existing file in `content/occupations/` and name it `<slug>.json`. The slug is lowercase kebab-case and must match the `slug` field.
2. Fill in every field. The schema is `src/lib/schema.ts`.
3. Cite at least one source in `sources`. Prefer primary sources: studies, company filings, official statistics, or the vendor's own documentation.
4. Set `draft` to `false` only when the claims are checked against those sources.
5. Run `npm run validate`, `npm run lint` and `npm run build`.
6. Open a pull request using the template.

## Tool logos

An entry in `aiTools` can have an optional `logo`. Without one, the page shows a letter badge, which is fine.

1. Put the file in `public/tools/` as `<tool-name>.svg`, `.png` or `.webp`, lowercase with hyphens.
2. Set `"logo": "/tools/<tool-name>.svg"` on the tool. `npm run validate` fails if the file is missing.
3. Use the tool's own official icon (usually its favicon or press-kit mark), square or close to it. Don't crop or recolor it.
4. SVGs must not contain `<script>`, `<foreignObject>` or embedded `<image>` elements, and shouldn't change color with `prefers-color-scheme`, since the site is light only.

Logos are trademarks of their owners. They are shown only to identify the tool.

## Status levels

| Status | Meaning |
|---|---|
| `replaced` | AI performs the core work end to end, and employers have stopped hiring humans for it at meaningful scale. |
| `partial` | AI performs a large share of the tasks and demand for human workers has measurably fallen, but humans still do part of the job. |
| `augmented` | AI is in common use but mainly makes workers faster. Headcount has not fallen because of it. |
| `not-yet` | AI does none of the core work in everyday practice, or does it only in small pilots. |

`replaced` needs the strongest evidence. A claim with no source will not be merged.

## Confidence levels

`confidence` says how well your sources support the status. It is separate from the status.

| Confidence | Meaning |
|---|---|
| `low` | Thin or mixed evidence, or mostly from the companies involved. The status could reasonably be argued the other way. |
| `medium` | Several independent sources point the same way, but each covers only a slice, or a gap remains. |
| `high` | Strong, consistent evidence from independent sources that cover the occupation as a whole. |

## Code changes

Open an issue first for anything bigger than a small fix.
