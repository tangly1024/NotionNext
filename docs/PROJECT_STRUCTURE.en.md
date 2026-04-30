# Project Structure

[中文](./PROJECT_STRUCTURE.md)

## Top-level directories (common)

- `pages/`: Next.js route entry (`getStaticProps/getStaticPaths`)
- `themes/`: Theme implementations (UI + theme config)
- `components/`: Cross-theme reusable components
- `lib/`: Core logic (data, cache, utilities, config read)
- `conf/`: Split config files aggregated by `blog.config.js`
- `__tests__/`: Unit tests
- `scripts/`: Engineering scripts
- `.github/`: Issue/PR templates and collaboration metadata

## Key files

- `blog.config.js`: aggregated config entry
- `lib/config.js`: `siteConfig()` read logic (with priority)
- `lib/db/SiteDataApi.js`: core site-data assembly
- `CONTRIBUTING.md`: external contribution entry
- `docs/README.md`: docs navigation (zh)
- `docs/README.en.md`: docs navigation (en)

## Change suggestions

- **Global rules**: prefer `lib/db/` or `lib/utils/`
- **Theme visuals**: prefer `themes/<theme>/`
- **New config keys**: add in `conf/*.config.js`, aggregate from `blog.config.js`
- **Avoid copying same business logic across many `pages/*`**

