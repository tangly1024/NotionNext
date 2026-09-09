#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')

const serverPath = path.join(__dirname, 'server.js')
// Required in-process (the server guards main() behind require.main) so the
// write-boundary checks can be exercised without network access.
const { assertPageInsideAllowedDataSource } = require(serverPath)

const child = spawn(process.execPath, [serverPath], {
  cwd: path.resolve(__dirname, '../..'),
  stdio: ['pipe', 'pipe', 'pipe']
})

const pending = new Map()
let buffer = ''
let nextId = 1

child.stdout.on('data', chunk => {
  buffer += chunk.toString()
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''

  for (const line of lines) {
    if (!line.trim()) continue
    const message = JSON.parse(line)
    const entry = pending.get(message.id)
    if (!entry) continue
    pending.delete(message.id)
    if (message.error) entry.reject(new Error(message.error.message))
    else entry.resolve(message.result)
  }
})

child.stderr.on('data', chunk => {
  process.stderr.write(chunk)
})

child.on('exit', code => {
  if (code && pending.size > 0) {
    for (const entry of pending.values()) {
      entry.reject(new Error(`server exited with code ${code}`))
    }
    pending.clear()
  }
})

function request(method, params = {}) {
  const id = nextId++
  const payload = { jsonrpc: '2.0', id, method, params }
  const promise = new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
  })
  child.stdin.write(`${JSON.stringify(payload)}\n`)
  return promise
}

