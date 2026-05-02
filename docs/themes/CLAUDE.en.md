# Claude 3.5 Theme

> Applies to: `themes/claude` (with some global changes in `pages/_app.js`, `pages/index.js`, and `components/SEO.js`)

This theme combines the clean reading experience of **Claude Docs** with the rich personal profile structure of **GitHub**, creating a professional yet personal blog for developers.

### Core Philosophy

1.  **Reading Experience**: Minimal distractions, clear typography (Anthropic Sans/Serif), and excellent code block readability.
2.  **Personal Branding**: A homepage that mirrors your GitHub profile (Bio, Activity, Heatmap).
3.  **Data Persistence**: Activity and contributions are tracked via Supabase for historical accuracy.
4.  **Performance**: Multi-layer caching ensures fast loads and stable rendering.

---

## Quick Start

1.  **Configure Environment**:
    Add to your `.env` or `.env.local` (see below for details):
    ```bash
    # Activate Theme
    NEXT_PUBLIC_THEME=claude  # or configure in notion configuration page
    NOTION_PAGE_ID=<your-notion-page-id>

    # [Optional] Enable Contribution Persistence (Recommended)
    SUPABASE_URL=<your-supabase-url>
    SUPABASE_SECRET_KEY=<your-supabase-key>
    CLAUDE_CONTRIBUTION_TRIGGER_TOKEN=<secure-token-for-api>
    ```

2.  **Create Profile README**:
    Create a Notion page with the slug `readme.md`. This page will be automatically rendered on your blog homepage.

3.  **Launch**:
    ```bash
    yarn dev
    ```
    Your blog is now running with the Claude theme.

---

## 1. Design Strategy

### Desktop View
The layout uses a 3-column structure inspired by technical documentation sites:
-   **Left Sidebar**: Persistent navigation, profile card, contact info, and a simulated terminal prompt.
-   **Center Content**: The main reading area, optimized for long-form content.
-   **Right Sidebar**: Table of Contents (TOC) that tracks scrolling position (Article pages only).

### Mobile Adaptation
Mobile design is a first-class citizen, not an afterthought:
-   **Navigation**: Collapses into a clean top bar.
-   **Heatmap**: Preserves the square aspect ratio of contribution cells; allows horizontal scrolling instead of shrinking cells.
-   **Typography**: Maintains readability with appropriate font scaling.
-   **Interactions**: Touch-friendly targets for all clickable elements.

---

## 2. Features Details

### Contribution Heatmap & Activity
The homepage features a GitHub-style contribution graph and activity feed.

-   **Heatmap**: Displays daily contribution levels (0-4) based on article creation and updates.
-   **Activity Feed**: A chronological stream of your "commits" (article updates) and "created repositories" (new articles).
-   **Yearly View**: Switch between a rolling 1-year window or specific calendar years.

### README Rendering
Your `readme.md` Notion page is rendered directly on the homepage, serving as your "Profile README".
-   **Rendering Pipeline**: Notion Blocks -> Markdown -> HTML.
-   **Engine**: Prioritizes GitHub's `/markdown` API for perfect GFM (GitHub Flavored Markdown) fidelity, falling back to a local parser if the API limit is reached.
-   **Caching**: Rendered HTML is cached to prevent redundant API calls and speed up page loads.

### Terminal Widget
A dynamic element in the sidebar that shows:
-   Last login time (simulated).
-   Current "user" and "machine" (e.g., `user@Macintosh ~ %`).
-   Typing effect for the blog title.

---

## 3. Configuration

Config file: `themes/claude/config.js`

