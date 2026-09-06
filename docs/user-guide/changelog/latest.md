# 最新版本与更新日志

> 当前主线：**4.10.10**（见根目录 `package.json`）

## 4.10.10 发布要点

`4.10.10` 是一次小版本维护发布，集中收录 `v4.10.9` 之后的近期主线改动。普通站点同步最新 `main` 后重新部署即可；只有需要内嵌子页面层级 URL 或 PWA 安装入口的站点，才需要新增可选配置。

### 性能与外部资源

- 默认不再加载 `Noto Sans SC`、`Noto Serif SC` 等第三方中文 Web Font，未配置自定义字体的站点会优先使用系统字体，减少首屏字体请求和下载体积。
- 仍保留自定义 Web Font 能力；如需品牌字体，可通过环境变量 `NEXT_PUBLIC_FONT_URL` 或 Notion Config 的 `FONT_URL` 显式开启。中文 Web Font 可能显著增加字体分片请求，站长应根据品牌一致性与首屏性能自行取舍。
- Google Fonts 的 DNS 预取和预连接只会在实际配置了 `fonts.googleapis.com` 字体地址时输出，避免非 Google 字体配置也触发无效预连接。

使用方法见 [字体字号](../config/notion-next-web-font.md)。

### PWA 安装入口

- 新增可选配置 `PWA_ENABLE=true`，开启后 Android Chrome 可将博客安装到桌面。
- 安装入口由 Notion Config 或环境变量 `PWA_ENABLE` 控制，主题色可通过 `PWA_THEME_COLOR` 配置。
- manifest 使用固定路径 `/manifest.json`，默认指向首页 `/`，并使用站点标题、描述和站点图标生成安装信息。
- `PWA_NAME`、`PWA_SHORT_NAME`、`PWA_ICON` 可作为少数站点的备用覆盖项；默认情况下无需单独配置。
- 功能默认关闭，不影响未开启站点。

使用方法见 [PWA 安装入口](../config/pwa-install.md)。

### Notion 内嵌子页面 URL

- 新增可选配置，推荐在 Notion Config 中添加 `INNER_PAGE_URL_PARENT_PATH=true`。
- 也可以在部署平台添加 `NEXT_PUBLIC_INNER_PAGE_URL_PARENT_PATH=true`。开启后，未收录到数据库的 Notion 内嵌子页面 URL 会跟随当前文章路径，例如 `/article/fpga-studying-notes/{pageId}`。
- 已收录到 NotionNext 数据库、并拥有明确 `slug / href` 的页面仍优先跳转自己的正式地址，避免影响 sitemap、RSS、站内搜索和旧链接兼容。
- 该能力只优化访问路径和层级表达；未收录子页面不会因此自动进入 sitemap、RSS 或搜索索引。需要 SEO 收录的页面仍建议加入主数据库并配置明确 `slug`。