async function main() {
  const initialized = await request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'notionnext-content-mcp-smoke', version: '0.1.0' }
  })
  assert(initialized.serverInfo?.name === 'notionnext-content-mcp', 'initialize failed')

  const toolList = await request('tools/list')
  const toolNames = new Set((toolList.tools || []).map(tool => tool.name))
  for (const name of [
    'notionnext_status',
    'build_notion_draft',
    'create_notion_draft',
    'inspect_notion_data_source',
    'query_notion_pages',
    'get_notion_page',
    'update_notion_page',
    'append_notion_blocks',
    'archive_notion_page',
    'refresh_site_cache'
  ]) {
    assert(toolNames.has(name), `missing tool ${name}`)
  }

  for (const name of ['build_notion_draft', 'create_notion_draft']) {
    const tool = (toolList.tools || []).find(item => item.name === name)
    assert(!tool?.inputSchema?.properties?.ext, `${name} must not expose ext`)
    assert(
      /never write ext/i.test(tool?.description || ''),
      `${name} must describe the no-ext contract`
    )
  }

  const status = await request('tools/call', {
    name: 'notionnext_status',
    arguments: {}
  })
  const statusJson = JSON.parse(status.content[0].text)
  assert(statusJson.env, 'status did not return env summary')

  const resourceList = await request('resources/list')
  assert(
    (resourceList.resources || []).some(resource => resource.uri === 'notionnext://schemas/content'),
    'schema resource missing'
  )

  const schemaResource = await request('resources/read', {
    uri: 'notionnext://schemas/content'
  })
  assert(
    schemaResource.contents?.[0]?.text?.includes('NotionNext Notion Content Schema'),
    'schema resource read failed'
  )
  assert(
    /ext is forbidden/i.test(schemaResource.contents?.[0]?.text || ''),
    'schema resource must make ext forbidden'
  )

  const promptList = await request('prompts/list')
  assert(
    (promptList.prompts || []).some(prompt => prompt.name === 'notionnext-draft-payload'),
    'prompt list missing notionnext-draft-payload'
  )

  const notionDraftPrompt = await request('prompts/get', {
    name: 'notionnext-draft-payload',
    arguments: { contentType: 'Record' }
  })
  const promptText = notionDraftPrompt.messages?.[0]?.content?.text || ''
  assert(/never write ext/i.test(promptText), 'draft prompt must forbid ext')
  assert(!/keep ext/i.test(promptText), 'draft prompt must not encourage ext')

  await assertRejects(
    request('tools/call', {
      name: 'build_notion_draft',
      arguments: {
        contentType: 'Record',
        title: 'Legacy ext must fail',
        ext: { recordType: 'story', outcomes: ['must become body blocks'] }
      }
    }),
    /never write ext/i,
    'build_notion_draft must reject ext at runtime'
  )

  await assertRejects(
    request('tools/call', {
      name: 'build_notion_draft',
      arguments: {
        contentType: 'Member',
        title: 'Nested legacy ext must fail',
        member: { role: '成员', ext: { legacy: true } }
      }
    }),
    /never write ext/i,
    'build_notion_draft must reject nested ext at runtime'
  )

  await assertRejects(
    request('tools/call', {
      name: 'update_notion_page',
      arguments: {
        pageId: '00000000-0000-0000-0000-000000000000',
        contentType: 'Record',
        fields: { EXT: '{"recordType":"story"}' }
      }
    }),
    /never write ext/i,
    'update_notion_page must reject ext before calling Notion'
  )

  const draft = await request('tools/call', {
    name: 'build_notion_draft',
    arguments: {
      contentType: 'Post',
      title: 'NotionNext MCP Smoke Test',
      summary: 'Protocol-layer draft preview.',
      tags: ['mcp', 'notionnext'],
      bodyMarkdown: '# Hello\n\nThis is a dry-run draft.\n\n- It should not write to Notion.'
    }
  })
  const draftJson = JSON.parse(draft.content[0].text)
  assert(draftJson.writesToNotion === false, 'draft preview should be dry-run')
  assert(draftJson.childrenCount >= 2, 'markdown was not converted into blocks')

  const recordDraft = await request('tools/call', {
    name: 'build_notion_draft',
    arguments: {
      contentType: 'Record',
      title: 'NotionNext-native Record',
      category: 'story',
      date: '2025-01-01',
      record: {
        location: '长沙',
        related_event_slug: 'example-event'
      },
      bodyMarkdown: '## 社区现在\n\n- 310+ 核心社群\n- 2000+ 累计触达'
    }
  })
  const recordJson = JSON.parse(recordDraft.content[0].text)
  assert(recordJson.propertiesPreview.location === '长沙', 'Record location must be first-class')
  assert(
    recordJson.propertiesPreview.related_event_slug === 'example-event',
    'Record relation must be first-class'
  )
  assert(!('ext' in recordJson.propertiesPreview), 'draft preview must never contain ext')
  assert(recordJson.childrenCount >= 3, 'Record outcomes must be Notion body blocks')

  // Write-boundary checks (no network, no Notion token needed).
  process.env.NOTION_CONTENT_DATA_SOURCE_ID = 'smoke-allowed-data-source'
  const allowListedPage = { parent: { data_source_id: 'smoke-allowed-data-source' } }
  assertPageInsideAllowedDataSource(allowListedPage) // allow-listed parent passes

  try {
    assertPageInsideAllowedDataSource({ parent: { data_source_id: 'unregistered-id' } })
    throw new Error('unregistered data source must be rejected')
  } catch (error) {
    assert(/allow-list/i.test(error.message), `unexpected boundary error: ${error.message}`)
  }

  try {
    assertPageInsideAllowedDataSource({ parent: { workspace: true } })
    throw new Error('page outside any data source must be rejected')
  } catch (error) {
    assert(
      /does not belong to a data source/i.test(error.message),
      `unexpected fail-closed error: ${error.message}`
    )
  }
  delete process.env.NOTION_CONTENT_DATA_SOURCE_ID

  child.stdin.end()
  child.kill()

  console.log('NotionNext content MCP smoke test passed.')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function assertRejects(promise, pattern, message) {
  try {
    await promise
  } catch (error) {
    if (pattern.test(error.message)) return
    throw new Error(`${message}: unexpected error: ${error.message}`)
  }
  throw new Error(`${message}: request unexpectedly succeeded`)
}

main().catch(error => {
  child.kill()
  console.error(error.message)
  process.exit(1)
})
