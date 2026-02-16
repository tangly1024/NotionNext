# Claude Theme README

> 适用目录：`themes/claude`
>
> 本文档描述当前 `claude` 主题的实际实现，重点覆盖：
> 1. 主题特性与视觉设计目标
> 2. 文章页（Claude Code Docs 风格）与首页（GitHub Profile 风格）
> 3. 移动端复刻与优化策略
> 4. Contribution 热力图生成逻辑
> 5. 数据库设计与更新逻辑
> 6. 缓存设计
> 7. 配置项与环境变量说明
> 8. 如何启用并使用该主题

---

## 1. 主题定位与核心特性

`claude` 主题是一个“混合型”主题：

- 文章阅读体验：参考 Claude Code Docs 的排版与色彩体系。
- 首页信息架构：1:1 借鉴 GitHub 个人主页（头像、资料、联系方式、贡献热力图、活动流）。
- 交互策略：内容优先、低干扰、轻动效。
- 数据策略：首页活动数据支持持久化到 Supabase，避免每次都从前端即时推导。

主要能力：

- 三栏布局（左侧资料栏 / 中间正文 / 右侧 TOC）。
- 文章页 Notion 原生渲染（`NotionPage`）+ 主题化样式。
- 首页 README 卡片：Notion blockMap 转 Markdown，再转 HTML 渲染。
- GitHub 风格 Contribution 热力图 + 活动摘要流。
- Contribution 事件持久化（`create` / `update`）与去重。
- 多层缓存（页面缓存、README 缓存、Contrib 日缓存）与失败回退。

---

## 快速开始 (Quick Start)

只需要简单三步即可体验：

1.  **配置环境变量**：
    在 `.env` 或 `.env.local` 中添加（完整配置见下文）：
    ```bash
    # 启用主题
    NEXT_PUBLIC_THEME=claude  # 或者在notion配置页面中配置
    NOTION_PAGE_ID=<your-notion-page-id>

    # [可选] 启用贡献热力图持久化 (推荐)
    SUPABASE_URL=<your-supabase-url>
    SUPABASE_SECRET_KEY=<your-supabase-key>
    CLAUDE_CONTRIBUTION_TRIGGER_TOKEN=<secure-token-for-api>
    ```

2.  **创建个人资料页**：
    在 Notion 中新建一个页面，并将其 **slug** 设置为 `readme.md`。该内容将显示在首页。

3.  **启动**：
    ```bash
    yarn dev
    ```

---

## 2. 目录结构与关键文件

主题核心文件：

- `themes/claude/index.js`
  - 主题布局入口（`LayoutBase` / `LayoutIndex` / `LayoutSlug` 等）。
- `themes/claude/style.js`
  - 主题变量与全量样式（含桌面/移动端规则）。
- `themes/claude/config.js`
  - 主题配置项与默认值。
- `themes/claude/components/ProfileHome.js`
  - 首页 README、热力图、Contribution activity 逻辑。
- `themes/claude/components/NavBar.js`
  - 左侧资料栏（头像、联系方式、导航、终端模拟块）。
- `themes/claude/components/MenuList.js`
  - 菜单渲染与 icon 规则（支持 Notion icon 字段写 Font Awesome）。
- `themes/claude/components/Catalog.js`
  - 右侧目录（TOC）与滚动联动。

服务端数据链路相关：

- `pages/index.js`
  - 首页 `getStaticProps`：README 渲染、Contrib 同步、缓存回退。
- `lib/server/claude/contributionStore.js`
  - Supabase 读写、事件生成、去重、日缓存。
- `lib/db/notion/notionBlocksToHtml.js`
  - Notion blockMap -> Markdown -> HTML（GitHub API 优先，本地回退）。
- `pages/api/claude/contribution-refresh.js`
  - 手动刷新 Contribution 缓存与 ISR 触发。

---

## 3. 文章样式（仿 Claude Code Docs）

### 3.1 布局风格

文章页采用 `LayoutSlug` + `NotionPage` 渲染正文，外层由 `LayoutBase` 提供：

