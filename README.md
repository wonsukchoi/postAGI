# postAGI

An open, sourced list of occupations and what AI has already replaced.
Every claim links to a source. The data lives in this repo, so anyone can correct it with a pull request.

Built with Next.js, TypeScript, Tailwind and Zod.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run validate` | Checks every file in `content/occupations/` against the schema |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then runs `tsc` |
| `npm run build` | Validates, then builds the static site |

## How the data works

One JSON file per occupation in `content/occupations/`. The schema is in `src/lib/schema.ts`.
A bad file fails `npm run validate` and `npm run build`, so broken data can't ship.

The three files that ship today are **drafts** with placeholder content and example sources. They are marked `"draft": true` and show a banner on the site.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
