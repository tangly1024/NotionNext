# 茉灵智库 SEO 审计报告

> 审计时间：2026-04-05
> 站点：https://blog.88lin.eu.org

---

## 一、已修复的问题

### 🔴 P0 — Sitemap 外链污染

**问题**：`lib/utils/sitemap.xml.js` 没有过滤外链 slug，导致 sitemap 中出现大量无效 URL（如 `blog.88lin.eu.org/https://lofi.88lin.eu.org`）。

**修复**：
- 提取了共享过滤函数 `lib/utils/sitemapHelper.js:isValidSitemapSlug()`
- `lib/utils/sitemap.xml.js` 和 `pages/sitemap.xml.js` 统一使用该函数
- 过滤规则：空slug、`http` 外链、`#` 锚点、`search`、`rss/feed.xml` 等

**文件**：`lib/utils/sitemap.xml.js`、`pages/sitemap.xml.js`、`lib/utils/sitemapHelper.js`（新建）

---

### 🔴 P0 — next-sitemap postbuild 与自定义 sitemap 冲突

**问题**：`package.json` 的 `post-build` 和 `export` 脚本运行 `next-sitemap`，会生成独立的 `sitemap.xml` 和 `robots.txt`，覆盖自定义生成的版本。`next-sitemap.config.js` 还开启了 `generateRobotsTxt: true`。

**修复**：
- 移除 `package.json` 中的 `post-build` 脚本（避免 `npm run build` 后自动运行 next-sitemap）
- 移除 `export` 脚本中的 `&& next-sitemap` 调用（export 场景由 `lib/utils/sitemap.xml.js` 的 `generateSitemapXml()` 在 `getStaticProps` 中生成 sitemap，next-sitemap 会覆盖它）
- `next-sitemap.config.js` 设置 `generateRobotsTxt: false`，添加 `exclude` 规则
- next-sitemap 现在不被任何 npm script 调用，配置文件保留供手动使用

**文件**：`package.json`、`next-sitemap.config.js`

---

### 🔴 P0 — 分类字段被截断为单字符

**问题**：`SEO.js` 使用 `post?.category?.[0]`，但 `post.category` 已是字符串，`[0]` 取第一个字符。

**修复**：改为 `post?.category || ''`。

**文件**：`components/SEO.js`

---

### 🟡 P1 — 分页页 canonical 指向第一页

**问题**：`/category/[category]/page/[page]` 和 `/tag/[tag]/page/[page]` 的 slug 都不含页码，canonical 全部指向第一页。

**修复**：
- 分类分页：`slug: 'category/' + category` → `slug: 'category/${category}/page/${page}'`
- 标签分页：`slug: 'tag/' + tag` → `slug: 'tag/${tag}/page/${page}'`
- 同时拆分 `/tag/[tag]` 和 `/tag/[tag]/page/[page]` 为独立 case（不再合并）

**文件**：`components/SEO.js`

---

### 🟡 P1 — Canonical 中文未编码，且结构化数据 URL 不一致

**问题**：
1. 分类/标签页 canonical 输出中文路径（如 `/category/技术教程`）
2. `<link rel="canonical">` 和 `og:url` 使用编码后 URL，但 JSON-LD 里的 URL 未编码

**修复**：
- 提取 `toAbsolute()`、`encodeCanonical()`、`absEncoded()` 为模块级函数
- `canonical`、`og:url`、JSON-LD 的 `CollectionPage.url`、`BreadcrumbList.item`、`BlogPosting.url` 统一使用 `absEncoded()` 编码

**文件**：`components/SEO.js`

---

### 🟡 P1 — 分类/标签/归档页 description 全部复用站点描述

**问题**：所有栏目页都使用 `siteInfo?.description`。

**修复**：每类页面生成独立 description：
- 分类页：`「技术教程」分类下的所有文章 - 茉灵智库`
- 分类分页：`「技术教程」分类第2页 - 茉灵智库`
- 标签页：`标签「Windows」下的相关文章 - 茉灵智库`
- 归档页：`茉灵智库的文章归档，按时间浏览所有已发布文章`

**文件**：`components/SEO.js`

---

### 🟡 P1 — 搜索页 category.join() 崩溃

**问题**：
- `pages/search/index.js:23` 使用 `post.category.join(' ')`，但 `post.category` 是字符串
- `pages/search/[keyword]/index.js:78-81` 使用 `Array.isArray(post.category)` 检测，永远为 false

**修复**：两处都改为兼容字符串和数组：
```js
const categoryContent = post.category
  ? (Array.isArray(post.category) ? post.category.join(' ') : post.category)
  : ''
```

