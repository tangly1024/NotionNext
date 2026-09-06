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
   - If a separate announcement title is rendered, prefer the Notice page `title` and preserve the theme's existing title as a fallback.
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

### First-Viewport Stability and CLS

Each theme must define the first viewport during design and reserve stable space for it. The goal is not to remove real features for Lighthouse, but to keep the visual structure stable before and after Next.js scripts, dynamic theme chunks, images, fonts, ads, and plugins finish loading.

- Home, list, and landing pages must plan desktop and mobile first-viewport height. The first major visual section (hero, featured post, first post group, etc.) should use `min-h-screen`, `min-h-[calc(100vh-var(--header-height))]`, fixed `aspect-ratio`, or an equivalent theme-specific constraint so the footer or second-screen content does not appear in the first viewport and then get pushed away.
- Dynamic theme loading fallbacks, article `!post` fallbacks, and skeleton screens must stay close to the final layout height. If the final theme layout cannot be mirrored exactly, reserve at least one viewport of shell space.
- Cover images, post thumbnails, sidebar images, avatars, ad slots, analytics cards, comment entry points, and plugin slots must have predefined width/height, `aspect-ratio`, or `min-height`. Content may load lazily, but it must not be inserted into the first viewport without reserved space.
- Unstable-height modules such as dynamic categories, recommendations, tag clouds, ads, AI widgets, and comments should start below the first viewport. If they must appear in the first viewport, give their container a stable height close to the final state.
- Do not remove real features such as AOS, web fonts, analytics, or ads just to improve lab scores. Prefer reserved dimensions, correct first-viewport priority, lazy-loading boundaries, and below-the-fold deferral.
- Before merging, inspect the page under slow network or DevTools throttling from the initial HTML/fallback state through Next.js hydration. The first viewport, footer position, and main card heights should not visibly jump; CLS in Lighthouse / Performance should be near 0.

## 5) Config Design Pattern

Use `siteConfig('<KEY>', <default>, CONFIG)` consistently.

Recommended key groups:

- `THEME_MENU_*`
- `THEME_HERO_*`
- `THEME_POST_LIST_*`
- `THEME_WIDGET_*`
- `THEME_ARTICLE_*`

Do not scatter constants in component bodies.

### 5.1 Theme Color Tokens

Older themes use many Tailwind CSS utility color classes because that made early development fast: layouts and interactions could ship without first designing a full token system. As the theme framework matures, new themes and theme refactors should move color semantics out of fixed Tailwind names. A class named `blue`, `indigo`, or `yellow` should not ambiguously mean primary color, accent color, dark-mode highlight, or status color depending on the component.

Recommended pattern:

- Put color defaults in `themes/<theme>/config.js` with a theme prefix, for example `HEO_COLOR_PRIMARY`, `HEO_COLOR_ACCENT`, `HEO_COLOR_BG`.
- Read them in `themes/<theme>/style.js` and define scoped CSS variables on the current theme root, for example `#theme-heo { --heo-color-primary: ... }`; avoid writing theme tokens to global `:root`.
- Components should use semantic variables such as `bg-[var(--heo-color-primary)]` and `text-[var(--heo-color-text)]` instead of adding more non-semantic fixed color classes.
- Notion Config and environment variables may override these keys; theme `config.js` provides defaults only.
- A simple one-accent theme may expose only a primary color. A visually rich theme can expose background, card, border, text, secondary text, success, warning, and other tokens.

Minimum palette:

| Meaning | Example key | Usage |
| --- | --- | --- |
| Primary | `HEO_COLOR_PRIMARY` | Main buttons, selected states, important links |
| Primary hover | `HEO_COLOR_PRIMARY_HOVER` | Main hover states |
| Accent | `HEO_COLOR_ACCENT` | Secondary highlights, badges, decorative emphasis |
| Page background | `HEO_COLOR_BG` | Body/page background |
| Card background | `HEO_COLOR_CARD` | Cards, panels, floating surfaces |
| Border | `HEO_COLOR_BORDER` | Card borders, dividers |
| Text | `HEO_COLOR_TEXT` | Titles and body copy |
| Secondary text | `HEO_COLOR_TEXT_SECONDARY` | Excerpts, metadata, muted copy |

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

## 7) Contact Email (`CONTACT_EMAIL`) Conventions

The `NEXT_PUBLIC_CONTACT_EMAIL` environment variable is compiled into `conf/contact.config.js` and stored in `siteConfig('CONTACT_EMAIL')` as a Base64-encoded payload (UTF-8), so plain addresses do not appear verbatim in static HTML. When migrating or adding theme UI, pick the right helper or you will see garbled `mailto:` targets or wrong Gravatar hashes.

| Scenario | Do | Don't |
| --- | --- | --- |
| Icon/link opens the system mail client | Use `handleEmailClick` (below) | `href={\`mailto:${siteConfig('CONTACT_EMAIL')}\`}` |
| Footer or copy shows the address | `resolveContactEmail(siteConfig('CONTACT_EMAIL'))` | Render `siteConfig('CONTACT_EMAIL')` directly |
| md5 for Gravatar | Hash **lowercased** plaintext from `resolveContactEmail` | md5 the encrypted string |
| Server-generated text (e.g. `security.txt`) | `resolveContactEmail` before `mailto:` | Write the encrypted blob into the file |

**Click-to-mail pattern (match `themes/next/components/SocialButton.js`):**