| Config Key | Description | Default |
| :--- | :--- | :--- |
| `CLAUDE_BLOG_NAME` | Main blog title | '活字印刷' |
| `CLAUDE_BLOG_NAME_EN` | Subtitle / English title | 'Typography' |
| `CLAUDE_MENU_CATEGORY` | Show sidebar categories | `true` |
| `CLAUDE_MENU_TAG` | Show sidebar tags | `true` |
| `CLAUDE_MENU_ARCHIVE` | Show sidebar archives | `true` |
| `CLAUDE_TOC_ENABLE` | Enable Table of Contents | `true` |
| `CLAUDE_TOC_SHOW_LEVEL3` | Show H3 in TOC | `true` |
| `CLAUDE_TOC_SCROLL_BEHAVIOR` | TOC scroll animation | 'instant' (or 'smooth') |
| `CLAUDE_PROFILE_AVATAR` | Custom avatar URL | `''` (Use global avatar) |
| `CLAUDE_README_CACHE_ENABLED` | Cache README HTML | `true` |
| `CLAUDE_CONTRIBUTION_PERSIST_ENABLED` | Enable Supabase persistence | `true` |
| `CLAUDE_CONTRIBUTION_EVENT_LIMIT` | Max events to fetch | `50000` |

> Most options can be overridden via `NEXT_PUBLIC_` env vars.

---

## 4. Environment Variables

To fully enable all features, especially contribution persistence, configure the following in `.env.local` or your deployment platform.

### Basic Setup
```bash
NEXT_PUBLIC_THEME=claude
NOTION_PAGE_ID=<your-page-id>
```

### Supabase (Required for Persistent Contributions)
Without this, the heatmap is generated on-the-fly from the current post list, which loses historical accuracy (e.g., deleted posts, precise update times).

```bash
NEXT_PUBLIC_CLAUDE_CONTRIBUTION_PERSIST_ENABLED=true

# Supabase Connection
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key-or-secret
```

### Advanced Cache Control
```bash
# Enable internal caching (recommended)
ENABLE_CACHE=true

# Optional: Use Redis for distributed caching
REDIS_URL=redis://user:pass@host:port
```

---

## 5. Database Schema (Supabase)

If using Supabase, create these two tables to store contribution data.

### 1. Events Table (`claude_contribution_events_v1`)
Stores individual contribution events (create/update).

```sql
create table if not exists public.claude_contribution_events_v1 (
  event_id text primary key, -- e_md5(type|repoId|ts)
  event_type text not null check (event_type in ('create', 'update')),
  repository_id text not null, -- Normalized Post ID
  timestamp_ms bigint not null,
  title text default '',
  slug text default ''
);

-- Indices for performance
create index if not exists idx_claude_contrib_events_ts
  on public.claude_contribution_events_v1 (timestamp_ms desc);
create index if not exists idx_claude_contrib_events_repo
  on public.claude_contribution_events_v1 (repository_id);
```

### 2. Snapshots Table (`claude_contribution_snapshots_v1`)
Tracks the state of posts to detect changes during builds.

```sql
create table if not exists public.claude_contribution_snapshots_v1 (
  repository_id text primary key,
  title text default '',
  slug text default '',
  created_at_ms bigint not null default 0,
  updated_at_ms bigint not null default 0,
  synced_at_ms bigint not null default 0
);

create index if not exists idx_claude_contrib_snapshots_updated
  on public.claude_contribution_snapshots_v1 (updated_at_ms desc);
```

### Update Logic
1.  **Sync**: On build (`getStaticProps` of index), the system compares current Notion posts against `snapshots`.
2.  **Detect**:
    *   New post? -> Insert `create` event.
    *   Updated post (`updatedAt > lastSnapshot.updatedAt`)? -> Insert `update` event.
3.  **Persist**: Updates are upserted to Supabase.
4.  **Display**: The heatmap reads from the `events` table (filtered to exclude today to prevent jitter).

---

## 6. Caching Strategy

The theme employs a multi-level caching strategy for stability.

1.  **Contribution Daily Cache** (Local Memory):
    *   Aggregates events for the day.
    *   Reduces database reads.
    *   Refreshes on new builds or via API.

2.  **README HTML Cache**:
    *   Caches the expensive GitHub API markdown rendering.
    *   Key: `readme_render_snapshot_v2_${pageId}`.

3.  **GitHub Markdown API Cache**:
    *   Caches the raw response from GitHub to avoid rate limits (60 requests/hr for unauthenticated IPs).
    *   Fallback: If the API fails or limits, falls back to a local `marked` + `highlight.js` renderer.

---

## 7. Troubleshooting

