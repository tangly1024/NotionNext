# 主题迁移指南（NotionNext）

[English](./THEME_MIGRATION_GUIDE.md)

本指南用于把外部主题（例如 Astro/Vite 主题）迁移到 NotionNext 的 Next.js + Notion 数据架构中。

## 1）迁移目标

- 尽量保留原主题的视觉语言（布局、间距、卡片、动效）。
- 遵循 NotionNext 的数据流与功能约定。
- 通过 `themes/<theme>/config.js` 暴露开关，避免把行为硬编码在页面里。

## 2）推荐目录结构

为新主题建立独立目录：

- `themes/<theme>/index.js`
- `themes/<theme>/style.js`
- `themes/<theme>/config.js`
- `themes/<theme>/components/*`

原则：

- 不要直接引用其它主题目录下的 UI 组件。
- 跨主题通用能力优先复用全局组件（如 `NotionPage`、`Comment`、`ShareBar`、`FlipCard`、广告组件等）。
- 主题专属渲染与样式必须留在当前主题目录中。

## 3）NotionNext 数据契约

主题布局/组件常见可用 props：

- `siteInfo`：站点元信息（标题、描述、封面等）
- `posts`、`post`、`archivePosts`
- `latestPosts`、`categoryOptions`、`tagOptions`
- `notice`
- `postCount`
- `prev`、`next`
- `customNav`、`customMenu`
- `rightAreaSlot`

文章常用字段：

- `title`、`slug`、`href`、`summary`
- `publishDay`、`lastEditedDay`
- `pageCover`、`pageCoverThumbnail`
- `category`、`tagItems`
- `toc`

## 4）必须兼容的 NotionNext 功能

迁移新主题时，至少覆盖：

1. **数据驱动菜单**
   - 支持默认菜单项
   - 支持 `customNav`
   - 支持 `CUSTOM_MENU + customMenu` 覆盖

2. **公告模块**
   - 使用 `NotionPage` 渲染公告内容
   - 可通过主题配置开关启停

3. **Notion 封面作为 Hero**
   - 首页 Hero 优先使用 `siteInfo.pageCover`
   - 支持 fallback 配置图

4. **深色模式**
   - 使用全局 context（`useGlobal` / `toggleDarkMode`）
   - 不要单独实现与全局割裂的暗色状态

5. **文章功能模块**
   - TOC 开关
   - 分享开关
   - 评论开关
   - 版权信息开关
   - 上一篇/下一篇开关

6. **侧栏模块化**
   - 最新文章、分类、标签
   - 联系卡（可选翻转）
   - 统计卡
   - 广告卡
   - 插件插槽（`rightAreaSlot`）

7. **右下角浮动工具**
   - 回到顶部
   - 跳到评论区
   - 深色模式快捷切换

## 5）配置设计建议

统一使用 `siteConfig('<KEY>', <default>, CONFIG)`。

建议按组命名：

- `THEME_MENU_*`
- `THEME_HERO_*`
- `THEME_POST_LIST_*`
- `THEME_WIDGET_*`
- `THEME_ARTICLE_*`

避免在组件内部散落“魔法常量”。

## 6）推荐迁移流程

1. 先做最小可运行骨架（`LayoutBase`、`LayoutIndex`、`LayoutSlug` 等）。
2. 再把大文件 `index.js` 拆分为多个组件。
3. 按原主题逐项还原视觉细节（卡片、Banner、元信息密度、动效）。
4. 接入 NotionNext 的特色模块与配置开关。
5. 为新增配置补齐文档。
6. 执行 lint 并验证关键路由：
   - 首页/列表/搜索/归档/分类/标签/文章/404
   - 深浅色模式
   - 菜单行为（`customNav`、`CUSTOM_MENU`）
   - 公告、广告、插件槽、联系卡

## 7）Fuwari 迁移说明

`themes/fuwari` 目前已落地：

- 上游样式参考源：[saicaca/fuwari](https://github.com/saicaca/fuwari)
- Notion 封面 Hero 支持
- 数据驱动菜单（支持 `customNav` / `customMenu`）
- 独立 TOC、侧栏模块、右下角浮动区
- 基于全局 `FlipCard` 的翻转联系卡

## 8）常见坑位

- 菜单硬编码，没有接 `customMenu`。
- 直接复用其他主题 UI，导致耦合。
- 深色模式与全局状态不一致。
- 缺少 `post?.toc`、`notice?.blockMap` 等空值保护。
- 新增功能未透出配置开关。

## 9）高还原度检查清单（以 Fuwari 为例）

- **布局方向**：桌面端默认应为“左侧功能区 + 右侧内容流”。
- **Hero 全宽**：避免 `calc(50% - 50vw)` 在滚动条场景导致偏移，优先使用居中平移方案。
- **文章卡双形态**：
  - 有封面：左文右图
  - 无封面：保留右侧按钮导轨，保持节奏统一
- **Readmore 对齐**：右侧按钮区域需和卡片高度对齐，不应出现跳变。
- **侧栏个人卡**：若原主题有社交按钮行，应在头像/简介下补齐。
- **主题色调色板体验**：
  - 从顶部右上角调色按钮触发
  - 使用悬浮面板，不放在侧栏
  - 实时预览 + 本地记忆
  - 显示可复制的 hue/hex，便于站长回填 `config.js`
- **主题文档放置位置**：
  - 避免把 Markdown 文档直接放在 `themes/<theme>/` 下（部分构建链路会把主题目录当运行时模块处理）
  - 主题说明建议统一放在 `docs/themes/`
- **页面跳转体感**：补轻量过渡动效，接近源主题的交互节奏。