- 左侧固定宽资料/导航区域。
- 中间内容区（多档 `max-w-*` 宽度控制）。
- 右侧目录区（文章页 + 桌面端 + TOC 开启时显示）。

### 3.2 样式体系

`themes/claude/style.js` 中定义了大量 CSS 变量：

- 配色变量：正文、边框、强调色、暗色模式等。
- 字体变量：
  - 标题：`Anthropic Serif Display`
  - 正文：`Anthropic Sans Text`
  - 等宽：`JetBrains Mono` fallback 链
- Notion 内容区域样式覆写：链接、引用、代码、表格、callout、目录高亮等。

### 3.3 目录（TOC）行为

目录组件：`themes/claude/components/Catalog.js`

- 支持 L1/L2 必显。
- L3 由 `CLAUDE_TOC_SHOW_LEVEL3` 控制。
- 滚动监听并高亮当前 section，同时联动父级。
- `On this page` 标题可回到顶部。
- 滚动行为支持 `smooth` 或 `instant`（`CLAUDE_TOC_SCROLL_BEHAVIOR`）。

---

## 4. 首页（1:1 GitHub Profile 复刻）

首页组件：`themes/claude/components/ProfileHome.js`

从上到下主要区块：

1. README 卡片（`README.md` 标签头 + 内容区）
2. Contribution 热力图区块
3. Contribution activity 时间流

左侧资料栏组件：`themes/claude/components/NavBar.js`

- 圆形头像（GitHub 风格）。
- 昵称 + Bio。
- 联系方式（GitHub / Email）。
- 导航菜单（支持图标）。
- 终端模拟区：
  - 第一行：`Last login: ... on ttys00x`
  - 第二行：`{author}@Macintosh ~ % {blogName}` + 光标
  - 通过 `ResizeObserver` 自动缩放字体，尽量保证同一行展示。

---

## 5. 移动端复刻与优化

移动端保留“与桌面一致的字体风格和信息层级”，但对结构做适配：

- 左侧栏折叠为顶部简化导航。
- Contribution 热力图容器允许横向滚动（保持 cell 尺寸，不压缩方块）。
- 滚动条隐藏但可滑动。
- Year 选择器改为移动端友好的下拉菜单，放在 `Contribution activity` 标题行。
- README / 活动卡片边距与圆角在窄屏下重新平衡。

实现重点：

- 桌面端 cell 尺寸随宽度动态计算。
- 移动端强制固定 `contribCellSize=11`，避免字体/格子被缩放破坏视觉一致性。

---

## 6. Contribution 热力图生成逻辑

核心代码：`themes/claude/components/ProfileHome.js`

### 6.1 输入数据

优先使用持久化事件（`props.contributionEvents`）：

- `type`: `create` 或 `update`
- `repositoryId`
- `timestampMs`
- `title` / `slug`

如果持久化不可用，则回退到前端从 `posts` 直接推导：

- 每篇文章产生一个 `create`（createdAt）
- 若更新时间与创建时间不同，再产生一个 `update`（updatedAt）

### 6.2 统计区间

两种模式：

- 默认模式：最近 1 年（滚动窗口）
- 年份模式：固定某一年（1 月 1 日到 12 月 31 日）

区间会对齐到整周边界：

- 起点对齐到周日
- 终点对齐到周六

### 6.3 颜色分级（level）

`CONTRIBUTION_LEVEL_THRESHOLDS`：

- `0`: 无贡献
- `1`: `count === 1`
- `2`: `count >= 2`
- `3`: `count >= 3`
- `4`: `count >= 6`

说明：`1 contribution/day` 必须稳定映射到同一颜色等级。

### 6.4 月标签策略

默认滚动年模式：

- 按周列起始日期所属月份生成 marker（接近 GitHub 视觉规则）。

固定年份模式：

- 每个月从当月第一天所在周列生成 marker。

### 6.5 交互

- Hover cell 显示 tooltip（延迟触发，避免抖动）。
- 点击某一天可过滤下方 activity（再次点击取消）。
- `Less`/`More` legend 与热力图颜色等级一致。

