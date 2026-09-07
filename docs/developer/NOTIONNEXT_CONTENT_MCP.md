# NotionNext Content MCP：用 AI 编码助手直接管理你的 Notion 内容

[English](./NOTIONNEXT_CONTENT_MCP.en.md)

## 这是什么

NotionNext Content MCP 是一个内置的 Model Context Protocol（MCP）服务器，让 Claude Code、Codex CLI、Cursor 等 AI 编码助手通过标准协议直接读写你站点背后的 Notion 数据库。

你不再需要在 Notion 网页里逐字编辑文章：把提示词、草稿、素材交给 AI 助手，它会按照 NotionNext 的数据契约生成文章并写入你的 Notion 草稿箱，你在 Notion 里审核后一键发布，站点自动呈现。

特点：

- **零依赖**：纯 Node.js 标准库实现，`node` 可用即可运行，无需安装任何包
- **审核优先**：所有 AI 写入默认 `Invisible` 草稿，公开发布必须由人在 Notion 中确认
- **写入契约**：结构化信息写独立属性、正文写页面 blocks、封面写原生 Page Cover，全面禁止写入 `ext` 兼容字段，保证你在 Notion 中的编辑体验与 NotionNext 渲染链路完全一致
- **授权边界**：AI 只能操作环境变量中登记过的 data source，Notion token 永远不会输出给模型或日志

## 快速开始

### 1. 准备环境变量

MCP 服务器会自动读取项目根目录的 `.env.local` / `.env` / `.env.mcp.local`（也可用 `NOTIONNEXT_MCP_ENV_FILE` 指定任意路径）。最少需要：

```env
NOTION_API_TOKEN=            # Notion Integration Token（https://www.notion.so/my-integrations 创建，Internal Integration 并授权给你的数据库）
NOTION_PAGE_ID=              # NotionNext 站点已使用的页面 / 数据库 ID
```

可选：为不同内容类型登记专属 data source（未登记时 AI 无法触碰对应库，这是默认安全边界）：

```env
NOTION_POSTS_DATA_SOURCE_ID=
NOTION_PAGES_DATA_SOURCE_ID=
NOTION_RECORDS_DATA_SOURCE_ID=
NOTION_EVENTS_DATA_SOURCE_ID=
NOTION_MEMBERS_DATA_SOURCE_ID=
NOTION_CONTENT_DATA_SOURCE_ID=   # 通用兜底
```

可选：属性名映射（默认与 NotionNext 标准模板一致，一般无需配置）：

```env
NOTION_CONTENT_PROP_TITLE=title
NOTION_CONTENT_PROP_TYPE=type
NOTION_CONTENT_PROP_STATUS=status
NOTION_CONTENT_PROP_SLUG=slug
NOTION_CONTENT_PROP_SUMMARY=summary
NOTION_CONTENT_PROP_CATEGORY=category
NOTION_CONTENT_PROP_TAGS=tags
NOTION_CONTENT_PROP_DATE=date
```

### 2. 验证安装

```bash
node tools/notionnext-content-mcp/smoke-test.js
# 输出 NotionNext content MCP smoke test passed 即协议层就绪
```

### 3. 连接你的 AI 助手

**Claude Code**（在项目根目录执行）：

```bash
claude mcp add notionnext-content -- node tools/notionnext-content-mcp/server.js
```

**Codex CLI**（编辑 `~/.codex/config.toml`）：

```toml
[mcp_servers.notionnext-content]
command = "node"
args = ["/绝对路径/NotionNext/tools/notionnext-content-mcp/server.js"]
```

**Cursor**（编辑项目下 `.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "notionnext-content": {
      "command": "node",
      "args": ["tools/notionnext-content-mcp/server.js"]
    }
  }
}
```

### 4. 开始使用

连上之后，你可以直接对 AI 助手说：

- 「查一下我的 Notion 里最近有哪些草稿」
- 「根据这段素材写一篇博客，生成 Notion 草稿，先不要发布」
- 「把这篇文章的摘要和标签更新一下」
- 「在这篇草稿末尾追加一段」

## 内置工具

| 工具 | 作用 |
| --- | --- |
| `notionnext_status` | 检查 Notion token、data source 配置状态（脱敏输出，不暴露 token） |
| `build_notion_draft` | 把内容转换成 Notion 页面 payload 预览，不写入 |
| `create_notion_draft` | 创建 `Invisible` 草稿页面（默认审核优先） |
| `inspect_notion_data_source` | 读取已授权 data source 的 schema（属性名、类型） |
| `query_notion_pages` | 查询已授权 data source 中的页面（按类型 / 状态 / 关键词过滤） |
| `get_notion_page` | 读取单个页面属性与正文 blocks |
| `update_notion_page` | 更新属性、cover、icon（改状态、摘要、slug、标签等） |
| `append_notion_blocks` | 把 Markdown 转成 Notion blocks 追加到正文 |
| `archive_notion_page` | 归档 / 恢复页面 |
| `refresh_site_cache` | （可选）调用站点 ops 鉴权的缓存刷新接口，写入后让前台立即可见 |

## NotionNext 原生写入契约（硬规则）

这个 MCP 不把 `ext` 当兼容层。工具 schema 与运行时校验会在任何网络请求前拒绝任意层级的 `ext` 写入：

| 内容 | 正确位置 |
| --- | --- |
| 标题、类型、状态、slug、摘要、分类、标签、日期 | 对应的 Notion 独立属性 |
| 正文、章节、列表 | 页面正文 blocks |
| 封面、主视觉 | 原生 Page Cover（保留 Notion 中 Change / Reposition 编辑体验） |

这样保证：AI 写入的内容在 Notion 中完全可编辑，前台读取的字段与后台一一对应。

## 推荐工作流

1. AI 生成内容（基于你的素材、提示词）
2. `query_notion_pages` 查重 → `build_notion_draft` 预览 payload
3. `create_notion_draft` 写入 `Invisible` 草稿
4. **你在 Notion 中审核**：核对事实、隐私授权、补图
5. 把 `status` 改为 `Published`
6. `refresh_site_cache`（如已配置），前台立即可见

## 安全模型

- 默认只能读写环境变量登记过的 data source；临时调试可设 `NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE=true`（仅限本地可信环境）
- 按 pageId 操作时执行 fail-closed 校验：页面不属于任何 data source（如 workspace 顶层页面）时直接拒绝，因为无法证明它在白名单内
- Notion token 只在服务端进程内使用，任何工具输出均脱敏
- 默认草稿状态 `Invisible`，AI 无法直接公开发布内容
- 所有写入禁止 `ext`，防止不可编辑的 JSON 富文本进入你的数据库
- `refresh_site_cache` 的目标地址只能来自环境变量（不接受工具参数覆盖），ops cookie 令牌由密码经 scrypt 加盐派生，密码本体不离开本地进程；接收端 revalidate 接口需按相同方式派生校验

## 参考

- [Model Context Protocol](https://modelcontextprotocol.io)
- [Notion API - Create a page](https://developers.notion.com/reference/post-page)