```javascript
import { useRef } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { siteConfig } from '@/lib/config'

const emailIcon = useRef(null)
const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')

// ...
{CONTACT_EMAIL && (
  <a
    onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
    title='email'
    className='cursor-pointer'
    ref={emailIcon}>
    {/* icon */}
  </a>
)}
```

Helpers live in `lib/plugins/mailEncrypt.js`: `handleEmailClick`, `decryptEmail`, `resolveContactEmail`.

## 8) Contributing a theme to the main repo: preview images and Theme Switch copy

You can keep a custom theme under **`themes/<theme-id>/`** locally or in your fork without opening a PR.

If you want the theme **merged into the official NotionNext repository**, you must also ship assets and manifest entries used by the **theme switcher** when `THEME_SWITCH` / `NEXT_PUBLIC_THEME_SWITCH` is enabled: cover previews plus human-readable name and summary.

### 8.1 Preview assets directory and naming (fixed location)

Commit static previews under:

**`public/images/themes-preview/`**

| File | Purpose |
| --- | --- |
| `<theme-id>.png` | Baseline image; **must** match the folder name under `themes/` (lowercase), e.g. `endspace.png`. Used as `LazyImage` **`fallbackSrc`**. |
| `<theme-id>.webp` | **Strongly recommended**; convert from PNG (`cwebp`, Squoosh, ImageMagick, etc.). Used as the preferred **`src`** for smaller payloads. |

By default, `getThemeSwitchMeta()` resolves **`/images/themes-preview/<id>.webp`** and **`.png`**. Submit both in PRs when possible.

### 8.2 Title and summary (`conf/themeSwitch.manifest.js`)

Edit **`conf/themeSwitch.manifest.js`** and add an entry under **`THEME_SWITCH_MANIFEST`** keyed by the theme id (**same** as the directory under `themes/`):

- **`name`** (optional): label in the switcher; if omitted, the id is auto-formatted.
- **`summary`** (recommended): one-line blurb under the card title.
- **`cover`** / **`coverWebp`** (optional): custom image URLs. If omitted, the paths in §8.1 apply. If you only ship PNG for now, set **`coverWebp`** to **`''`** for that theme so the UI uses PNG only.
- **`tier`** (optional): **`'free'`** or **`'paid'`**; defaults to **`'free'`**, which shows a Free-style badge in the switcher. For future paid themes, set **`tier`** to **`'paid'`** to show the paid label.

`components/ThemeSwitch.js` reads metadata via **`getThemeSwitchMeta()`**; you do not duplicate this inside the theme folder.

The theme switcher should also become the entry point for color palettes. A theme can declare the color config keys it supports through manifest/theme metadata, and the switcher can show key, current value, swatch, and copy actions. A one-color theme such as Fuwari may show only one primary control; a richer theme such as Heo may show a full palette so site owners can copy the final values back into Notion Config or `themes/<theme>/config.js`.

### 8.3 Docs and review

- Long-form theme notes still belong under **`docs/developer/themes/`** (see the visual fidelity checklist for doc placement).
- In the PR description, list preview files and any new or updated manifest entries.

### 8.4 For developers: open source today and future commercial themes (roadmap)

This subsection is for **theme authors**: how we collaborate in the open repo today, and **possible** future options for paid themes. Final policies and timelines will be announced officially.

- **Acknowledging the work**: shipping and maintaining a theme (layout, UX, breakpoints, and ongoing compatibility) is real effort. Contributing redistributable themes to the **public NotionNext repo** remains highly valued.
- **Current path**: we still encourage **free-to-use** themes via **PRs to the main GitHub repository**, following §8.1–§8.3 for previews and manifest. Local or private-fork use is unrestricted.
- **Future direction (not live yet)**: as the ecosystem matures, we **plan to allow paid theme submissions** so authors can be compensated while users get maintained, high-quality work.
- **Planned shape (illustrative only)**: a **separate private Git repository** may be introduced for authors to **publish and version themes**; themes could be **priced**, and after **purchase**, buyers receive what they need to **privately deploy** the theme on their own sites (exact license, updates, and support will be defined at launch).
- **Relation to code**: the manifest **`tier`** field (`free` / `paid`) is for **UI labeling** in the theme switcher. **Billing, entitlements, delivery, and private deployment will not rely on manifest alone**; dedicated docs and tooling will ship when the program goes live.

## 9) Fuwari Migration Notes

For `themes/fuwari`, these specifics are already applied:

- Upstream style reference source: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Notion cover hero support
- Data-driven menu with `customNav`/`customMenu` compatibility
- Independent TOC, sidebar widgets, and right-float actions
- Flip contact card support via global `FlipCard`

## 10) Common Pitfalls

- Hardcoded menu paths without `customMenu` support.
- Reusing another theme's UI components directly.
- Local-only dark mode toggle that ignores global context.
- Missing `post?.toc` and `notice?.blockMap` guards.
- Forgetting to expose new behaviors in theme config.
- Contact email: raw `mailto:` with encrypted config or missing `handleEmailClick` / `resolveContactEmail` (see section 7).

## 11) Visual Fidelity Checklist (Fuwari-like Themes)

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
  - expose each token's config key, semantic label, and current color value so operators can write it back into Notion Config or `config.js`
  - one-primary-color themes show one control; richer themes show a full palette instead of forcing every theme into the same number of tokens
- **Theme docs placement**:
  - avoid putting markdown docs under `themes/<theme>/` if build pipeline treats theme dirs as runtime modules
  - place theme docs under `docs/developer/themes/` instead
- **Route transition feel**: add lightweight page/card transition to mimic source theme interaction rhythm.