---

## 7. Contribution Activity 生成逻辑

核心代码仍在 `themes/claude/components/ProfileHome.js`。

渲染策略：

- 默认按“月”分组（如 March 2026）。
- 点选某一天后，切换成“日”分组（如 March 3, 2026）。
- 组内分别聚合：
  - `update` 事件 -> commit summary（按仓库聚合，统计 commitCount）
  - `create` 事件 -> created repositories 列表

显示逻辑：

- 无数据时展示 empty state。
- 有更新和创建则分别渲染摘要行。
- 链接点击跳转对应文章。

---

## 8. 数据库设计（Supabase）

服务端存储实现：`lib/server/claude/contributionStore.js`

使用两张表：

- `claude_contribution_events_v1`
- `claude_contribution_snapshots_v1`

### 8.1 推荐表结构

```sql
create table if not exists public.claude_contribution_events_v1 (
  event_id text primary key,
  event_type text not null check (event_type in ('create', 'update')),
  repository_id text not null,
  timestamp_ms bigint not null,
  title text default '',
  slug text default ''
);

create index if not exists idx_claude_contrib_events_ts
  on public.claude_contribution_events_v1 (timestamp_ms desc);

create index if not exists idx_claude_contrib_events_repo
  on public.claude_contribution_events_v1 (repository_id);

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

### 8.2 字段语义

`events` 表：

- `event_id`：事件主键，规则为 `e_${md5(type|repositoryId|timestampMs)}`
- `event_type`：`create` / `update`
- `repository_id`：文章 ID 归一化（去 `-` + 小写）
- `timestamp_ms`：事件时间戳（毫秒）
- `title` / `slug`：冗余展示信息

`snapshots` 表：

- `repository_id`：文章唯一标识（主键）
- `created_at_ms`：创建时间
- `updated_at_ms`：最近更新时间
- `synced_at_ms`：本次同步时间

---

## 9. 更新逻辑（从 Notion 到数据库）

入口：`pages/index.js` 的 `getStaticProps`。

### 9.1 同步步骤

1. 获取已发布文章（排除 `readme.md`）。
2. 每篇文章构建 snapshot：
   - `repositoryId`
   - `createdAtMs`
   - `updatedAtMs`
3. 调用 `syncContributionSnapshots(snapshots)`：
   - upsert snapshot（冲突键 `repository_id`）
   - 根据“新旧快照差异”生成事件
4. 拉取事件 `listContributionEvents(limit)`。
5. 过滤到“昨天为止”：
   - `filterContributionEventsUntilYesterday`
   - 当天事件不显示在首页（稳定 UI，避免当天多次刷新抖动）
6. 写入本地日缓存，返回给前端。

### 9.2 事件生成规则（关键）

在 `syncContributionSnapshots` 内：

- 若快照不存在（新文章）：
  - 创建 `create` 事件（`created_at_ms`）
  - 如果 `updated_at_ms > created_at_ms`，再创建 `update` 事件
- 若快照已存在：
  - 仅当 `updated_at_ms` 大于旧快照时，新增 `update` 事件
- 事件写入前按 `event_id` 去重，保证同一逻辑事件只存在一份。

---

## 10. 缓存设计

本主题使用多层缓存，目标是减少重复请求并提高稳定性。

### 10.1 Contribution 日缓存（进程内）

位置：`lib/server/claude/contributionStore.js`

- 缓存键：`globalThis.__claude_contribution_daily_cache_v1`
- 内容：`dayKey` / `events` / `updatedAtMs` / `dirty`
- 刷新条件：
  - 手动强制（`CLAUDE_CONTRIBUTION_FORCE_REFRESH=true`）
  - build/export 阶段
  - 当日尚未刷新
  - 通过 API 标记 `dirty`

失败回退：

- 刷新失败时优先使用 stale 缓存（`allowStale=true`）
- 仍不可用则回退到前端即时计算

### 10.2 README 快照缓存

位置：`pages/index.js`

- 键：`readme_render_snapshot_v2_${pageId}_${locale}`
- 缓存内容：
  - `bodyFingerprint`
  - `excerpt`
  - `readmeHtml`
  - `readmeHtmlSource`
- 逻辑：
  - 若正文指纹未变，直接复用缓存 HTML
  - 若变化，重新执行转换与渲染

### 10.3 GitHub Markdown API 缓存

位置：`lib/db/notion/notionBlocksToHtml.js`

- 键：`readme_github_md_${md5(markdown)}`
- 策略：
  1. 先查缓存，命中直接返回。
  2. 调 GitHub `/markdown` API。
  3. API 失败/超限，再查一次缓存。
  4. 仍失败则回退到本地 `marked + highlight.js`。

说明：GitHub 匿名接口有速率限制，本层缓存用于显著降低超限概率。

### 10.4 全站缓存后端

统一缓存门面：`lib/cache/cache_manager.js`

- 优先 Redis（`REDIS_URL`）
- 否则文件缓存（`ENABLE_FILE_CACHE`）
- 否则内存缓存（开发 120 分钟，生产 10 分钟）

---

## 11. README 渲染链路

目标：在首页 README 卡片中稳定展示富文本与代码高亮，避免 hydration 相关问题。

当前实现：

1. 从 Notion 拉 `readme.md` 的 `blockMap`
2. `notionBlocksToMarkdown(blockMap, pageId)` 转 Markdown
3. `renderMarkdownToHtml(markdown)` 转 HTML
   - 优先 GitHub API
   - 失败则本地 fallback
4. 前端 `ProfileHome` 直接渲染：
   - `<div className="markdown-body" dangerouslySetInnerHTML={{ __html: readmeHtml }} />`

样式来源：

- `styles/claude-readme.css` 导入 GitHub Markdown CSS
- `_app.js` 导入 `highlight.js` 主题（本地 fallback 时生效）

---

## 12. 配置项说明（Claude 主题）

配置文件：`themes/claude/config.js`

以下配置可由环境变量覆盖（`NEXT_PUBLIC_*`），并可被 Notion 配置页同名项再覆盖：

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `CLAUDE_BLOG_NAME` | `活字印刷` | 主题主标题 |
| `CLAUDE_BLOG_NAME_EN` | 同主标题 | 副标题/英文标题 |
| `CLAUDE_POST_AD_ENABLE` | `false` | 列表插广告 |
| `CLAUDE_POST_COVER_ENABLE` | `false` | 列表显示封面 |
| `CLAUDE_ARTICLE_RECOMMEND_POSTS` | `true` | 文章页推荐文章 |
| `CLAUDE_MENU_CATEGORY` | `true` | 显示分类菜单 |
| `CLAUDE_MENU_TAG` | `true` | 显示标签菜单 |
| `CLAUDE_MENU_ARCHIVE` | `true` | 显示归档菜单 |
| `CLAUDE_TOC_ENABLE` | `true` | 启用右侧目录 |
| `CLAUDE_TOC_SHOW_LEVEL3` | `true` | 目录显示三级标题 |
| `CLAUDE_TOC_SCROLL_BEHAVIOR` | `instant` | TOC 点击/联动滚动行为 |
| `CLAUDE_SUBTITLE_DARK_ONLY` | `false` | 副标题仅暗色显示 |
| `CLAUDE_PROFILE_AVATAR` | `''` | 侧栏头像 URL |
| `CLAUDE_FOOTER_COPYRIGHT` | `''` | 自定义页脚版权文案 |
| `CLAUDE_README_CACHE_ENABLED` | `true` | README 快照缓存开关 |
| `CLAUDE_CONTRIBUTION_PERSIST_ENABLED` | `true` | Contribution 持久化开关 |
| `CLAUDE_CONTRIBUTION_EVENT_LIMIT` | `50000` | 拉取事件上限 |

---

## 13. 环境变量说明

### 13.1 必需（最小可运行）

```bash
NEXT_PUBLIC_THEME=claude
NOTION_PAGE_ID=<your notion database/page id>
```

### 13.2 Notion 访问（可选，私有库常用）

```bash
NOTION_TOKEN_V2=<token_v2>
NOTION_ACTIVE_USER=<optional>
```

说明：

- `NOTION_TOKEN_V2`：用于访问非公开 Notion 数据。
- `NOTION_ACTIVE_USER`：可选，不填时使用 token 仍可工作（取决于 Notion 侧权限）。

### 13.3 Contribution 持久化（Supabase）

```bash
NEXT_PUBLIC_CLAUDE_CONTRIBUTION_PERSIST_ENABLED=true
NEXT_PUBLIC_CLAUDE_CONTRIBUTION_EVENT_LIMIT=50000

