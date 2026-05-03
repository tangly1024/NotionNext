# Endspace 主题（NotionNext）

Endspace 是受《明日方舟：终末地》官网视觉风格启发的 NotionNext 主题，由社区作者维护；上游仓库见 [cloud-oc/endspace](https://github.com/cloud-oc/endspace)。收录相关讨论见 [Issue #3990](https://github.com/tangly1024/NotionNext/issues/3990)。

**原作者 / 上游**：[@cloud-oc](https://github.com/cloud-oc)（仓库 [cloud-oc/endspace](https://github.com/cloud-oc/endspace)）。

## 启用方式

1. 安装依赖（根目录已声明，首次拉代码后执行 `yarn install`）：
   - `@tabler/icons-react`
   - `remixicon-react`
2. 环境变量或 Notion 配置中将主题设为 `endspace`（与 `blog.config.js` 中 `THEME` 说明一致）。
3. 按需调整 `themes/endspace/config.js` 中的 `ENDSPACE_*` 配置项。

## 功能概览

- 工业科幻风布局与动效（含可选全屏加载序列）。
- 桌面端左侧竖向导航 + 移动端底栏；集成音乐播放器组件等。
- 文章区使用 `article-wrapper` 包裹 `NotionPage`，与全站文章渲染能力兼容。
- 可选 `NEST` 背景动效：在 `#__nest` 挂载点上由 `public/js/nest.js` 创建画布（收录版通过 `ref` 写入 nest 所需 DOM 属性，避免无效 React DOM 属性）。

## 许可

主题来源于 [cloud-oc/endspace](https://github.com/cloud-oc/endspace)，上游以 **Apache-2.0** 授权。NotionNext 主仓库整体仍以 **MIT** 为主；若你二次分发该主题代码，请同时遵守 Apache-2.0 对归属、NOTICE 与再许可条款的要求（完整文本见 <https://www.apache.org/licenses/LICENSE-2.0>）。

## 预览图

主题预览为 `public/images/themes-preview/endspace.webp`；源图为同目录 `endspace.png`。更新截图后可运行 `yarn perf:compress-theme-previews` 重新生成 webp。

## 维护注意

- 与 [主题迁移指南](../THEME_MIGRATION_GUIDE.zh-CN.md) 对齐：菜单、暗色模式、评论、TOC 等应走 NotionNext 全局约定。
- 上游 `theme` 分支为单一主题包；若上游更新，建议以目录为单位对比合并。
