#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')

const rootDir = process.cwd()
const reportDir = path.join(rootDir, '.perf')
const reportPath = path.join(reportDir, 'baseline.json')
const mode = process.argv.includes('--mode=compare') ? 'compare' : 'baseline'
const runBuild = !process.argv.includes('--skip-build')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let idx = 0
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024
    idx++
  }
  return `${value.toFixed(2)} ${units[idx]}`
}

function listFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFilesRecursively(absolutePath)
    return [absolutePath]
  })
}

function sumFileSizes(files) {
  return files.reduce((sum, file) => sum + fs.statSync(file).size, 0)
}

function getBuildArtifactStats() {
  const staticDir = path.join(rootDir, '.next', 'static')
  const serverDir = path.join(rootDir, '.next', 'server')
  const staticFiles = listFilesRecursively(staticDir)
  const serverFiles = listFilesRecursively(serverDir)
  return {
    staticAssetBytes: sumFileSizes(staticFiles),
    serverAssetBytes: sumFileSizes(serverFiles),
    staticAssetFiles: staticFiles.length,
    serverAssetFiles: serverFiles.length
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) return resolve()
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

function readRuntimeMetrics() {
  const summary = {
    source: 'lighthouse',
    lcpMs: null,
    inpMs: null,
    cls: null,
    note: 'Run `yarn perf:lighthouse` first to populate runtime metrics.'
  }
  const lhciDir = path.join(rootDir, '.lighthouseci')
  if (!fs.existsSync(lhciDir)) return summary

  const lhrFiles = listFilesRecursively(lhciDir).filter(file =>
    file.endsWith('.report.json')
  )
  if (lhrFiles.length === 0) return summary

  const latest = lhrFiles
    .map(file => ({ file, mtime: fs.statSync(file).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].file

  const report = JSON.parse(fs.readFileSync(latest, 'utf8'))
  summary.lcpMs = report.audits?.['largest-contentful-paint']?.numericValue ?? null
  summary.inpMs = report.audits?.['interaction-to-next-paint']?.numericValue ?? null
  summary.cls = report.audits?.['cumulative-layout-shift']?.numericValue ?? null
  summary.note = `Parsed from ${path.relative(rootDir, latest)}`
  return summary
}

function printDiff(previous, current) {
  if (!previous) {
    console.log('\nNo previous baseline found. Created initial baseline only.\n')
    return
  }
  const deltaBuild = current.build.durationMs - previous.build.durationMs
  const deltaStatic =
    current.build.staticAssetBytes - previous.build.staticAssetBytes
  const deltaServer =
    current.build.serverAssetBytes - previous.build.serverAssetBytes
  console.log('\nPerformance delta (current - previous):')
  console.log(`- Build time: ${deltaBuild} ms`)
  console.log(`- Static assets: ${formatBytes(deltaStatic)}`)
  console.log(`- Server assets: ${formatBytes(deltaServer)}`)
}

async function main() {
  fs.mkdirSync(reportDir, { recursive: true })
  const previous = fs.existsSync(reportPath)
    ? JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    : null

  const result = {
    generatedAt: new Date().toISOString(),
    mode,
    dev: {
      coldStartMs: null,
      firstCompileMs: null,
      hmrMs: null,
      note:
        'Use local terminal timing for `yarn dev` + first page compile/HMR and fill into this report when needed.'
    },
    build: {
      durationMs: null,
      staticAssetBytes: 0,
      serverAssetBytes: 0,
      staticAssetFiles: 0,
      serverAssetFiles: 0
    },
    runtime: readRuntimeMetrics()
  }

  if (runBuild) {
    const start = Date.now()
    await run('yarn', ['build'])
    result.build.durationMs = Date.now() - start
    Object.assign(result.build, getBuildArtifactStats())
  }

  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2))
  console.log('\nSaved performance baseline report:', path.relative(rootDir, reportPath))
  if (result.build.durationMs != null) {
    console.log(`- Build duration: ${result.build.durationMs} ms`)
    console.log(`- Static assets: ${formatBytes(result.build.staticAssetBytes)}`)
    console.log(`- Server assets: ${formatBytes(result.build.serverAssetBytes)}`)
  }
  printDiff(previous, result)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