SUPABASE_URL=<https://xxx.supabase.co>
SUPABASE_SECRET_KEY=<service key> # 或 SUPABASE_SERVICE_ROLE_KEY

# 可选前端命名回退
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

补充控制项：

```bash
CLAUDE_CONTRIBUTION_FORCE_REFRESH=false
CLAUDE_CONTRIBUTION_TRIGGER_TOKEN=<optional token>
```

### 13.4 README 缓存与全站缓存

```bash
NEXT_PUBLIC_CLAUDE_README_CACHE_ENABLED=true
ENABLE_CACHE=true
REDIS_URL=<optional>
```

---

## 14. 如何使用该主题

### 步骤 1：切换主题

在 `.env.local`：

```bash
NEXT_PUBLIC_THEME=claude
```

### 步骤 2：准备首页 README 页面

在 Notion 中准备一个页面，slug 必须为：

```text
readme.md
```

首页会自动识别该页面并渲染到 README 卡片。

### 步骤 3：可选启用 Contribution 持久化

1. 在 Supabase 创建两张表（见第 8 节 SQL）。
2. 配置 Supabase 环境变量。
3. 打开 `NEXT_PUBLIC_CLAUDE_CONTRIBUTION_PERSIST_ENABLED=true`。

### 步骤 4：启动

