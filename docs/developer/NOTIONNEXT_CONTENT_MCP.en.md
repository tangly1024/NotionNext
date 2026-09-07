# NotionNext Content MCP: manage your Notion content with AI coding assistants

[中文](./NOTIONNEXT_CONTENT_MCP.md)

## What is this

NotionNext Content MCP is a bundled Model Context Protocol (MCP) server that lets AI coding assistants such as Claude Code, Codex CLI, and Cursor read and write the Notion databases behind your site over a standard protocol.

Instead of editing articles word by word in the Notion web app, hand your prompts, drafts, and materials to an AI assistant. It generates the article following the NotionNext data contract, writes it into your Notion as a draft, and you review and publish from Notion with one click.

Highlights:

- **Zero dependencies**: implemented with the Node.js standard library only; if `node` runs, this runs
- **Review-first**: every AI write lands as an `Invisible` draft; publishing always requires human confirmation in Notion
- **Write contract**: structured data goes to first-class properties, body content to page blocks, covers to the native Page Cover. Writing the legacy `ext` field is rejected at the schema and runtime level, so the Notion editing experience and the NotionNext render pipeline stay intact
- **Scoped authorization**: the AI can only touch data sources registered via environment variables, and the Notion token is never exposed to the model or logs

## Quick start

### 1. Environment variables

The server reads `.env.local` / `.env` / `.env.mcp.local` from the project root (or set `NOTIONNEXT_MCP_ENV_FILE`). Minimum:

```env
NOTION_API_TOKEN=            # Notion integration token (create at https://www.notion.so/my-integrations and share your databases with it)
NOTION_PAGE_ID=              # the page / database id your NotionNext site already uses
```

Optional per-type data source ids (unregistered databases are untouchable by default):

```env
NOTION_POSTS_DATA_SOURCE_ID=
NOTION_PAGES_DATA_SOURCE_ID=
NOTION_RECORDS_DATA_SOURCE_ID=
NOTION_EVENTS_DATA_SOURCE_ID=
NOTION_MEMBERS_DATA_SOURCE_ID=
NOTION_CONTENT_DATA_SOURCE_ID=   # generic fallback
```

Optional property-name overrides (defaults match the standard NotionNext template):

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

### 2. Verify

```bash
node tools/notionnext-content-mcp/smoke-test.js
# -> NotionNext content MCP smoke test passed
```

### 3. Connect your assistant

**Claude Code** (from the project root):

```bash
claude mcp add notionnext-content -- node tools/notionnext-content-mcp/server.js
```

**Codex CLI** (`~/.codex/config.toml`):

```toml
[mcp_servers.notionnext-content]
command = "node"
args = ["/absolute/path/to/NotionNext/tools/notionnext-content-mcp/server.js"]
```

**Cursor** (`.cursor/mcp.json` in the project):

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

### 4. Use it

Once connected, just ask:

- "List my recent Notion drafts"
- "Turn these notes into a blog post and save it as a Notion draft — don't publish it"
- "Update the summary and tags of this article"
- "Append a section to the end of this draft"

## Tools

| Tool | Purpose |
| --- | --- |
| `notionnext_status` | Report Notion token / data source configuration status (redacted) |
| `build_notion_draft` | Convert content into a Notion page payload preview (no write) |
| `create_notion_draft` | Create a draft page (defaults to `Invisible`) |
| `inspect_notion_data_source` | Read the schema of an allowed data source |
| `query_notion_pages` | Query pages in allowed data sources (type / status / keyword filters) |
| `get_notion_page` | Read a page's properties and body blocks |
| `update_notion_page` | Update properties, cover, icon |
| `append_notion_blocks` | Convert Markdown to Notion blocks and append to the body |
| `archive_notion_page` | Archive / restore a page |
| `refresh_site_cache` | (Optional) call the site's ops-protected revalidate endpoint so changes appear immediately |

## The NotionNext native write contract (hard rules)

This MCP never treats `ext` as a compatibility layer. Tool schemas and runtime validation reject any `ext` write before any network request is made:

| Content | Correct location |
| --- | --- |
| Title, type, status, slug, summary, category, tags, date | First-class Notion properties |
| Body, sections, lists | Page body blocks |
| Cover, hero image | Native Page Cover (keeps Change / Reposition editing in Notion) |

This guarantees AI-written content remains fully editable in Notion and that what the site renders matches what you see in the database.

## Recommended workflow

1. Generate content with your AI assistant from your own materials
2. `query_notion_pages` for duplicates → `build_notion_draft` to preview the payload
3. `create_notion_draft` to write an `Invisible` draft
4. **Review in Notion**: verify facts, privacy, images
5. Flip `status` to `Published`
6. `refresh_site_cache` (if configured) so the change appears immediately

## Security model

- Only data sources registered via environment variables are reachable; for a trusted local debugging session you may set `NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE=true`
- Page-by-id operations fail closed: a page that does not belong to any data source (e.g. a workspace-level page) is rejected outright, because it cannot be proven to be allow-listed
- The Notion token stays inside the server process; every tool output is redacted
- Drafts default to `Invisible`; the AI cannot publish directly
- `ext` writes are always rejected, preventing uneditable JSON blobs in your database
- `refresh_site_cache` resolves its target URL from environment variables only (never from tool arguments), and derives the ops cookie token from the password with salted scrypt; the raw password never leaves the local process, and the receiving revalidate endpoint must derive the same token

## References

- [Model Context Protocol](https://modelcontextprotocol.io)
- [Notion API - Create a page](https://developers.notion.com/reference/post-page)