**文件**：`pages/search/index.js`、`pages/search/[keyword]/index.js`

---

### 🟡 P1 — 分类页缺少 H1

**问题**：分类详情页（LayoutPostList）没有 `<h1>` 标签，页面主题信号偏弱。

**修复**：在 `LayoutPostList` 组件中，当 `category` 或 `tag` 存在时渲染 H1：
```jsx
{pageHeading && (
  <h1 className='text-2xl font-bold dark:text-gray-100 mb-4 mt-8'>{pageHeading}</h1>
)}
```

**文件**：`themes/heo/index.js`

---

### 🟡 P2 — BlogPosting.headline 含站点后缀

**修复**：使用 `meta.postTitle`（纯文章标题）代替 `meta.title`（含品牌后缀），截断 110 字符。

---

### 🟡 P2 — 分类/标签页输出 WebSite schema

**修复**：改为 `CollectionPage` + `BreadcrumbList`。

---

### 🟡 P2 — robots.txt 规则精简

**修复**：
- 移除 `Disallow: /_next/`（不必要，可能干扰资源加载）
- 移除 `Crawl-delay: 1`（Google 不支持，其他爬虫收益也不大）
- 移除冗余的 per-bot `Allow: /` 块
- 保留 `Disallow: /api/` 和 `Disallow: /search`

**文件**：`lib/utils/robots.txt.js`

---

### 🟢 P3 — 清理残留变量

**修复**：移除 `generateStructuredData()` 中未使用的 `SITE_NAME` 变量，合并 `getSEOMeta()` 中的 `TITLE` 和 `SITE_NAME` 为单一变量。

**文件**：`components/SEO.js`

---

## 二、已确认的正确做法

| 项目 | 状态 |
|------|------|
| 文章页基础 meta（title/desc/canonical/og/twitter） | ✅ |
| 文章页 JSON-LD（BreadcrumbList + BlogPosting） | ✅ |
| 搜索页 noindex | ✅ |
| 404 页 noindex | ✅ |
| 文章页有明确 H1（PostHeader.js） | ✅ |
| 图片 alt 使用文章标题（BlogPostCard.js） | ✅ |
| article:published_time / article:modified_time | ✅ |
| og:image 尺寸声明 1200x630 | ✅ |
| 百度/Google 站点验证 | ✅ |

---

## 三、仍需注意的问题

### 1. RSS Feed 内容为空（P2）

`/rss/feed.xml` 的 `<channel>` 内没有 `<item>`。代码逻辑正确（`lib/utils/rss.js`），但 Vercel 运行时文件系统只读，`fs.writeFileSync` 会静默失败。需确认构建时数据正确，或考虑改为 API Route 动态生成。

### 2. 死代码 `lib/utils/sitemap.js`（P3）

整个文件从未被 import，包含 `generateSitemap()`、`generateRSS()`、`generateRobotsTxt()` 等函数。建议删除以避免混淆。

### 3. Title 品牌后缀取决于 Notion TITLE 配置（P2）

代码中 `SITE_NAME = siteConfig('TITLE')`，如果 Notion 配置的 TITLE 仍是长标题（如"茉灵智库-提供优质资源与技术教程"），线上输出仍会过长。需在 Notion 配置中将 TITLE 改短为"茉灵智库"。

### 4. 内链体系和栏目页"专题化"（SEO 策略，P2）

分类/标签页目前是归档容器，后续增长点：
- 为重点分类添加顶部介绍段落
- 完善文章间内链关联
- 考虑创建专题/合集页面
- 分类页首屏补专题说明和精选链接

---

## 四、修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `components/SEO.js` | 修复分类截断、分页canonical、URL编码统一、独立description、CollectionPage schema、BlogPosting headline、清理残留变量 |
| `lib/utils/sitemapHelper.js` | **新建** — 共享slug验证函数 |
| `lib/utils/sitemap.xml.js` | 使用共享过滤函数 |
| `pages/sitemap.xml.js` | 使用共享过滤函数，移除/search和/rss |
| `lib/utils/robots.txt.js` | 精简规则，保留核心Disallow |
| `package.json` | 移除post-build脚本，避免next-sitemap覆盖SSR sitemap |
| `next-sitemap.config.js` | 禁用robots生成，添加exclude规则，更新注释 |
| `pages/search/index.js` | 修复category.join()崩溃 |
| `pages/search/[keyword]/index.js` | 修复category类型兼容 |
| `themes/heo/index.js` | 分类/标签页添加H1 |
