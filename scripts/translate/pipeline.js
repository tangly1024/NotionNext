const path = require('path')
const fs = require('fs')
const pLimit = require('p-limit').default || require('p-limit')

const notion = require('./notion-client')
const { sha256OfBlocks } = require('./state')
const { translateBlock } = require('./block-mapper')
const { getProvider } = require('./providers')
const { envIds, langFromDb, dbForLang, flipLang, mapSelect, mapMultiSelect } = require('./config')

const GLOSSARY = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'glossary.json'), 'utf8')
)

function buildBudget() {
  const cap = parseInt(process.env.TRANSLATOR_BUDGET_TOKENS_PER_RUN || '500000', 10)
  let usedIn = 0
  let usedOut = 0
  return {
    add(inT, outT) {
      usedIn += inT
      usedOut += outT
      if (usedIn + usedOut > cap) {
        throw new Error(`Token 预算超限: ${usedIn}+${usedOut}=${usedIn + usedOut} > ${cap}`)
      }
    },
    summary() {
      return { input: usedIn, output: usedOut }
    }
  }
}

async function translateOnePage(pageId, opts = {}) {
  const dryRun = Boolean(opts.dryRun)
  const force = Boolean(opts.force)
  const verbose = Boolean(opts.verbose)
  const log = verbose ? console.log : () => {}

  const provider = getProvider(opts.provider)
  const budget = buildBudget()

  log(`[fetch] page ${pageId}`)
  const page = await notion.fetchPage(pageId)
  const sourceDbId = page.parent?.database_id
  if (!sourceDbId) throw new Error(`页面 ${pageId} 不属于任何数据库`)
  const sourceLang = langFromDb(sourceDbId)
  if (!sourceLang) {
    throw new Error(`页面 ${pageId} 所在数据库 ${sourceDbId} 既不是 NOTION_DB_EN_ID 也不是 NOTION_DB_ZH_ID`)
  }
  const targetLang = flipLang(sourceLang)
  const targetDbId = dbForLang(targetLang)

  const blocks = await notion.fetchAllBlocks(pageId)
  const sourceTitle = notion.getProp(page, 'title', 'title') || ''
  const sourceSummary = notion.getProp(page, 'summary', 'rich_text') || ''
  const sourceSlug = notion.getProp(page, 'slug', 'rich_text') || ''
  const sourceCategory = notion.getProp(page, 'category', 'select')
  const sourceTags = notion.getProp(page, 'tags', 'multi_select') || []
  const pairedWith = notion.getProp(page, 'paired_with', 'rich_text') || ''
  const status = notion.getProp(page, 'status', 'select') || 'Draft'
  const type = notion.getProp(page, 'type', 'select') || 'Post'
  const date = notion.getProp(page, 'date', 'date')

  const currentHash = sha256OfBlocks(blocks)
  log(`[hash] ${currentHash.slice(0, 12)}…  (${sourceLang} → ${targetLang})`)

  let targetPageId = pairedWith || null
  let targetExisting = null
  if (targetPageId) {
    try {
      targetExisting = await notion.fetchPage(targetPageId)
    } catch {
      log(`[warn] 配对页面 ${targetPageId} 无法读取，将创建新页面`)
      targetPageId = null
    }
  }

  if (targetExisting && !force) {
    const targetSourceHash = notion.getProp(targetExisting, 'source_hash', 'rich_text') || ''
    if (targetSourceHash === currentHash) {
      console.log(`[skip] ${pageId} — 目标 ${targetPageId} 已是最新`)
      return { skipped: true }
    }
    if (notion.getProp(targetExisting, 'translation_locked', 'checkbox')) {
      console.log(`[skip] ${pageId} — 目标 ${targetPageId} 已锁定（translation_locked）`)
      return { skipped: true, locked: true }
    }
  }

  async function translateText(text, opts = {}) {
    if (!text || !text.trim()) return { text }
    if (dryRun) return { text } // dry-run 模式下不调用翻译 API
    const result = await provider.translate({
      text,
      sourceLang,
      targetLang,
      glossary: GLOSSARY,
      hint: opts.hint
    })
    budget.add(result.inputTokens || 0, result.outputTokens || 0)
    return result
  }

  if (dryRun) {
    const blockCount = blocks.length
    console.log(`[dry-run] ${pageId} (${sourceLang} → ${targetLang})`)
    console.log(`  title:  ${sourceTitle}`)
    console.log(`  blocks: ${blockCount}`)
    console.log(`  target: ${targetPageId ? `update ${targetPageId}` : `create in DB ${targetDbId}`}`)
    return { dryRun: true, blocks: blockCount }
  }

  const translatedTitle = sourceTitle.trim()
    ? (await translateText(sourceTitle)).text
    : sourceTitle
  const translatedSummary = sourceSummary.trim()
    ? (await translateText(sourceSummary)).text
    : sourceSummary

  log(`[translate] title="${translatedTitle.slice(0, 60)}"`)

  const concurrency = parseInt(process.env.TRANSLATOR_CONCURRENCY || '5', 10)
  const limit = pLimit(concurrency)
  const t0 = Date.now()
  const translated = await Promise.all(
    blocks.map(b => limit(() => translateBlock(b, { translateText })))
  )
  const newBlocks = translated.filter(Boolean)
  log(`[translate] ${newBlocks.length} 个块, 用时 ${((Date.now() - t0) / 1000).toFixed(1)}s (并发=${concurrency})`)

  const mappedCategory = mapSelect('category', sourceCategory, sourceLang)
  const mappedTagsResult = mapMultiSelect('tags', sourceTags, sourceLang)
  const mappedTags = mappedTagsResult.mapped || []
  if (mappedTagsResult.dropped?.length) {
    log(`[warn] 以下标签缺少映射，已跳过: ${mappedTagsResult.dropped.join(', ')}`)
  }
  if (sourceCategory && !mappedCategory) {
    log(`[warn] 分类缺少映射，已跳过: ${sourceCategory}`)
  }

  const props = {
    title: { title: [{ type: 'text', text: { content: translatedTitle } }] },
    summary: { rich_text: [{ type: 'text', text: { content: translatedSummary } }] },
    paired_with: { rich_text: [{ type: 'text', text: { content: pageId } }] },
    source_hash: { rich_text: [{ type: 'text', text: { content: currentHash } }] },
    type: { select: { name: type } },
    status: { select: { name: status } }
  }
  if (mappedCategory) props.category = { select: { name: mappedCategory } }
  if (mappedTags.length) props.tags = { multi_select: mappedTags.map(name => ({ name })) }
  if (sourceSlug) props.slug = { rich_text: [{ type: 'text', text: { content: sourceSlug } }] }
  if (date && date.start) {
    props.date = { date: { start: date.start, end: date.end || null } }
  }

  // Notion 创建页面时不接受内部托管的文件作为封面或图标，只允许 external
  // URL 或 emoji；file 与 file_upload 类型直接忽略。
  const safeCover = page.cover?.type === 'external' ? page.cover : undefined
  const safeIcon =
    page.icon?.type === 'emoji' || page.icon?.type === 'external'
      ? page.icon
      : undefined

  if (targetPageId) {
    log(`[update] 更新目标页面 ${targetPageId}`)
    await notion.deleteAllChildBlocks(targetPageId)
    await notion.appendBlocks(targetPageId, newBlocks)
    await notion.updatePageProperties(targetPageId, props)
  } else {
    log(`[create] 在数据库 ${targetDbId} 中新建目标页面`)
    const created = await notion.createPage({
      parent: { database_id: targetDbId },
      properties: props,
      children: newBlocks.slice(0, 100),
      cover: safeCover,
      icon: safeIcon
    })
    targetPageId = created.id
    if (newBlocks.length > 100) {
      await notion.appendBlocks(targetPageId, newBlocks.slice(100))
    }
  }

  await notion.updatePageProperties(pageId, {
    paired_with: { rich_text: [{ type: 'text', text: { content: targetPageId } }] },
    source_hash: { rich_text: [{ type: 'text', text: { content: currentHash } }] }
  })

  console.log(`[ok] ${pageId} → ${targetPageId}  耗用=${JSON.stringify(budget.summary())}`)
  return { ok: true, targetPageId, budget: budget.summary() }
}

