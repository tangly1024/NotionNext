const readline = require('readline')
const notion = require('./notion-client')
const { envIds, langFromDb } = require('./config')

function tokenize(s) {
  if (!s) return []
  return s
    .toLowerCase()
    // 在拉丁字符与中日韩文字之间插入空格，便于按词切分
    .replace(/([a-z0-9])([一-鿿])/g, '$1 $2')
    .replace(/([一-鿿])([a-z0-9])/g, '$1 $2')
    .split(/[\s\-_/.,!?，。！？]+/u)
    .filter(t => t && t.length >= 2)
}

function similarity(a, b) {
  if (!a || !b) return 0
  if (a.toLowerCase().trim() === b.toLowerCase().trim()) return 1
  const A = new Set(tokenize(a))
  const B = new Set(tokenize(b))
  if (!A.size || !B.size) return 0
  let inter = 0
  for (const t of A) if (B.has(t)) inter++
  const union = A.size + B.size - inter
  return inter / union
}

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans) }))
}

async function loadPosts(dbId) {
  const pages = await notion.queryDatabase(dbId, {
    property: 'type',
    select: { equals: 'Post' }
  })
  return pages.map(p => ({
    id: p.id,
    title: notion.getProp(p, 'title', 'title') || '',
    slug: notion.getProp(p, 'slug', 'rich_text') || '',
    pairedWith: notion.getProp(p, 'paired_with', 'rich_text') || ''
  }))
}

async function runBackfill({ autoYes = false } = {}) {
  const { en, zh } = envIds()
  const enPosts = await loadPosts(en)
  const zhPosts = await loadPosts(zh)
  console.log(`[backfill] 英文库共 ${enPosts.length} 篇，中文库共 ${zhPosts.length} 篇`)

  const matched = new Set()
  let pairs = 0

  for (const z of zhPosts) {
    if (z.pairedWith) continue
    const candidates = enPosts
      .filter(e => !matched.has(e.id) && !e.pairedWith)
      .map(e => ({
        ...e,
        score: Math.max(similarity(z.slug, e.slug), similarity(z.title, e.title))
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    if (!candidates.length) continue

    console.log(`\n[zh] ${z.title}  (slug: ${z.slug || '—'})`)
    candidates.forEach((c, i) => {
      console.log(`  ${i + 1}. [score=${c.score.toFixed(2)}] ${c.title}  (slug: ${c.slug || '—'})`)
    })

    let ans
    if (autoYes) {
      ans = candidates[0].score >= 0.4 ? '1' : 'skip'
    } else {
      ans = (await ask(`选择配对编号？[1-${candidates.length}/n/skip]: `)).trim()
    }
    if (!ans || ans === 'n' || ans === 'skip') continue
    const idx = parseInt(ans, 10) - 1
    if (Number.isNaN(idx) || idx < 0 || idx >= candidates.length) continue
    const chosen = candidates[idx]

    await notion.updatePageProperties(z.id, {
      paired_with: { rich_text: [{ type: 'text', text: { content: chosen.id } }] }
    })
    await notion.updatePageProperties(chosen.id, {
      paired_with: { rich_text: [{ type: 'text', text: { content: z.id } }] }
    })
    matched.add(chosen.id)
    pairs++
    console.log(`  ✓ 已配对 ${z.id.slice(0, 8)} ↔ ${chosen.id.slice(0, 8)}`)
  }

  console.log(`\n[backfill] 完成。共建立 ${pairs} 对配对关系。`)
}

module.exports = { runBackfill }
