# Repository Guidelines

## Project Structure & Module Organization
pages/ hosts Next.js route entrypoints; keep them thin and move data fetching or transforms into lib/.
components/ stores reusable view modules (PascalCase) and shared atoms in components/ui; co-locate CSS modules.
themes/ packages page layouts for DynamicLayout; reuse folder names when adding variations so imports stay stable.
lib/ contains Notion client adapters, SEO utilities, and service wrappers.
hooks/ keeps reusable React hooks; prefer colocating supportive types.
conf/ and blog.config.js hold deployment defaults; public/ carries static assets, icons, and fonts; docs/ tracks longer-form references.

## Build, Test, and Development Commands
npm install installs dependencies (Node 20+).
npm run dev launches the hot-reload server for manual QA.
npm run build compiles the production bundle; follow with npm run post-build to refresh sitemap and RSS artifacts.
npm run export emits a static bundle when EXPORT=true for GitBook-style deployments.
npm run bundle-report opens the Webpack analyzer to flag oversized themes or vendors.
npm run build-all-in-dev simulates a production deploy without leaving local dev.

## Coding Style & Naming Conventions
Run npx eslint . --ext .js,.jsx,.ts,.tsx before opening a PR; rules inherit Next, React, and TypeScript presets.
Format with npx prettier --write . (2-space indent, single quotes, no semicolons, JSX brackets inline).
Name components and hooks with descriptive PascalCase or camelCase (e.g., components/AlgoliaSearchModal.tsx, hooks/useAdjustStyle.ts); group theme-specific pieces under their theme folder.
Favor TypeScript for new utilities, keep types near usage, and import via the @/ alias rather than deep relative paths.

## Testing Guidelines
There is no baseline automated coverage; manually smoke-test Notion sync, theme switching, and SEO tags in npm run dev before sign-off.
Add Jest or Playwright specs alongside critical logic (e.g., lib/notion.spec.ts) and capture follow-up debt in the PR if coverage is deferred.
Attach brief manual QA notes in pull requests, especially for analytics, auth, or deployment-sensitive changes.

## Commit & Pull Request Guidelines
Follow the existing history: scope-prefixed, imperative subjects such as SEO: refresh og tags or fix: prevent undefined themeId.
Keep commits focused and include any paired configuration or translation updates.
Pull requests must include a concise summary, linked issues, test/QA results, and screenshots or GIFs whenever UI behavior shifts.
Coordinate reviews with owners of affected themes or integrations and wait for a clean CI build before merging.

## Security & Configuration Tips
Store secrets only in .env.local or the hosting dashboard; never commit them.
Mirror .env.example when provisioning environments and ensure VERCEL_ENV is set correctly for preview versus production releases.