async function checkDrift() {
  const { en, zh } = envIds()
  const drifted = []
  for (const dbId of [en, zh]) {
    const pages = await notion.queryDatabase(dbId, {
      and: [
        { property: 'type', select: { equals: 'Post' } },
        { property: 'paired_with', rich_text: { is_not_empty: true } }
      ]
    })
    for (const page of pages) {
      const storedHash = notion.getProp(page, 'source_hash', 'rich_text')
      const blocks = await notion.fetchAllBlocks(page.id)
      const currentHash = sha256OfBlocks(blocks)
      if (currentHash !== storedHash) {
        drifted.push({
          pageId: page.id,
          title: notion.getProp(page, 'title', 'title'),
          lang: langFromDb(dbId)
        })
      }
    }
  }
  return drifted
}

async function findUntranslated({ includeDrafts = false, fromLang = null, includePaired = false } = {}) {
  const { en, zh } = envIds()
  const skipped = { alreadyPaired: 0, notPublished: 0, wrongLang: 0, total: 0 }
  const eligible = []

  const dbsToScan = []
  if (!fromLang || fromLang === 'en-US') dbsToScan.push(en)
  if (!fromLang || fromLang === 'zh-CN') dbsToScan.push(zh)

  for (const dbId of dbsToScan) {
    const pages = await notion.queryDatabase(dbId, {
      property: 'type',
      select: { equals: 'Post' }
    })
    for (const p of pages) {
      skipped.total++
      const paired = notion.getProp(p, 'paired_with', 'rich_text')
      const status = notion.getProp(p, 'status', 'select')
      if (paired && !includePaired) { skipped.alreadyPaired++; continue }
      if (!includeDrafts && status !== 'Published') { skipped.notPublished++; continue }
      eligible.push({ page: p, sourceLang: langFromDb(dbId) })
    }
  }
  return { eligible, skipped }
}

module.exports = { translateOnePage, checkDrift, findUntranslated }
