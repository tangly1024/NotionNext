# notion-i18n-translator（中英双数据库自动翻译）

为 NotionNext 博客提供两个语言数据库（中文库与英文库）之间的自动双向翻译。源语言由页面所在数据库决定，无需在每篇文章上额外维护 `lang` 字段。

默认语言对：**`zh-CN` ↔ `en-US`**。已在 DeepSeek（V3+）与 GLM-4 上验证通过。翻译提供方接口很小（`{ text, sourceLang, targetLang, glossary, hint } → { text, inputTokens, outputTokens }`），可在 `providers/` 下扩展其他模型。

## 工作原理

1. 维护两个 Notion 数据库，每个对应一种语言。它们分别填入 `blog.config.js` 的 `NOTION_PAGE_ID`（多语言形式 `id1,en:id2`）。
2. 翻译时，脚本从源数据库读取页面，将每个可翻译块送入大模型，并在另一语言的数据库中创建或更新对应的「孪生页面」。
3. 通过两端页面上的 `paired_with` 文本属性记录配对关系（双向 UUID）。目标页面同时记录源内容的 SHA-256（`source_hash`），未变化时跳过翻译，幂等可重入。
4. 代码块、公式、嵌入、文件、链接、书签等会原样保留。Mermaid / PlantUML 代码块例外：仅翻译其中可见的标签文本，严格保留语法结构。
5. 已人工修改过的目标页面，可勾选 `translation_locked` 锁定，后续即使源页面发生漂移也不会被覆盖。

## 数据库 schema 要求

请在**两个数据库中**分别新增以下属性（名称需保持一致）：

| 属性 | 类型 | 用途 |
|---|---|---|
| `paired_with` | Text | 对端语言数据库中孪生页面的 UUID |
| `translation_locked` | Checkbox | 勾选后，重新同步时不覆盖该页面 |
| `source_hash` | Text | 源页面可翻译内容的 SHA-256，由脚本写入 |

NotionNext 已有的属性（`title`、`slug`、`status`、`type`、`category`、`tags`、`date`、`summary`、`icon`、`password`）会被读取使用，但不会被翻译脚本修改。

## 配置

翻译脚本从项目根目录的 `.env.local`（已被 gitignore，与 Next.js 应用读取的是同一份）中读取配置；不再在 `scripts/` 下保留独立 env 文件。所有变量已写入根目录 `.env.example` 的 `notion-i18n-translator` 段落。

```bash
# 1. 在已有的 .env.local 末尾追加翻译相关变量
cat >> .env.local <<'EOF'
NOTION_TOKEN=secret_xxx
NOTION_DB_EN_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_DB_ZH_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxx
EOF

# 2. 安装依赖（脚本仅新增 @notionhq/client，作为 devDependency）
yarn install
```

请到 <https://www.notion.so/my-integrations> 创建一个 Notion 集成，然后**将两个数据库都与该集成连接**（在每个数据库页面右上角 `•••` → Connections → Add connections，选择刚创建的集成）。

随后可运行诊断检查权限是否到位：

```bash
yarn translate:diagnose
```

## 用法

```bash
# 翻译单个页面（自动从源数据库定位到对端数据库）
yarn translate <页面 id 或 URL>

# 批量翻译两库中所有 Published 状态、尚未配对的文章
yarn translate:all

# 限制源语言
yarn translate:all --from zh-CN          # 仅中→英
yarn translate:all --from en-US          # 仅英→中

# 包含 Draft
yarn translate:all --include-drafts

# 强制重新翻译已配对的页面（用于内容漂移修复）
yarn translate:all --include-paired --force

# 交互式将已有的人工翻译进行配对（不调用翻译 API，免费）
yarn translate:backfill

# 检查与上次同步相比已发生漂移的页面
yarn translate:check

# 即使 source_hash 一致也强制重译
yarn translate <页面 id> --force

# 干跑：只打印将要进行的操作和目标位置，不调用翻译 API、不写入 Notion
yarn translate:all --dry-run
```

## 翻译提供方

通过 `.env.local` 中的 `TRANSLATOR_PROVIDER` 切换，默认 `deepseek`。

| 提供方 | 模型环境变量 | 默认值 | 价格（约） |
|---|---|---|---|
| `deepseek` | `DEEPSEEK_MODEL` | `deepseek-chat` | $0.27/M 输入，$1.10/M 输出 |
| `glm` | `GLM_MODEL` | `glm-4-plus` | 以官网为准 |

`deepseek-chat` 是平台级别名，会自动指向当前最新对话模型；如手动指定具体版本（如 `deepseek-v3`）后返回 404，可改回 `deepseek-chat`。

## 并发、预算与重试

| 环境变量 | 默认值 | 说明 |
|---|---|---|
| `TRANSLATOR_CONCURRENCY` | `8` | 单页面内块翻译的并发度（瓶颈在 LLM，不在 Notion） |
| `TRANSLATOR_BUDGET_TOKENS_PER_RUN` | `500000` | 单次运行的硬性 token 上限，超出立即抛错终止 |

所有 Notion API 调用统一封装了指数退避重试（429 / 5xx / 超时），偶发的 502 不会中断长批量任务。

## 词表与分类映射

- `glossary.json` — 翻译时原样保留的术语列表（如 `Notion`、`LLM`、`React`），可按需追加。
- `category-map.json` — `category`（select）与 `tags`（multi-select）属性的双向映射；未登记的值在写入目标库时会被跳过并在控制台警告，因此初次使用可以保持空映射。

## 成本与耗时

一篇 1500 字的博客大约 5K 输入 + 10K 输出 token，使用 DeepSeek 约 **$0.02 一篇**。并发 8 时，~30 块的页面约 60–90 秒完成。

## 块处理规则

| 块类型 | 行为 |
|---|---|
| `paragraph`、`heading_1/2/3`、`bulleted_list_item`、`numbered_list_item`、`quote`、`callout`、`toggle`、`to_do` | 翻译 rich_text；保留加粗/斜体/链接等格式注释 |
| `code`（mermaid / plantuml） | 仅翻译标签，保留语法 |
| `code`（其他语言）、`equation`、`image`、`video`、`file`、`embed`、`divider`、`table_of_contents`、`bookmark`、`breadcrumb`、`link_preview`、`link_to_page`、`child_page`、`child_database` | 原样保留 |
| `column_list`、`column`、`table`、`table_row`、`synced_block`、`unsupported` | 跳过 — Notion 创建接口要求这些块在 body 中携带子节点，而扁平拉取无法包含嵌套子节点 |

## 文件结构

```
scripts/translate/
  index.js              CLI 入口（yarn translate / translate:all 等）
  pipeline.js           主流程：读取 → 比对哈希 → 翻译 → 写入 → 双向链接
  config.js             语言↔数据库 解析、分类/标签映射工具函数
  notion-client.js      封装 @notionhq/client，附带重试逻辑
  block-mapper.js       按块类型的翻译与字段净化
  state.js              SHA-256 与块类型分类集合
  backfill.js           交互式跨库配对工具
  diagnose.js           列出集成可访问的所有数据库，定位权限问题
  glossary.json         不翻译术语清单
  category-map.json     select / multi_select 双向映射
  load-env.js           零依赖 .env 加载器（读取项目根目录 .env.local / .env）
  providers/
    index.js            提供方选择器（按 TRANSLATOR_PROVIDER）
    deepseek.js         DeepSeek（OpenAI 兼容）
    glm.js              智谱 GLM
    _http.js            带超时的 fetch 封装
```
