#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = process.cwd()
const themesDir = path.join(root, 'themes')
const reportDir = path.join(root, '.perf', 'theme-audit')
const rawDir = path.join(reportDir, 'raw')
const docsPerfDir = path.join(root, 'docs', 'performance')
const lighthouseBin = path.join(root, 'node_modules', '.bin', 'lighthouse')
const baseUrl = process.env.THEME_AUDIT_BASE_URL || 'http://localhost:3000'
const includeThemes = (process.env.THEME_AUDIT_THEMES || '')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean)
const chromeFlags =
  '--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu'

function getThemes() {
  const entries = fs.readdirSync(themesDir, { withFileTypes: true })
  const all = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
  if (includeThemes.length === 0) return all
  return all.filter(theme => includeThemes.includes(theme))
}

function runLighthouse(url, outputPath) {
  const args = [
    url,
    '--quiet',
    '--only-categories=performance,seo,best-practices,accessibility',
    '--output=json',
    `--output-path=${outputPath}`,
    `--chrome-flags=${chromeFlags}`,
    '--max-wait-for-load=45000',
    '--throttling-method=simulate'
  ]
  const result = spawnSync(lighthouseBin, args, {
    cwd: root,
    stdio: 'pipe',
    env: process.env
  })
  if (result.status !== 0) {
    const errorText = result.stderr?.toString() || result.stdout?.toString() || ''
    throw new Error(`Lighthouse failed for ${url}\n${errorText}`)
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function toMs(value) {
  if (value == null) return null
  return Math.round(value)
}

function toKb(value) {
  if (value == null) return null
  return Math.round(value / 1024)
}

function getThemeResult(theme, lhr) {
  const audits = lhr.audits || {}
  const categories = lhr.categories || {}
  return {
    theme,
    url: `${baseUrl}/?theme=${theme}`,
    scores: {
      performance: Math.round((categories.performance?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100)
    },
    metrics: {
      lcpMs: toMs(audits['largest-contentful-paint']?.numericValue),
      inpMs: toMs(audits['interaction-to-next-paint']?.numericValue),
      cls: audits['cumulative-layout-shift']?.numericValue ?? null,
      fcpMs: toMs(audits['first-contentful-paint']?.numericValue),
      tbtMs: toMs(audits['total-blocking-time']?.numericValue),
      speedIndexMs: toMs(audits['speed-index']?.numericValue),
      jsKb: toKb(audits['total-byte-weight']?.details?.items?.reduce((sum, i) => {
        if (i.resourceType === 'script') return sum + (i.transferSize || 0)
        return sum
      }, 0)),
      totalKb: toKb(audits['total-byte-weight']?.numericValue)
    }
  }
}

function writeMarkdown(results, reportPath) {
  const sorted = [...results].sort(
    (a, b) => a.scores.performance - b.scores.performance
  )
  const lines = []
  lines.push('# Theme Performance Audit')
  lines.push('')
  lines.push(`Base URL: ${baseUrl}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('| Theme | Perf | SEO | LCP(ms) | INP(ms) | CLS | JS(KB) | Total(KB) |')
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|')
  for (const item of sorted) {
    lines.push(
      `| ${item.theme} | ${item.scores.performance} | ${item.scores.seo} | ${item.metrics.lcpMs ?? '-'} | ${item.metrics.inpMs ?? '-'} | ${item.metrics.cls ?? '-'} | ${item.metrics.jsKb ?? '-'} | ${item.metrics.totalKb ?? '-'} |`
    )
  }
  lines.push('')
  lines.push('## Top Priority Themes')
  const worstPerf = sorted.slice(0, 5)
  for (const item of worstPerf) {
    lines.push(
      `- ${item.theme}: Perf ${item.scores.performance}, LCP ${item.metrics.lcpMs ?? '-'}ms, JS ${item.metrics.jsKb ?? '-'}KB`
    )
  }
  fs.writeFileSync(reportPath, lines.join('\n'))
}

function ensureDirs() {
  fs.mkdirSync(rawDir, { recursive: true })
  fs.mkdirSync(docsPerfDir, { recursive: true })
}

async function main() {
  if (!fs.existsSync(lighthouseBin)) {
    throw new Error('Missing lighthouse binary. Run `yarn install` first.')
  }
  ensureDirs()
  const themes = getThemes()
  if (themes.length === 0) {
    throw new Error('No themes found to audit.')
  }

  const results = []
  for (const theme of themes) {
    const url = `${baseUrl}/?theme=${theme}`
    const out = path.join(rawDir, `${theme}.json`)
    console.log(`Auditing ${theme} -> ${url}`)
    runLighthouse(url, out)
    const lhr = readJson(out)
    results.push(getThemeResult(theme, lhr))
  }

  const summaryPath = path.join(reportDir, 'summary.json')
  const markdownPath = path.join(reportDir, 'summary.md')
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2))
  writeMarkdown(results, markdownPath)

  // 可提交产物：作为主题性能基线与协作规范的一部分
  const trackedJsonPath = path.join(docsPerfDir, 'theme-audit-latest.json')
  const trackedMarkdownPath = path.join(docsPerfDir, 'theme-audit-latest.md')
  fs.writeFileSync(trackedJsonPath, JSON.stringify(results, null, 2))
  writeMarkdown(results, trackedMarkdownPath)

  console.log(
    `\nTheme audit finished. Results: ${path.relative(root, trackedMarkdownPath)}`
  )
}

main().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})
