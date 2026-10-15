# Notion 数据与 4.x 能力

> 对应 `conf/notion.config.js`、`lib/db/SiteDataApi.js` · 版本 **4.11.0**

## 必需环境

| 变量 | 说明 |
| --- | --- |
| `NOTION_PAGE_ID` | 站点根页 32 位 ID，可多语言用逗号分隔如 `id,en:xxx` |
| `NOTION_TOKEN_V2` | 非公开数据库时必填 |

## 数据库视图（NOTION_INDEX）

`NOTION_INDEX`（或 `NEXT_PUBLIC_NOTION_INDEX`）指定使用 Notion 数据库的**第几个视图**作为排序与列表来源：

- `0` = 第一个视图（默认）
- `-1` = 最后一个视图

在 Notion 中调整视图排序后，需重新部署或等待 ISR 刷新。

## 字段名自定义

`NOTION_PROPERTY_NAME` 可把英文表头改为中文，键包括：`title`、`status`、`type`、`slug`、`category`、`tags`、`date`、`summary`、`password`、`icon`、`ext` 等。详见 `conf/notion.config.js`。

## 内容类型（type）

| type | 说明 |
| --- | --- |
| `Post` | 博文，出现在列表 |
| `Page` | 单页 |
| `Menu` / `SubMenu` | 自定义导航，见 [menu-secondary.md](../menu-secondary.md) |
| `Notice` | 公告 |
| `Config` | 配置中心表格 |

`status` 需为 `Published`（或你在配置里定义的发布值）才会展示。

## 定时发布

`POST_SCHEDULE_PUBLISH` / `NEXT_PUBLIC_NOTION_SCHEDULE_PUBLISH`：按 Notion **date** 字段控制上下架。

## 文章密码

支持 Notion `password` 字段；服务端校验使用 **SHA256**（兼容旧版 md5）。见仓库 `lib` 中文章锁相关实现。

## 单篇隐藏评论

数据库增加 Select 属性 **`comment`**，值为 `Hide` 时隐藏该文评论区（4.5.4+）。

## 外部媒体嵌入

Notion 中的视频/音频块会经 `normalizeExternalMediaBlock` 处理，包含 **Apple Music** 等嵌入 URL 的规范化，以便在文章中正确渲染。

## 全局置顶标签（TOP_TAG）

在 Config 或环境变量设置 `TOP_TAG` / `NEXT_PUBLIC_TOP_TAG`：

- 带该标签的多篇「置顶」文章，会在置顶子集内按**最近更新时间**倒序
- 不影响非置顶文章顺序

## 写作与模板

- 数据库用法：[notion-database.md](../notion-database.md)
- 官方模板：[tanghh.notion.site 模板](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5)

## 升级注意（2026）

Notion API / 数据结构多次变更，请保持 NotionNext 与 [latest](../changelog/latest.md) 推荐版本一致，否则可能无法完整拉取页面。
