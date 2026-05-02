# Theme Migration Guide (NotionNext)

[中文](./THEME_MIGRATION_GUIDE.zh-CN.md)

This guide is for migrating an external theme (for example Astro/Vite themes) into NotionNext's Next.js + Notion data architecture.

## 1) Migration Goal

- Keep the original theme's visual language (layout, spacing, cards, motion).
- Follow NotionNext's data flow and feature conventions.
- Expose behavior through `themes/<theme>/config.js` switches instead of hardcoding.

## 2) Required Structure

Create a dedicated theme folder:

- `themes/<theme>/index.js`
- `themes/<theme>/style.js`
- `themes/<theme>/config.js`
- `themes/<theme>/components/*`

Rules:

- Do not import UI components from other theme folders.
- Keep cross-theme shared components only from global `@/components/*` when needed (for example `NotionPage`, `Comment`, `ShareBar`, `FlipCard`, ads widgets).
- Keep theme-specific rendering and style under the theme folder.

## 3) Data Contract in NotionNext

Common props available in theme layouts/components:

- `siteInfo`: site metadata, cover, title, description
- `posts`, `post`, `archivePosts`
- `latestPosts`, `categoryOptions`, `tagOptions`
- `notice`
- `postCount`
- `prev`, `next`
- `customNav`, `customMenu`
- `rightAreaSlot`

Typical post fields used by themes:

- `title`, `slug`, `href`, `summary`
- `publishDay`, `lastEditedDay`
- `pageCover`, `pageCoverThumbnail`
- `category`, `tagItems`
- `toc`

## 4) Must-Have NotionNext Feature Compatibility

When migrating a new theme, verify all of these:

1. **Data-driven menu**
   - Support default menu items.
   - Support `customNav`.
   - Support `CUSTOM_MENU` overriding with `customMenu`.

2. **Notice/announcement block**
   - Render Notion content using `NotionPage`.
   - Switchable in theme config.

3. **Notion cover as Hero**
   - Use `siteInfo.pageCover` as first priority for home hero background.
   - Keep fallback image config.

4. **Dark mode support**
   - Use global context (`useGlobal`) and `toggleDarkMode`.
   - Avoid isolated theme-only dark state.

5. **Article module compatibility**
   - TOC panel switch
   - Share module switch
   - Comment module switch
   - Copyright block switch
   - Adjacent posts switch

6. **Sidebar modularity**
   - Latest posts, categories, tags
   - Contact card (optional flip card)
   - Analytics card
   - Ads card
   - Plugin slot (`rightAreaSlot`)

7. **Float tools**
   - Back to top
   - Jump to comment
   - Dark mode quick switch

## 5) Config Design Pattern

Use `siteConfig('<KEY>', <default>, CONFIG)` consistently.

Recommended key groups:

- `THEME_MENU_*`
- `THEME_HERO_*`
- `THEME_POST_LIST_*`
- `THEME_WIDGET_*`
- `THEME_ARTICLE_*`

Do not scatter constants in component bodies.

## 6) Suggested Migration Workflow

1. Build minimum runnable skeleton (`LayoutBase`, `LayoutIndex`, `LayoutSlug`, etc.).
2. Split large `index.js` into focused components.
3. Port original style details (cards, banner, metadata density, transitions).
4. Integrate NotionNext feature modules and config switches.
5. Add docs for all theme config keys and default values.
6. Run lint and verify:
   - Home/list/search/archive/category/tag/article/404
   - Light/dark mode
   - Menu behaviors (`customNav`, `CUSTOM_MENU`)
   - Notice, ads, plugin slot, contact card

## 7) Fuwari Migration Notes

For `themes/fuwari`, these specifics are already applied:

- Upstream style reference source: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Notion cover hero support
- Data-driven menu with `customNav`/`customMenu` compatibility
- Independent TOC, sidebar widgets, and right-float actions
- Flip contact card support via global `FlipCard`

## 8) Common Pitfalls

- Hardcoded menu paths without `customMenu` support.
- Reusing another theme's UI components directly.
- Local-only dark mode toggle that ignores global context.
- Missing `post?.toc` and `notice?.blockMap` guards.
- Forgetting to expose new behaviors in theme config.

## 9) Visual Fidelity Checklist (Fuwari-like Themes)

- **Layout orientation**: desktop default should be left functional sidebar + right content feed.
- **Hero full width**: avoid `calc(50% - 50vw)` scrollbar offset drift; use stable center transform strategy.
- **Post card variants**:
  - with cover: text left + cover right
  - without cover: keep a right-side action rail to maintain visual rhythm
- **Readmore affordance**: right action rail and icon should keep consistent card height alignment.
- **Profile card actions**: include social icon row under avatar/bio if source theme has it.
- **Theme color picker UX**:
  - trigger from top-right palette button
  - use floating panel, not sidebar block
  - real-time preview + persisted local setting
  - expose copied hue/hex for operators to write back into `config.js`
- **Theme docs placement**:
  - avoid putting markdown docs under `themes/<theme>/` if build pipeline treats theme dirs as runtime modules
  - place theme docs under `docs/themes/` instead
- **Route transition feel**: add lightweight page/card transition to mimic source theme interaction rhythm.