**Q: My heatmap is empty.**
*   Ensure `NEXT_PUBLIC_CLAUDE_CONTRIBUTION_PERSIST_ENABLED=true`.
*   Check if Supabase tables exist and keys are correct.
*   Verify `NOTION_PAGE_ID` allows access to the posts.

**Q: Changes made today are not showing.**
*   By design, the heatmap shows data *up to yesterday* to ensure the grid is stable and complete. Today's dots appear tomorrow.
*   You can force a refresh manually if needed via the refresh API.

**Q: The README styling looks different.**
*   This usually means the GitHub API rate limit was hit, and the theme fell back to the local renderer. It will recover automatically when the cache expires or the limit resets.

---

## 8. Sidebar Persistence Architecture

### Problem

In Next.js Pages Router, every client-side navigation can re-render or even remount `LayoutBase`. This causes the left sidebar (avatar, terminal widget, navigation) to reload on every page transition.

### Three-Layer Solution

The theme uses three layers so the sidebar only refreshes on browser refresh:

#### Layer 1: `pages/_app.js` — Stabilize the Layout Component Reference

> **Merge warning:** this modification is in global `pages/_app.js`, not inside the claude theme directory.

The original code had two problems:
1.  `theme` memo depended on the entire `route` object (`[route]`), which changes reference every route change.
2.  `GLayout` wrapper inside `MyApp` called `getBaseLayoutByTheme(theme)` on each render.

The fix:

```javascript
const theme = useMemo(() => {
  return (
    getQueryParam(route.asPath, 'theme') ||
    pageProps?.NOTION_CONFIG?.THEME ||
    BLOG.THEME
  )
}, [route.asPath, pageProps?.NOTION_CONFIG?.THEME])

const Layout = useMemo(() => getBaseLayoutByTheme(theme), [theme])

<Layout {...pageProps}>
  <SEO {...pageProps} />
  <Component {...pageProps} />
</Layout>
```

#### Layer 2: `themes/claude/index.js` — Memoized SidebarContent

Desktop sidebar is wrapped with `React.memo(() => true)` to block parent-prop-driven rerenders.

#### Layer 3: `themes/claude/components/NavBar.js` — Module-Level Terminal Session Cache

Terminal login time and tty are stored in module-level variables outside React lifecycle, so they survive remounts and reset only on full refresh.

### Files Affected

| File | Scope | Change |
|---|---|---|
| `pages/_app.js` | Global | Removed `GLayout`; memoized `Layout` reference |
| `themes/claude/index.js` | Theme | Added `SidebarContent` memo wrapper |
| `themes/claude/components/NavBar.js` | Theme | Terminal session moved to module cache |

---

## 9. Development

### Project Structure
*   `themes/claude/components/`: UI components (NavBar, Catalog, etc.)
*   `themes/claude/style.js`: CSS variables and global styles
*   `lib/server/claude/contributionStore.js`: Supabase logic
*   `pages/api/claude/`: API endpoints for cache revalidation

### Commands
*   `yarn dev`: Run locally
*   `yarn build`: Production build (triggers contribution sync)

---

## 10. Additional Global Changes (RSS + Homepage Title)

These changes are outside `themes/claude` but affect runtime behavior.

### 10.1 Stop RSS content fetching when RSS is disabled

*   File: `pages/index.js`
*   Change: `generateRss(props)` now runs only when `ENABLE_RSS=true`.

### 10.2 Remove subtitle from homepage `<title>`

*   File: `components/SEO.js`
*   Route: `/`
*   Change: homepage title changed from `site title | site description` to `site title` only.

### 10.3 Merge / Upgrade Notes

When pulling upstream updates, verify:
1.  `pages/_app.js` still memoizes `Layout` with `useMemo(() => getBaseLayoutByTheme(theme), [theme])`.
2.  `theme` memo deps stay as `[route.asPath, pageProps?.NOTION_CONFIG?.THEME]`, not `[route]`.
3.  No wrapper component reintroduces indirect `getBaseLayoutByTheme` calls.
4.  `pages/index.js` keeps RSS generation gated by `ENABLE_RSS`.
5.  `components/SEO.js` keeps homepage title as site title only.
