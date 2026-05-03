const { Client } = require('@notionhq/client')

async function runDiagnose() {
  const token = process.env.NOTION_TOKEN
  const enId = process.env.NOTION_DB_EN_ID
  const zhId = process.env.NOTION_DB_ZH_ID
  if (!token) throw new Error('NOTION_TOKEN 未设置（请检查项目根目录 .env.local）')

  const client = new Client({ auth: token })

  console.log('=== Notion 集成访问诊断 ===')
  console.log(`token 末尾: …${token.slice(-6)}`)
  console.log(`英文库目标: ${enId || '(未设置)'}`)
  console.log(`中文库目标: ${zhId || '(未设置)'}`)
  console.log('')

  try {
    const me = await client.users.me({})
    console.log(`集成身份: ${me.name || '(无名称)'}  (${me.bot?.owner?.type || '?'})`)
    console.log('')
  } catch (err) {
    console.error(`无法读取集成身份: ${err.message}`)
  }

  console.log('正在搜索集成可访问的所有数据库…')
  const dbs = []
  let cursor
  do {
    const res = await client.search({
      start_cursor: cursor,
      page_size: 100,
      filter: { property: 'object', value: 'database' }
    })
    dbs.push(...res.results)
    cursor = res.has_more ? res.next_cursor : null
  } while (cursor)

  if (!dbs.length) {
    console.log('  → 该集成尚未获得任何数据库的访问权限。请先在 Notion 中将两个数据库与该集成连接。')
    return
  }

  const norm = id => String(id || '').replace(/-/g, '').toLowerCase()
  console.log(`可访问数据库 (${dbs.length}):`)
  for (const db of dbs) {
    const title = (db.title || []).map(t => t.plain_text).join('') || '(无标题)'
    const isEn = norm(db.id) === norm(enId)
    const isZh = norm(db.id) === norm(zhId)
    const tag = isEn ? '[EN]' : isZh ? '[ZH]' : '    '
    console.log(`  ${tag}  ${db.id}  ${title}`)
  }
  console.log('')

  const enOk = dbs.some(db => norm(db.id) === norm(enId))
  const zhOk = dbs.some(db => norm(db.id) === norm(zhId))

  if (enOk && zhOk) {
    console.log('✓ 两个数据库均可访问，翻译脚本应能正常运行。')
  } else {
    if (!enOk) console.log(`✗ 英文库 ${enId} 无法访问 — 请在 Notion 中将其与集成连接。`)
    if (!zhOk) console.log(`✗ 中文库 ${zhId} 无法访问 — 请在 Notion 中将其与集成连接。`)
  }
}

module.exports = { runDiagnose }

if (require.main === module) {
  require('./load-env').loadEnv()
  runDiagnose().catch(err => {
    console.error('FATAL:', err.message)
    process.exit(1)
  })
}