```bash
yarn dev
```

生产构建：

```bash
yarn build
yarn start
```

### 步骤 5：手动触发贡献刷新（可选）

接口：`/api/claude/contribution-refresh`

示例：

```bash
curl "http://localhost:3000/api/claude/contribution-refresh?token=<token>&revalidate=1&path=/"
```

---

## 15. 运行日志与排障

### 15.1 日志前缀

- Contribution：`[Contrib] ...`
- README 渲染：`[README] ...`

注意：这些日志在服务端终端输出，不在浏览器控制台。

### 15.2 常见问题

1. 热力图无数据

- 检查 `NEXT_PUBLIC_CLAUDE_CONTRIBUTION_PERSIST_ENABLED` 是否为 `true`
- 检查 Supabase 连接变量是否正确
- 检查两张表是否已创建

2. 当天更新未显示

- 当前逻辑默认过滤“今天”的事件，只显示到昨天（设计行为）

3. README 代码块高亮不稳定

- 若 GitHub `/markdown` 超限会自动回退到本地 `marked + highlight.js`
- 可通过缓存复用此前成功渲染结果

---

## 16. 设计约束与已知行为

- `claude` 主题只影响自身主题目录，不改动其他主题行为。
- Contribution 事件是幂等写入，不应重复产生同一 `create` 事件。
- README 渲染采用“服务端转换 + 前端静态 HTML 注入”，目标是稳定优先。
- 移动端优先保持桌面视觉语言一致，不随屏宽自动降级字体粗细/大小。

---

## 17. 维护建议

- 如果你修改了热力图规则，请同步更新：
  - `themes/claude/components/ProfileHome.js`
  - 本 README 的第 6、7 节
- 如果你修改了表字段，请同步更新：
  - `lib/server/claude/contributionStore.js`
  - 本 README 的第 8、9 节 SQL 与字段说明
- 如果你修改了缓存策略，请同步更新：
  - `lib/cache/*`
  - `pages/index.js`
  - `lib/db/notion/notionBlocksToHtml.js`
