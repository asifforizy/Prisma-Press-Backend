# Prisma Press — agent guide

## Project

Blog/CMS backend API — Express 5, TypeScript 6, Prisma 7, PostgreSQL.

## Quick start

```bash
cp .env.example .env        # edit DB credentials
npm install
npx prisma generate         # required after clone (generated/ is gitignored)
npx prisma migrate dev      # apply migrations
npm run dev                 # tsx watch src/server.ts — hot-reload dev server
```

## Scripts

| Command | Notes |
|---------|-------|
| `npm run dev` | Dev server with watch |
| `npm run build` | `tsc` — compile to `dist/` |
| `npm start` | **Broken** (typo: `dist/server/js` → `dist/server.js`) |
| `npx tsc --noEmit` | Typecheck (no other CI/lint/test configured) |

## Key quirks

- **No tests, no linter, no CI, no pre-commit hooks.**
- **Prisma 7** uses `prisma.config.ts` (new config format). Schema is split across `prisma/schema/*.prisma` with `schema.prisma` as the generator/datasource entry.
- **Schema typo:** `prisma/schema/pofile.prisma` (not `profile`).
- **Route typo:** `POST /comments/:commentId/modERATE` (mixed case in route file).
- **`tsconfig.json` `include` is commented out.** `npx tsc --noEmit` may check nothing unless `include` or `files` is restored. Use `npx tsc --noEmit --include "src/**/*.ts"` to force check.
- **Express 5** — error handling and route params differ from Express 4 (e.g., `req.params` returns `ParamsDictionary`, route param types are stricter).
- **`"type": "module"`** — all imports use ESM syntax.
- **Module pattern:** `src/modules/<name>/` — each has `*.route.ts`, `*.controller.ts`, `*.service.ts`, `*.interface.ts`.
- **Entrypoint:** `src/server.ts` → creates `PrismaClient` + starts Express. `src/app.ts` mounts routes + error middleware.
- **No Prisma Studio** in devDependencies; use `npx prisma studio` to browse data.

## After pulling changes

```bash
npx prisma generate        # if schema changed
npx prisma migrate dev     # if new migrations exist
```
