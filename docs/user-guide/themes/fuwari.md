# Fuwari 主题

> 主题 ID：`fuwari` · 预览：[preview.tangly1024.com/?theme=fuwari](https://preview.tangly1024.com/?theme=fuwari)

## 主题预览

![Fuwari 主题预览](/images/themes-preview/fuwari.webp)

## 简介

日系轻量双栏与主题色板。

## 主题特性

- **定位**：日系轻量双栏与主题色板。
- **适用场景**：日系双栏、色板定制
- **配置前缀**：`FUWARI_*`（共 **50** 项，见下方配置表）
- **在线预览**：[preview.tangly1024.com/?theme=fuwari](https://preview.tangly1024.com/?theme=fuwari)

## 适用场景

日系双栏、色板定制

## 启用方式

1. Notion Config 表：`THEME` = `fuwari`
2. 环境变量：`NEXT_PUBLIC_THEME=fuwari`
3. `blog.config.js` 的 `THEME`

## 进阶实现文档

实现细节、全局改动与架构说明见 [Fuwari 实现文档](../../developer/themes/FUWARI.md)。如果你准备改主题或提交 PR，建议继续阅读。

## 配置说明

配置文件：[`themes/fuwari/config.js`](https://github.com/notionnext-org/NotionNext/blob/main/themes/fuwari/config.js)  
也可在 **Notion Config** 表中填写同名键（对象/数组用 JSON）。

### 单页隐藏侧栏（SidePanel）

只影响你指定的那一页，不影响其它 Page：

1. **Notion 页面 Full width**（页面右上角 `···` → Full width）
2. 或在数据库加复选框/文本字段 **`HIDE_SIDEBAR`**，该页勾选或填 `true`
3. 或字段 **`SIDEBAR`** 填 `false` / `否`
4. 或已有 **`ext`** 字段写 JSON：`{"HIDE_SIDEBAR":true}`

### Fuwari 主题调色

Fuwari 使用单主色色相模型，推荐通过 `FUWARI_THEME_COLOR_HUE` 调整主色：

```js
FUWARI_THEME_COLOR_HUE: 52
```

取值范围为 `0` 到 `360`。主题工具中的调色板会显示当前主色对应的实际色值，复制配置时会复制 hue 数字，便于直接写入 Notion Config。若需要固定站内颜色并隐藏顶部调色按钮，可设置：

```js
FUWARI_THEME_COLOR_FIXED: true
```

<!-- theme-config-table -->

### 主要配置项

| 配置键 | 说明 |
| --- | --- |
| `FUWARI_MENU_INDEX` | 见 config.js |
| `FUWARI_MENU_ARCHIVE` | 见 config.js |
| `FUWARI_MENU_CATEGORY` | 见 config.js |
| `FUWARI_MENU_TAG` | 见 config.js |
| `FUWARI_MENU_SEARCH` | 见 config.js |
| `FUWARI_POST_LIST_COVER` | 见 config.js |
| `FUWARI_POST_LIST_COVER_DEFAULT` | 见 config.js |
| `FUWARI_POST_LIST_COVER_HOVER_ENLARGE` | 见 config.js |
| `FUWARI_POST_LIST_SUMMARY` | 见 config.js |
| `FUWARI_POST_LIST_TAG` | 见 config.js |
| `FUWARI_POST_LIST_COVER_COL_WIDTH` | 见 config.js |
| `FUWARI_MOBILE_MENU` | 见 config.js |
| `FUWARI_HERO_ENABLE` | 见 config.js |
| `FUWARI_HERO_BG_IMAGE` | 见 config.js |
| `FUWARI_HERO_CREDIT_TEXT` | 见 config.js |
| `FUWARI_HERO_CREDIT_LINK` | 见 config.js |
| `FUWARI_WIDGET_NOTICE` | 见 config.js |
| `FUWARI_WIDGET_LATEST_POSTS` | 见 config.js |
| `FUWARI_WIDGET_CATEGORY_LIST` | 见 config.js |
| `FUWARI_WIDGET_TAG_LIST` | 见 config.js |
| `FUWARI_PROFILE_PATH` | 见 config.js |
| `FUWARI_WIDGET_CONTACT` | 见 config.js |
| `FUWARI_WIDGET_AD` | 见 config.js |
| `FUWARI_WIDGET_WWADS` | 见 config.js |
| `FUWARI_WIDGET_ADSENSE` | 见 config.js |
| `FUWARI_WIDGET_PLUGIN_AREA` | 见 config.js |
| `FUWARI_WIDGET_ANALYTICS` | 见 config.js |
| `FUWARI_WIDGET_THEME_COLOR_SWITCHER` | 见 config.js |
| `FUWARI_THEME_COLOR_HUE` | 见 config.js |
| `FUWARI_THEME_COLOR_FIXED` | 见 config.js |
| `FUWARI_WIDGET_TO_COMMENT` | 见 config.js |
| `FUWARI_WIDGET_DARK_MODE` | 见 config.js |
| `FUWARI_ARTICLE_TOC` | 见 config.js |
| `FUWARI_CONTACT_TITLE` | 见 config.js |
| `FUWARI_CONTACT_DESCRIPTION` | 见 config.js |
| `FUWARI_CONTACT_FRONT_BADGE` | 见 config.js |
| `FUWARI_CONTACT_URL` | 见 config.js |
| `FUWARI_CONTACT_TEXT` | 见 config.js |
| `FUWARI_CONTACT_FLIP_CARD` | 见 config.js |
| `FUWARI_CONTACT_BACK_TITLE` | 见 config.js |

共 **50** 项，上表列出前 40 项，完整列表见 [config.js](https://github.com/notionnext-org/NotionNext/blob/main/themes/fuwari/config.js)。

<!-- /theme-config-table -->

## 相关

- [内置主题全览](./THEMES_CATALOG.md)
- [如何配置站点](../config-site.md)
- [菜单 Menu / SubMenu](../menu-secondary.md)
