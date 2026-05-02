# Architecture Overview

[中文](./ARCHITECTURE.md)

## Core flow

NotionNext main flow can be simplified as:

1. **Data access layer** (`lib/db/`)  
   Fetches Notion data, normalizes structure, maps fields, handles cache and dedup.
2. **Server data assembly** (`lib/db/SiteDataApi.js`)  
   Produces `allPages`, `tagOptions`, `categoryOptions`, `siteInfo`, etc.
3. **Routing layer** (`pages/`)  
   Handles route-level filtering, pagination, and render preparation.
4. **Theme layer** (`themes/`)  
   Themes consume the same props contract and render different UI.

## Config priority

Priority (high -> low):

1. Notion Config page key
2. Environment variable
3. Local config (`blog.config.js` + `conf/*.config.js`)

## Why “move rules to data layer”

If a sorting/filtering rule is global business logic, place it in data layer instead of duplicating it in route files.

Benefits:

- Smaller change surface
- Lower risk of missing routes
- Consistent behavior across themes

## Cache & build

- Cache modules: `lib/cache/`
- Build prefetch/concurrency: `lib/build/`
- Changes here can impact CI speed and deployment stability; include validation notes.

