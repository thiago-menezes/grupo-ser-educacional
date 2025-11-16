# Repository Guidelines

## Project Structure & Module Organization
- `apps/next` hosts the React storefront built with Next.js 16; treat `src/` as the entry point for routes, UI, and scripts, while `.next/` remains disposable build output.
- `apps/strapi` contains the CMS; Strapi models live in `src/api`, and all admin customizations belong under `src/admin`.
- Shared libraries live in `packages/` (`frontend`, `utils`, `types`, `bff`, `eslint`), each publishing compiled artifacts to `dist/`; avoid importing from `src/` across package boundaries.
- Long-form references and diagrams belong to `docs/`; keep repo-wide tooling (script snippets, CI specs) at the root beside `turbo.json`.

## Build, Test & Development Commands
- `yarn dev` — builds shared packages once, then runs `turbo run dev` so `next` and `strapi` watch for changes.
- `yarn build` — executes `turbo run build` for every workspace; use `yarn build:packages` or `yarn build:next` for targeted builds.
- `yarn lint`, `yarn typecheck`, `yarn test` — delegate to each workspace via Turbo; combine them locally before opening a PR.
- Package-specific commands (example: `cd apps/next && yarn lint:fix`) are available when tighter loops are needed.

## Coding Style & Naming Conventions
- Follow Prettier defaults (2-space indentation, single quotes off) via `yarn format` or per-package `format` scripts.
- ESLint configs ship in `packages/eslint`; extend `.eslintrc` rather than duplicating rules.
- Prefer PascalCase for React components, camelCase for functions and utilities, and kebab-case for file names except React components (`ComponentName.tsx`).
- Keep shared TypeScript types in `packages/types` and re-export from an index barrel instead of deep imports.

## Testing Guidelines
- Vitest with Testing Library backs UI packages (see `packages/frontend/vitest.setup.ts`); use the `.test.tsx` suffix and colocate with source.
- Strapi integration tests rely on its CLI; add scripted seeds to `apps/strapi/scripts/` when fixtures are required.
- Run `yarn test` before pushing; aim for coverage on core flows and add regression tests for every bug fix.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit pattern (`chore:`, `feat:`, `fix:` etc.) observed in `git log` (e.g., `chore: enhance API response handling`).
- Squash unrelated changes, include issue numbers when applicable (`feat: add enrollment CTA #123`), and keep subject lines under 72 characters.
- Pull requests should describe scope, testing evidence (`yarn test`, screenshots for UI), and any migrations (Strapi schema, database seeds).

## Security & Configuration Notes
- Use Node 22.x and Yarn 4.x as enforced by the root `package.json` engines.
- Secrets for Strapi or Next.js should come from `.env` files ignored by Git; document required keys inside `docs/` rather than committing placeholders.