使用方法见 [URL 自定义：内嵌子页面跟随父路径](../config/url-customize.md#内嵌子页面跟随父路径)。

### 阅读与主题体验

- 修复静态分享 SVG 被 Next/Image 优化导致的显示风险，分享图标继续按静态资源方式加载。
- Magzine 主题恢复文章页广告与侧栏间距，避免正文和广告区域贴得过近。
- 主题设置抽屉增加更顺滑的动效反馈。
- XuHome 主题完成主线集成，并补充深色模式对比度与调色板实时生效修复。
- NotionTabs 支持 keep-alive 行为，切换标签时可保留已渲染内容状态。
- Callout 嵌套子块和无图标 Callout 渲染更稳定。

相关文档：

- [主题目录](../themes/THEMES_CATALOG.md)
- [Magzine 主题](../themes/magzine.md)
- [代码样式与侧栏预览](../config/notion-next-code-style.md)

### 部署与依赖

- 继续跟进依赖维护和安全更新，包括 Next.js、Supabase、Vercel Functions 及开发依赖组。
- Notion 图片浏览器缓存和 Cloudflare 文档继续保持在新版手册中，方便站长按需配置。

相关文档：

- [部署指南索引](../deploy/index.md)
- [Notion 图片反代与缓存](../deploy/notion-image-proxy.md)

### 升级说明

- 普通 Vercel / Netlify / Cloudflare Pages / Docker 站点：同步最新 `main` 后重新部署即可。
- 如果要启用 Android Chrome PWA 安装入口，推荐在 Notion Config 添加 `PWA_ENABLE=true`。
- 如果要启用内嵌子页面父路径 URL，推荐在 Notion Config 添加 `INNER_PAGE_URL_PARENT_PATH=true`。
- 也可以在部署平台添加 `NEXT_PUBLIC_INNER_PAGE_URL_PARENT_PATH=true` 后重新部署。
- 如果你依赖 Docker 镜像，请等待本版本 GitHub Release 对应的 GHCR 镜像发布完成后再拉取。

### GitHub Release

- Release：[v4.10.10](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.10)
- 完整变更：[v4.10.9...v4.10.10](https://github.com/notionnext-org/NotionNext/compare/v4.10.9...v4.10.10)

## 4.10.9 发布要点

本版本集中合入 `v4.10.8` 之后的社区修复、Notion 渲染兼容、主题移动端体验、依赖安全更新和 Docker 发布增强。多数站点只需要同步最新 `main` 并重新部署，不需要新增环境变量。

- 新增 OpenAI 兼容 AI 助手代理，可通过 `AI_CHAT_*` 配置接入 DeepSeek 等兼容 `chat/completions` 的模型服务。

### Notion 数据与内容渲染

- Notion Config 读取兼容新版 Notion 数据库块：配置库既可以来自 `collection_view`，也可以来自 `collection_view_page`。
- 修复页面中包含数据库视图、HTML 块、空 `content` 字段或异常 transclusion 引用时，构建阶段出现 `content is not iterable` 的问题。
- 文章目录生成会跳过非数组内容，避免数据库视图或特殊块影响整页渲染。
- 支持 Notion Tabs 块渲染，适合在文章中整理多组并列内容。
- 自定义菜单可以指向 `Invisible` 页面，并优先使用该隐藏页最终生成的访问地址；`Draft` 等未发布页面不会因此被菜单暴露。

### 阅读与写作体验

- 长代码块在桌面端支持“侧栏查看”，便于阅读超长配置、脚本和日志。
- 分享按钮在移动端改为横向滚动，不再挤压变形。
- 加密文章提交按钮在多个主题中统一修复，窄屏下不会只显示半个“提交”。
- 原创存证、公开清单和一键复制证据能力已进入文档化使用路径，适合原创长文站点逐步启用。
- 内嵌 Notion 子页面可通过 Notion Config 配置 `INNER_PAGE_URL_PARENT_PATH=true`，或通过环境变量 `NEXT_PUBLIC_INNER_PAGE_URL_PARENT_PATH=true`，让未收录子页的访问地址跟随父级文章路径。

### 主题修复

- Matery 主题优化移动端文章标题、标签换行和正文页间距。
- Claude / Typography / Game / Nobelium / Plog 等主题补齐菜单和子菜单图标显示。
- Claude / Typography 子菜单图标条件修正，避免生成空图标占位。
- Matery 右下角悬浮按钮、分享按钮和标签布局相关修复已合入主线。

### 部署、依赖与安全

- Docker GHCR 镜像发布增加 provenance 与 SBOM attestation，便于自托管用户检查镜像来源和依赖清单。
- 依赖更新：`next`、`axios`、`@supabase/supabase-js`、`ip-address`、`nanoid` 等。
- GitHub Actions 更新：`actions/setup-node`、`actions/setup-python`、`actions/stale`、`actions/labeler`、`github/codeql-action`。

### 对应文档

- 升级方式：见 [版本升级指引](../update.md)。
- Notion 数据库与块兼容：见 [Notion 数据库](../notion-database.md)。
- 菜单与隐藏页：见 [菜单 Menu / SubMenu](../menu-secondary.md) 与 [隐藏页面](../notion/notionnext-hidden-page.md)。
- 代码侧栏预览：见 [代码块风格](../config/notion-next-code-style.md)。
- 主题变化：见 [主题全览](../themes/THEMES_CATALOG.md)、[Matery](../themes/matery.md)、[Claude](../themes/claude.md)、[Typography](../themes/typography.md)。
- Docker / VPS：见 [部署指南索引](../deploy/)。

### 升级说明

- 普通 Vercel / Netlify / Cloudflare Pages / Docker 站点同步最新代码并重新部署即可。
- 如果你使用 Notion Config 数据库作为配置来源，建议升级后打开首页确认站点名、主题、菜单等配置是否按预期读取。
- 如果菜单跳转到隐藏页面，升级后可将目标页面设为 `Invisible`，菜单会指向该页面的真实生成路径。
- 如果使用自定义主题或深度改过主题菜单组件，建议重点检查菜单图标、子菜单、加密文章提交按钮和移动端分享栏。

### GitHub Release

- Release：[v4.10.9](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.9)
- 完整变更：[v4.10.8...v4.10.9](https://github.com/notionnext-org/NotionNext/compare/v4.10.8...v4.10.9)

## 4.10.8 发布要点

本版本新增 Cloudflare Worker 版 Notion 图片反代示例，并补充完整站长教程。站长可以把 Notion 素材统一映射到自己的 CDN 域名，例如 `https://cdn.example.com`，让 `www.notion.so/image/...` 和 Notion 内置封面图经过自己的 Cloudflare 缓存。

### Notion 图片反代

- 新增 `cloudflare/notion-image-proxy` 最小 Worker 工程，默认只放行 `/image/` 和 `/images/`。
- Worker 支持 Notion 签名图片跳转链路，并使用 `caches.default` 显式缓存响应，重复访问同一图片可观察到 `X-Notion-Image-Proxy-Cache: HIT`。
- 示例配置使用 Cloudflare Custom Domain，生产示例域名为 `cdn.tangly1024.com`。
- 保持 NotionNext 侧接入方式不变：只需配置 `NEXT_PUBLIC_NOTION_HOST=https://你的CDN域名`。

### 文档

- 新增 Notion 图片反代教程，覆盖 Worker 部署、API Token 权限、Custom Domain 限制、本地预览、`yarn start` / `yarn export` 兼容性和缓存验证方式。
- 记录常见坑：`Write all resources` 仍缺 `User -> Memberships -> Read`、Custom Domain 不能带路径、浏览器内存缓存会显示旧的 `CF-Cache-Status: MISS`、`prod-files-secure` 不能直接请求 S3 原始地址。
- VitePress 部署目录新增「Notion 图片反代」入口。
- 新增原创存证教程，说明 `NEXT_PUBLIC_ORIGINALITY_PROOF_ENABLE`、Notion `proof` / `proofTime` / `proofHash` / `proofUrl` 字段，以及本地内容哈希的证明边界。
- 原创存证展示改为紧凑徽章，可展开查看详情并一键复制证据文本。
- 原创存证新增可选 GitHub 自动公开清单模式，构建时可生成 `public/proofs/originality.json`，用于公开保存文章哈希证据。
- 原创存证教程补充自动清单 JSON 示例、字段说明和 workflow 常见问题排查。

### 升级说明

- 该能力是可选增强，不影响默认 `https://www.notion.so` 图片加载。
- 动态部署和静态导出都可使用；静态站点只要重新构建，让 HTML 输出新的 `NEXT_PUBLIC_NOTION_HOST` 即可。
- 图片请求量大的站点建议使用 Workers Paid，因为每张图片请求都会计入 Worker request。

### 验证

- `node --check cloudflare/notion-image-proxy/worker.mjs`：通过。
- `curl -I` 连续请求真实 Notion 图片：第二次返回 `CF-Cache-Status: HIT` 与 `X-Notion-Image-Proxy-Cache: HIT`。
- `git diff --check`：通过，仅保留 Windows 工作区 LF/CRLF 提示。

## 2026-08-05 自动部署流程事故记录

::: warning 事件说明
部分使用 GitHub fork + Vercel 自动部署的站点，曾收到 `Upstream Sync` 或 `chore(release): bump package.json ... [skip-version]` 构建失败邮件；个别站点可能因此出现生产部署异常。
:::

### 影响范围

- 仅影响仍保留旧版自动同步或自动版本 bump 工作流的 fork 站点。
- 手动同步、未连接 Vercel Git 部署，或使用其他部署方式的站点不在此次自动触发范围内。
- 本次事件不涉及 Notion 数据丢失；问题发生在代码同步和部署触发链路。

### 原因分析

1. 旧版 `Upstream Sync` 使用定时任务，将上游 `main` 的提交自动合并到站长的 fork。
2. 旧版版本 bump 工作流在 `main` 更新后自动修改 `package.json`，即使只改变版本号，也会产生新的 Git 提交。
3. Vercel 对 fork 的 `main` 提交自动创建部署，因此版本号提交也会触发完整生产构建。
4. 提交信息中的 `[skip-version]` 只能阻止 GitHub Actions 自身重复 bump，不能让 Vercel 跳过构建。旧站点的构建失败后，可能出现错误部署记录或生产指向异常。

### 修复措施

- 关闭 `Upstream Sync` 默认定时任务，改为站长按需手动同步。
- 关闭版本 bump 工作流的 `push` 触发，仅保留手动执行。
- 在 `vercel.json` 中加入 `ignoreCommand`，让 Vercel 自动跳过带 `[skip-version]` 的版本号提交。
- 在升级教程中补充旧自动流程的恢复步骤和按需开启方法。

相关修复已合并到主线：

- [`0ca93d86`](https://github.com/notionnext-org/NotionNext/commit/0ca93d86946a97f9f1bc292e0468cda278e0a59b)

### 站长如何处理

如果站点已经出现失败部署：

1. 在 Vercel 的 `Deployments` 中找到最近一条绿色 `Ready` 的 `Production` 部署，使用 `Promote to Production` 或 `Redeploy` 恢复线上版本。
2. 将 fork 同步到最新的 NotionNext `main`，使新的工作流和 `vercel.json` 进入自己的仓库。
3. 后续无需重新开启旧的定时任务；需要更新时使用 GitHub 的 `Sync fork` 或手动合并上游代码。

上游仓库无法直接修改每个站长账号下的 Vercel 项目，也无法替旧 fork 远程执行同步。因此，历史旧 fork 至少需要完成一次同步，才能获得本次保护规则。

::: tip 当前状态
主线修复已发布，主线 CI 工作流、CodeQL、文档部署和关联 Vercel Production 部署均已验证通过。后续版本发布不再通过自动版本号提交触发所有 fork 的生产重建。
:::

### 2026-08-05 Notion API 403 后续修复

部分站点在同步最新代码后，Vercel 构建仍可能出现：

```text
[POST] https://www.notion.so/api/v3/loadPageChunk: 403 Forbidden
```

经与 [react-notion-x issue #710](https://github.com/NotionX/react-notion-x/issues/710) 对照确认，原因是 Notion 前置 Cloudflare 开始拦截 Node.js 请求中缺少 `User-Agent` 的非官方 API 请求。该问题不是站长的页面权限或 `NOTION_PAGE_ID` 配置突然失效。

修复内容：

- 在 `notion-client` 的全局 `ofetchOptions` 中补充 `NotionNext` 的 `User-Agent`。
- 保留 Notion 请求失败时的空数据兜底，避免 403 进一步导致页面静态序列化失败。

验证结果：同一接口请求不带 UA 返回 `403`，带 `NotionNext` UA 返回 `400`（空请求参数错误），证明 Cloudflare 拦截已解除。

站长处理方式：将 fork 同步到最新 `main` 后重新部署即可；无需修改 Node 版本，也无需反复修改页面权限。若仍出现 403，请先确认部署使用的是包含该修复的提交，并检查是否配置了自定义 `API_BASE_URL` 代理。

## 4.10.7 发布要点

本版本将主题颜色定制从 Tailwind 类名覆盖，过渡到主题语义色变量与调色板方案。早期使用 TailwindCSS 是为了快速开发；现在主题框架已经成熟，后续更适合通过 `*_COLOR_*` 配置项表达主色、背景、文字、边框等语义色，便于用户在 Notion Config 中快速调色，也避免 `.bg-indigo-600` 这类工具类被覆盖后产生语义混淆。

### 主题调色板

- 全局主题工具新增当前主题调色板，展示每个主题可覆盖的色号变量、CSS 变量名、默认色值和复制入口。
- 25 个内置主题均已在 `conf/themeSwitch.manifest.js` 声明 palette；切换主题后即可查看该主题的可配置色号。
- Fuwari 保留原有色相模型，调色板显示 `FUWARI_THEME_COLOR_HUE`，复制值为数字色相，避免破坏现有配置。
- Endspace、Heo、Claude 等多色主题提供更完整的背景、文字、强调色、边框等变量；Fuwari、Hexo、Medium 等单主色主题保持轻量色板。

### 配置与兼容

- 新增或整理各主题的 `*_COLOR_*` 配置项，用户可在 Notion Config 表、环境变量或主题 `config.js` 中覆盖。
- 保留既有 TailwindCSS 与旧配置的渲染路径，不要求用户立即迁移；推荐新调色优先使用主题色变量。
- 补充主题迁移指南与主题色 token roadmap，后续新增主题必须首版声明 `*_COLOR_*` 与 manifest 调色板。
- 各主题文档补充调色说明，说明如何从全局主题工具复制配置项并在 Notion Config 中覆盖。

### 验证

- Babel parser 定向解析：通过。
- `npx eslint` 定向检查主题色相关文件：通过。
- manifest smoke check：25 个内置主题 palette 覆盖率 100%。
- `git diff --check`：通过，仅保留 Windows 工作区 LF/CRLF 提示。

## 4.10.5 发布要点

本版本新增基于 Notion 数据库的 NotionComments 评论插件，并合入 `v4.10.4` 之后主线上的主题修复、Notion 渲染增强、复制权限配置、SEO 和依赖更新。

### NotionComments 评论插件

- 新增 `NEXT_PUBLIC_COMMENT_NOTION_ENABLE` 评论开关，可与 Waline、Giscus、Valine、GitTalk、Utterance、Cusdis、Twikoo 等评论插件并存，通过文章底部评论区 Tab 切换体验。
- 新增 `/api/notion-comments` 动态接口，评论数据写入用户自己的 Notion 数据库，支持文章维度查询、发表评论、回复评论、分页加载和失败重试。
- 新增评论区交互界面：加载中、空状态、错误重试、回复输入、收起回复、加载更多等基础状态都已覆盖。
- 新增 NotionComments 使用教程，包含 Notion Integration 创建、数据库字段配置、环境变量、部署方式、常见问题、使用效果截图，以及“独立评论数据库”和“Notion 页面原生评论”两种方案的取舍说明。
- 新增会员评论路线图文档，记录未来会员体系和评论能力继续结合 Notion 数据的可选方向。

### 主线功能与修复

- 支持文章级自定义版权模式，并补充 `CAN_COPY` 复制权限配置文档和侧边栏入口。
- 改进 SEO canonical metadata，减少错误 canonical 地址对搜索收录的影响。
- 支持 Notion Heading 4 渲染。
- 支持应用 Notion Collection View 的排序规则。
- 修复分类和标签静态路径生成的保护逻辑。
- 同步 Endspace 主题更新。
- 修复 Claude 主题侧栏在 Adsense 场景下的高度问题。
- 修复 Fuwari 固定主题色不生效问题。
- 修复 Magzine 主题文章标签换行问题。
- 为分享按钮和右侧浮动区域补充鼠标悬停提示。

### 依赖与工作流更新

- `form-data` 从 `4.0.5` 升级到 `4.0.6`。
- `@babel/core` 从 `7.28.3` 升级到 `7.29.7`。
- `axios` 从 `1.17.0` 升级到 `1.18.1`。
- `@vercel/functions` 从 `3.6.2` 升级到 `3.7.5`。
- `actions/checkout` 从 `4` 升级到 `7`。
- `docker/metadata-action` 从 `5` 升级到 `6`。

### 升级说明

- 如需启用 NotionComments，需要新增：
  - `NEXT_PUBLIC_COMMENT_NOTION_ENABLE=true`
  - `NOTION_COMMENT_DATABASE_ID=你的评论数据库 ID`
  - `NOTION_TOKEN=你的 Notion Integration Token`
- NotionComments 依赖服务端 API Route，只支持 Vercel、Netlify、Node.js Server、Docker 等动态部署方式；使用 `yarn export` / 纯静态导出的站点不支持该插件。
- `NOTION_TOKEN` 是敏感凭据，只应保存在服务端环境变量中，不要提交到仓库，也不要暴露在公开截图或前端配置里。

### 自 v4.10.4 以来的提交

- `feat: add Notion database comments plugin`
- `docs: add optional membership comments roadmap`
- `fix(endspace): sync upstream theme updates`
- `fix: improve SEO canonical metadata (#4248)`
- `feat: support custom article copyright mode`
- `fix(claude): keep sidebar height with adsense (#4247)`
- `fix: guard category/tag static paths`
- `docs: explain adding CAN_COPY in Notion`
- `docs: expose copy permission guide in sidebar`
- `docs: add copy permission guide to config index`
- `feat: support per-post copy permissions`
- `fix(fuwari): honor fixed theme hue (#4243)`
- `fix(magzine): keep post tags on one line`
- `docs: fix post list style config comment (#4242)`
- `fix: support Notion heading 4 (#4241)`
- `fix: apply Notion collection view sorts (#4240)`
- `chore(share buttons): add tips for mouse hover (#4212)`
- `chore(right float area): add tips (#4213)`
- `chore: bump form-data from 4.0.5 to 4.0.6 (#4204)`
- `chore: bump @babel/core from 7.28.3 to 7.29.7 (#4211)`
- `chore: bump axios from 1.17.0 to 1.18.1 (#4222)`
- `chore: bump docker/metadata-action from 5 to 6 (#4228)`
- `chore: bump actions/checkout from 4 to 7 (#4229)`
- `chore: bump @vercel/functions from 3.6.2 to 3.7.5 (#4238)`

### 验证

- `jest __tests__/lib/plugins/notionComments.test.js --runInBand`：通过。
- `next lint --file components/NotionComments.js --file lib/plugins/notionComments.js --file __tests__/lib/plugins/notionComments.test.js`：通过。
- `git diff --check`：通过。
- `yarn docs:site:build`：通过。

## 4.10.3 发布要点

本版本重点优化 Magzine 主题、字体资源、构建缓存和 Notion 数据过滤，并合入社区站数据库、视图筛选、Heo / Fuwari / Hexo / Matery 主题体验与依赖安全更新。

### 性能与资源加载

- 优化 Magzine 首页首屏图片加载策略，减少 LCP 图片延迟。
- 调整 Magzine 首页图片、广告位与文章卡片布局，降低图片、广告和卡片内容加载时的布局抖动。
- Font Awesome 样式改为延后加载，并在用户有交互意图后再加载，减少首屏阻塞。
- 预留 Font Awesome 图标布局空间，修复延迟加载期间图标可见性和页面跳动问题。
- 将 Font Awesome 字体文件改为本地自托管，减少第三方字体 CDN 依赖。
- Web Font 仅在配置启用时加载，未配置自定义字体的站点不再请求额外字体资源。

### Notion 数据与构建稳定性

- 稳定本地构建缓存文件锁，降低并发构建或重复读取缓存时的异常风险。
- 优化 filtered collection 数据处理，减少无关 Notion collection 数据进入页面数据。
- 保留空的 selected view 结果，避免空集合视图被误判为缺失数据。
- 增加 typed collection helper，统一集合数据读取路径。

### 主题与配置

- Fuwari 主题首次渲染时正确应用主题色相，并补充主题切换稳定性调整。
- Heo 信息卡 greeting 逻辑归一化，避免不同配置路径显示不一致。
- Hexo / Matery 主题新增 greeting words speed 配置，可控制首页问候语切换速度。
- 新增社区站数据库模板文档，补充 Notion 社区站点搭建入口。

### 文档与部署

- 文档站首页和导航加入最近更新提示能力，方便维护者发现新 changelog 与重要文档更新。
- 更新 Cloudflare Pages V3 build image 迁移说明。
- 更新开发者首页、愿景路线图与性能优化计划，记录本轮性能优化和后续维护方向。

### 依赖更新

- `axios` 升级到 `1.17.0`。
- `@vercel/functions` 升级到 `3.6.2`。
- `ioredis` 升级到 `5.11.1`。
- `@supabase/supabase-js` 升级到 `2.107.0`。

### 参与者

- [@tangly1024](https://github.com/tangly1024)：33 个提交。
- [@qianzhu](https://github.com/qianzhu) / Lucien：6 个提交。
- [@dependabot](https://github.com/dependabot)：4 个提交。
- [@88lin](https://github.com/88lin)：1 个提交。
- [@expoli](https://github.com/expoli)：1 个提交。
- [@githubdudu](https://github.com/githubdudu)：1 个提交。

### 提交范围

从 `v4.10.2` 到 `v4.10.3`：

- `5a1017a7` fix: filter embedded Notion collection views
- `6ec30f99` chore(release): bump package.json to 4.10.1
- `9c793e3c` fix: handle sync_block with content ID array
- `782a35bf` fix: render quote blocks without properties.title
- `6b24adc9` fix: respect view-level filters in database page resolution
- `f837e3d9` fix: apply Fuwari theme hue on initial render
- `1a6b2263` fix: preserve giscus oauth callback token
- `8f685096` docs: surface changelog unread updates
- `1aeac547` merge: release v4.10.2 hotfix
- `ee1043ee` fix: limit docs unread dots to sidebar
- `a0c9970c` fix: mark latest docs unread in sidebar
- `2eee510d` fix: record docs reads for every route
- `07ccff5b` fix: render sidebar unread dots as nodes
- `3815bda6` fix: keep sidebar unread leaf dots visible
- `302feebb` fix: normalize Heo infocard greetings
- `5252770e` refactor: add typed collection helpers
- `61b8c774` docs: add community site database template
- `4fb658be` fix: preserve empty selected view results
- `88e03cc1` chore: bump @supabase/supabase-js to 2.107.0
- `e747d117` chore: bump ioredis to 5.11.1
- `8e11d730` chore: bump @vercel/functions to 3.6.2
- `186b3e3a` chore: bump axios to 1.17.0
- `9922643f` Optimize Font Awesome stylesheet loading
- `3abb4a83` Merge Font Awesome loading optimization
- `35f332d5` Improve magzine homepage performance
- `6ccd2b86` Merge magzine homepage performance improvements
- `560d04e2` Optimize magzine LCP image loading
- `c9373041` Merge magzine LCP image optimization
- `1e34875b` Stabilize build cache locks and filtered collection data
- `7d431f12` Merge build cache stability updates
- `cb4c065d` docs: add Cloudflare Pages V3 build image migration
- `941cf310` Improve magzine image and ad layout stability
- `e3d91b9e` Merge magzine image layout stability
- `a9525fff` Defer Font Awesome from critical path
- `f96fecd5` Merge Font Awesome critical path deferral
- `2362c9c2` Load web fonts only when configured
- `8d783e33` Merge deferred web font loading
- `ff2c5073` Load Font Awesome after user intent
- `8da1cf29` Merge Font Awesome intent loader
- `1e4e2de4` Reserve Font Awesome icon layout
- `33ad83bf` Merge Font Awesome layout reservation
- `2a1dda67` Fix delayed Font Awesome visibility
- `ad5e32b2` Merge Font Awesome visibility fix
- `df71ae22` Self-host Font Awesome for menu icons
- `256a2363` Merge self-hosted Font Awesome performance fix
- `512524a7` feat: add configurable greeting words speed

### 适用场景

- 使用 Magzine、Fuwari、Heo、Hexo 或 Matery 主题的站点。
- 希望减少 Font Awesome / Web Font 对首屏渲染影响的站点。
- 使用 Notion collection view、Cloudflare Pages 或依赖构建缓存的站点。

### 升级说明

- 正常升级无需新增环境变量。
- 如果站点依赖 Font Awesome 图标，请升级后确认图标显示正常。
- 如果使用自定义 Web Font，请确认相关字体配置仍按预期启用。
- 如果使用 Hexo / Matery 主题，可按需配置 greeting words speed。

### 验证

- `git diff --check`：通过。
- `node -e "const p=require('./package.json'); if (p.version !== '4.10.3') process.exit(1)"`：通过。
- `yarn docs:site:build`：通过。

## 如何升级

- 站长升级：见 [版本升级指引](../update.md)。
- 构建性能与 Notion API 限流：见 [构建性能与 Notion API 限流](../deploy/build-tuning.md)。
- GitHub Release：[NotionNext Releases](https://github.com/notionnext-org/NotionNext/releases)。

## 历史版本全文

- [V4 历史](./v4-history.md)
- 源站：https://docs.tangly1024.com/article/latest
