const { Client } = require('@notionhq/client')

let _client = null
function client() {
  if (!_client) {
    if (!process.env.NOTION_TOKEN) throw new Error('NOTION_TOKEN 未设置（请检查项目根目录 .env.local）')
    _client = new Client({ auth: process.env.NOTION_TOKEN })
  }
  return _client
}

const TRANSIENT = new Set([429, 500, 502, 503, 504])
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function withRetry(fn, label = 'notion-call', maxAttempts = 4) {
  let attempt = 0
  while (true) {
    attempt++
    try {
      return await fn()
    } catch (err) {
      const status = err.status || err.statusCode
      const transient =
        TRANSIENT.has(status) ||
        /status: (429|5\d\d)/.test(String(err.message || '')) ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'ECONNRESET'
      if (!transient || attempt >= maxAttempts) throw err
      const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000)
      console.warn(`[重试 ${attempt}/${maxAttempts - 1}] ${label}: ${err.message || err}; 等待 ${backoff}ms`)
      await sleep(backoff)
    }
  }
}

function normalizeId(id) {
  const stripped = String(id).replace(/-/g, '')
  if (stripped.length !== 32) throw new Error(`无效的 Notion id: ${id}`)
  return `${stripped.slice(0, 8)}-${stripped.slice(8, 12)}-${stripped.slice(12, 16)}-${stripped.slice(16, 20)}-${stripped.slice(20)}`
}

function extractIdFromInput(input) {
  if (!input) throw new Error('未提供页面 id')
  const match = String(input).match(/[0-9a-fA-F]{32}/) || String(input).match(/[0-9a-fA-F-]{36}/)
  if (!match) throw new Error(`无法从输入中解析 Notion id: ${input}`)
  return normalizeId(match[0])
}

async function fetchPage(pageId) {
  return withRetry(() => client().pages.retrieve({ page_id: pageId }), `fetchPage ${pageId}`)
}

async function fetchAllBlocks(blockId) {
  const blocks = []
  let cursor
  do {
    const res = await withRetry(
      () => client().blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 }),
      `fetchAllBlocks ${blockId}`
    )
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor : null
  } while (cursor)
  return blocks
}

async function queryDatabase(databaseId, filter) {
  const results = []
  let cursor
  do {
    const res = await withRetry(
      () => client().databases.query({ database_id: databaseId, start_cursor: cursor, filter, page_size: 100 }),
      `queryDatabase ${databaseId}`
    )
    results.push(...res.results)
    cursor = res.has_more ? res.next_cursor : null
  } while (cursor)
  return results
}

async function createPage({ parent, properties, children, cover, icon }) {
  return withRetry(() => client().pages.create({ parent, properties, children, cover, icon }), 'createPage')
}

async function updatePageProperties(pageId, properties) {
  return withRetry(() => client().pages.update({ page_id: pageId, properties }), `updatePage ${pageId}`)
}

async function appendBlocks(blockId, children) {
  const CHUNK = 100
  for (let i = 0; i < children.length; i += CHUNK) {
    const slice = children.slice(i, i + CHUNK)
    await withRetry(() => client().blocks.children.append({ block_id: blockId, children: slice }), `appendBlocks ${blockId}`)
  }
}

async function deleteAllChildBlocks(blockId) {
  const existing = await fetchAllBlocks(blockId)
  for (const b of existing) {
    try {
      await withRetry(() => client().blocks.delete({ block_id: b.id }), `deleteBlock ${b.id}`)
    } catch (err) {
      if (!String(err.message || '').includes('archived')) throw err
    }
  }
}

function getProp(page, name, type) {
  const p = page.properties?.[name]
  if (!p) return null
  switch (type) {
    case 'title':
      return (p.title || []).map(rt => rt.plain_text).join('')
    case 'rich_text':
      return (p.rich_text || []).map(rt => rt.plain_text).join('')
    case 'select':
      return p.select?.name || null
    case 'multi_select':
      return (p.multi_select || []).map(s => s.name)
    case 'checkbox':
      return Boolean(p.checkbox)
    case 'date':
      return p.date || null
    default:
      return p
  }
}

module.exports = {
  client,
  normalizeId,
  extractIdFromInput,
  fetchPage,
  fetchAllBlocks,
  queryDatabase,
  createPage,
  updatePageProperties,
  appendBlocks,
  deleteAllChildBlocks,
  getProp
}
