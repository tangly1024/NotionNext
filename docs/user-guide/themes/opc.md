# Opc 主题

> 主题 ID：`opc` · 预览：[preview.tangly1024.com/?theme=opc](https://preview.tangly1024.com/?theme=opc)

## 主题预览

![Opc 主题预览](/images/themes-preview/opc.webp)

## 简介

Opc 是面向个人主页、一人公司和独立开发者的入口主题。首页按“本轮任务单 → 流水线轨 → 方向状态 → 长期记录”的顺序组织，把“任务文件 → 产物 → 验收 → 返工”的 AI 生产流水线直接呈现在首屏。

## 主题特性

- **定位**：个人主页 / 一人公司入口。
- **首屏任务单**：右侧卡片按 `目标 / 口径 / 验收` 三行展示当前这一轮的交付要求，取代原来的通用工作流卡片。
- **流水线轨**：`立项 → 拆单 → 执行 → 验收` 四段横轨，每段标注 `ready` / `running` / `review` 阶段状态。
- **主路径**：保留 NotionNext 项目和长期记录两个主要按钮。
- **任务契约**：强调每轮先写任务文件、产物路径和验收标准；执行 AI 一次只领取一个任务，完成后交付文件并结束。
- **验证优先**：先买/接入成熟方案，不能买再复制成熟竞品，最后才自研；没有数据验证前不开发大功能。
- **方向列表**：游戏、小说、短剧、工具产品、流量媒体、AI 企业工作流和量化交易以行式列表呈现，各自带阶段标签，并在标题旁统计在跑方向数。
- **记录段**：首页只展示最新 4 篇公开记录，并给出全部篇数的归档入口。
- **配色配置**：支持浅色和深色基础色变量；自定义颜色后请检查文字与背景的对比度，主题控制台不会自动校验。
- **纹理边界**：网格纹理只铺在首屏色带（自然满幅容器，不使用 `100vw`）并向下淡出，流水线轨及以下所有正文区域是纯色底，文字不会被背景线穿过。
- **信息配置**：支持在主题控制台调整首页主要文案与链接。

## 适用场景

- 独立开发者个人主页
- 一人公司入口页
- AI 任务流水线展示页
- 个人品牌和长期记录入口

## 推荐展示文案

如果你想把 Opc 用作一人公司的公开主页，可以把默认文案改成：

```text
副标题：一人公司的 AI 任务流水线实验室
主介绍：我把 AI 当作能力入口，而不是模拟公司部门开会；用任务文件、产物路径和验收标准，运行内容、产品与交易实验。
任务单-目标：可验收的 AI 生产流水线
任务单-口径：每轮只推进一个最小可验证目标：先买或接入成熟方案，再复制成熟做法，最后才自研；执行 AI 只领取一张任务单，交付文件后结束。
近况说明：所有方向都按 ready、running、review、done 推进，只统计有效产物、验收结果和真实业务数据。
```

## 启用方式

现有 NotionNext 站点可在 Notion Config 表中把 `THEME` 设为 `opc`。也可在部署环境设置 `NEXT_PUBLIC_THEME=opc`，或在 `blog.config.js` 中设置 `THEME`。

主题选择优先级为：URL 查询参数 `?theme=`（预览用）> Notion Config 表 `THEME` > `NEXT_PUBLIC_THEME` / `blog.config.js` 的 `THEME`。如果环境变量切换后仍显示旧主题，请检查 Notion Config 表中的 `THEME`。

首次启用时，顶部名称默认读取站点标题，主标题默认读取作者名（未设置作者名时读取站点标题）；两个主按钮默认跳转到首页的方向列表和公开记录。可以直接使用这些默认值，也可以在 OPC 配置中替换文案和链接。

## 配置说明

配置文件：[themes/opc/config.js](https://github.com/notionnext-org/NotionNext/blob/main/themes/opc/config.js)

也可以在 **Notion Config** 表中填写同名键覆盖默认值。

<!-- theme-config-table -->

### 常用信息配置

| 配置键 | 说明 |
| --- | --- |
| `OPC_NAME` | 顶部名称 |
| `OPC_KICKER` | 首屏标签 |
| `OPC_TITLE` | 主标题 |
| `OPC_SUBTITLE` | 副标题 |
| `OPC_DESCRIPTION` | 主介绍 |
| `OPC_PRIMARY_TEXT` | 主按钮文字 |
| `OPC_PRIMARY_URL` | 主按钮链接 |
| `OPC_SECONDARY_TEXT` | 副按钮文字 |
| `OPC_SECONDARY_URL` | 副按钮链接 |
| `OPC_STATUS_TEXT` | 顶栏状态标签 |
| `OPC_CARD_TITLE` | 任务单-目标 |
| `OPC_CARD_DESCRIPTION` | 任务单-口径 |
| `OPC_NOW_TITLE` | 方向段标题 |
| `OPC_NOW_DESCRIPTION` | 方向段说明 / 任务单-验收 |
| `OPC_NOW_ITEMS` | 方向列表，英文逗号分隔；可按 `名称|阶段|说明` 设置单项 |
| `OPC_METHOD_TITLE` | 方法段标题 |
| `OPC_METHOD_DESCRIPTION` | 方法段说明 |
| `OPC_RECORDS_TITLE` | 记录段标题 |
| `OPC_RECORDS_DESCRIPTION` | 记录段说明 |

### 配色配置

Opc 支持主题控制台调整浅色和深色基础色：

| 配置键 | 说明 |
| --- | --- |
| `OPC_COLOR_PRIMARY` | 浅色主色 |
| `OPC_COLOR_BG` | 浅色页面背景 |
| `OPC_COLOR_CARD` | 浅色卡片背景 |
| `OPC_COLOR_TEXT` | 浅色主文字 |
| `OPC_COLOR_TEXT_SECONDARY` | 浅色次级文字 |
| `OPC_COLOR_BORDER` | 浅色边框 |
| `OPC_COLOR_PRIMARY_DARK` | 深色主色 |
| `OPC_COLOR_BG_DARK` | 深色页面背景 |
| `OPC_COLOR_CARD_DARK` | 深色卡片背景 |
| `OPC_COLOR_TEXT_DARK` | 深色主文字 |
| `OPC_COLOR_TEXT_SECONDARY_DARK` | 深色次级文字 |
| `OPC_COLOR_BORDER_DARK` | 深色边框 |

<!-- /theme-config-table -->

方向阶段支持 `ready`、`running`、`review` 和 `done`。旧格式仍可使用，例如 `游戏,小说`；自定义方向可写成 `个人博客|running|持续发布并观察反馈`。竖线后的阶段和说明可省略，省略时使用默认值。

## 相关

- [内置主题全览](./THEMES_CATALOG.md)
- [如何配置站点](../config-site.md)
