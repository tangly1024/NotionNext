#!/usr/bin/env node

require('./load-env').loadEnv()

const notion = require('./notion-client')
const { translateOnePage, checkDrift, findUntranslated } = require('./pipeline')
const { runBackfill } = require('./backfill')
const { runDiagnose } = require('./diagnose')

function parseArgs(argv) {
  const args = { _: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) {
        args.flags[key] = true
      } else {
        args.flags[key] = next
        i++
      }
    } else {
      args._.push(a)
    }
  }
  return args
}

function help() {
  console.log(`
notion-i18n-translator

跨数据库的中英双向翻译脚本：以页面所在数据库判定源语言，将翻译结果写入另一语言的数据库。

用法：
  yarn translate <页面 id 或 URL>           翻译单个页面（自动从源数据库定位到对端数据库）
  yarn translate:all                        批量翻译两个数据库中尚未配对（paired_with 为空）的 Published 文章
  yarn translate:check                      列出与上次同步相比内容已发生变化的页面
  yarn translate:backfill                   交互式将两个数据库中已有的人工翻译进行配对
  yarn translate:diagnose                   检查 Notion 集成是否能访问到两个目标数据库

参数：
  --dry-run            仅打印将要进行的操作，不调用翻译 API、不写入 Notion
  --force              即使 source_hash 未变也强制重新翻译
  --include-drafts     批量模式下，将 Draft 状态的文章也纳入翻译范围
  --include-paired     批量模式下，将已配对的页面也重新翻译（漂移修复）
  --from <lang>        批量模式下，仅翻译指定来源语言（zh-CN 或 en-US）
  --provider X         覆盖 TRANSLATOR_PROVIDER（deepseek 或 glm）
  --verbose            输出更详细的过程日志
  --yes                非交互模式（backfill 在相似度 ≥ 0.4 时自动选择最佳匹配）
  --help               显示本帮助信息
`)
}

async function main() {
  const argv = process.argv.slice(2)
  const { _: positional, flags } = parseArgs(argv)

  if (flags.help) return help()

  const opts = {
    dryRun: Boolean(flags['dry-run']),
    force: Boolean(flags.force),
    provider: typeof flags.provider === 'string' ? flags.provider : undefined,
    verbose: Boolean(flags.verbose)
  }

  if (flags.batch) {
    const includeDrafts = Boolean(flags['include-drafts'])
    const fromLang = typeof flags.from === 'string' ? flags.from : null
    const includePaired = Boolean(flags['include-paired'])
    const { eligible, skipped } = await findUntranslated({ includeDrafts, fromLang, includePaired })
    console.log(`[batch] 共扫描两个数据库下 ${skipped.total} 篇 Post`)
    console.log(`  ${eligible.length} 篇待翻译`)
    console.log(`  ${skipped.alreadyPaired} 篇已配对（如需重译，运行 yarn translate:check 检查漂移）`)
    if (!includeDrafts) {
      console.log(`  ${skipped.notPublished} 篇非 Published（如需包含草稿，加上 --include-drafts）`)
    }
    if (!eligible.length) {
      console.log('\n无需处理。')
      return
    }
    for (const item of eligible) {
      try {
        await translateOnePage(item.page.id, opts)
      } catch (err) {
        console.error(`[err] ${item.page.id}: ${err.message}`)
      }
    }
    return
  }

  if (flags['check-drift']) {
    const drifted = await checkDrift()
    if (!drifted.length) {
      console.log('[check] 未检测到内容漂移')
    } else {
      console.log(`[check] 共 ${drifted.length} 篇页面的源内容已发生变化:`)
      for (const d of drifted) {
        console.log(`  ${d.pageId}  [${d.lang}]  ${d.title}`)
      }
    }
    return
  }

  if (flags.backfill) {
    return runBackfill({ autoYes: Boolean(flags.yes) })
  }

  if (flags.diagnose) {
    return runDiagnose()
  }

  if (!positional.length) {
    help()
    process.exit(1)
  }

  const pageId = notion.extractIdFromInput(positional[0])
  await translateOnePage(pageId, opts)
}

main().catch(err => {
  console.error('FATAL:', err.message || err)
  if (process.env.DEBUG) console.error(err.stack)
  process.exit(1)
})
