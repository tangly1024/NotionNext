import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import pLimit from 'p-limit'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getBuildSessionPath } from '@/lib/cache/build_session'

const PREFETCH_STALE_LOCK_MS = 5 * 60 * 1000
const PREFETCH_WAIT_TIMEOUT_MS = 15 * 60 * 1000
const PREFETCH_HEARTBEAT_INTERVAL_MS = 15 * 1000
const PREFETCH_WAIT_POLL_MS = 200

function getPrefetchDoneFile() {
  return path.join(getBuildSessionPath('prefetch'), 'block-prefetch.done')
}

function getPrefetchSkippedFile() {
  return path.join(getBuildSessionPath('prefetch'), 'block-prefetch.skipped')
}

function getPrefetchLockFile() {
  return path.join(getBuildSessionPath('prefetch'), 'block-prefetch.lock')
}

function hasMarker(file) {
  try {
    return fs.existsSync(file)
  } catch {
    return false
  }
}

function isDone(doneFile) {
  return hasMarker(doneFile)
}

function isSkipped(skippedFile) {
  return hasMarker(skippedFile)
}

function markDone(doneFile) {
  fs.mkdirSync(path.dirname(doneFile), { recursive: true })
  fs.writeFileSync(doneFile, String(process.pid), 'utf8')
}

function markSkipped(skippedFile, reason) {
  fs.mkdirSync(path.dirname(skippedFile), { recursive: true })
  fs.writeFileSync(
    skippedFile,
    JSON.stringify({ pid: process.pid, reason, at: Date.now() }),
    'utf8'
  )
}

function clearMarker(file) {
  try {
    fs.rmSync(file, { force: true })
  } catch {}
}

function createPrefetchLockPayload() {
  return {
    token: randomUUID(),
    pid: process.pid,
    acquiredAt: Date.now(),
    heartbeatAt: Date.now()
  }
}

function readPrefetchLock(lockFile) {
  try {
    if (!fs.existsSync(lockFile)) {
      return null
    }

    const raw = fs.readFileSync(lockFile, 'utf8').trim()
    if (!raw) {
      return null
    }

    try {
      const payload = JSON.parse(raw)
      if (payload && typeof payload === 'object') {
        return payload
      }
    } catch {}

    const legacyPid = Number(raw)
    if (Number.isInteger(legacyPid) && legacyPid > 0) {
      const stat = fs.statSync(lockFile)
      return {
        token: null,
        pid: legacyPid,
        acquiredAt: stat.mtimeMs,
        heartbeatAt: stat.mtimeMs
      }
    }

    return null
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null
    }
    throw error
  }
}

function writePrefetchLock(lockFile, payload, flag = 'w') {
  fs.mkdirSync(path.dirname(lockFile), { recursive: true })
  fs.writeFileSync(lockFile, JSON.stringify(payload), { flag })
}

function isProcessAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false
  }

  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (error.code === 'EPERM') {
      return true
    }
    if (error.code === 'ESRCH') {
      return false
    }
    return true
  }
}

function maybeCleanupPrefetchStaleLock(lockFile, staleLockMs) {
  try {
    const stat = fs.statSync(lockFile)
    const ageMs = Date.now() - stat.mtimeMs

    if (ageMs < staleLockMs) {
      return false
    }

    const payload = readPrefetchLock(lockFile)
    if (!payload) {
      fs.rmSync(lockFile, { force: true })
      console.warn(
        `[Prefetch][pid:${process.pid}] removed malformed stale lock`
      )
      return true
    }

    if (!isProcessAlive(Number(payload.pid))) {
      fs.rmSync(lockFile, { force: true })
      console.warn(
        `[Prefetch][pid:${process.pid}] removed dead-owner lock owner:${payload.pid}`
      )
      return true
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return true
    }
    console.warn('[Prefetch] failed to inspect lock', error.message)
  }

  return false
}

function tryAcquirePrefetchLock(
  lockFile,
  staleLockMs = PREFETCH_STALE_LOCK_MS
) {
  const payload = createPrefetchLockPayload()

  try {
    writePrefetchLock(lockFile, payload, 'wx')
    return { acquired: true, payload }
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }

    const cleaned = maybeCleanupPrefetchStaleLock(lockFile, staleLockMs)
    return { acquired: false, cleaned }
  }
}

function startPrefetchHeartbeat(lockFile, payload) {
  const timer = setInterval(() => {
    try {
      const current = readPrefetchLock(lockFile)
      if (!current || current.token !== payload.token) {
        return
      }

      current.heartbeatAt = Date.now()
      writePrefetchLock(lockFile, current)
    } catch (error) {
      console.warn('[Prefetch] heartbeat failed', error.message)
    }
  }, PREFETCH_HEARTBEAT_INTERVAL_MS)

  if (typeof timer.unref === 'function') {
    timer.unref()
  }

  return timer
}

function releasePrefetchLock(lockFile, payload) {
  try {
    const current = readPrefetchLock(lockFile)
    if (!current) {
      return
    }

    if (payload?.token && current.token && current.token !== payload.token) {
      console.warn('[Prefetch] skip release because ownership changed')
      return
    }

    fs.unlinkSync(lockFile)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('[Prefetch] release failed', error.message)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForPrefetchTurn(doneFile, skippedFile, lockFile) {
  const deadline = Date.now() + PREFETCH_WAIT_TIMEOUT_MS

  while (Date.now() < deadline) {
    if (isDone(doneFile)) {
      return { done: true }
    }

    const attempt = tryAcquirePrefetchLock(lockFile)
    if (attempt.acquired) {
      return { done: false, payload: attempt.payload }
    }

    if (attempt.cleaned) {
      continue
    }

    if (isSkipped(skippedFile)) {
      return { skipped: true }
    }

    await sleep(PREFETCH_WAIT_POLL_MS)
  }

  console.warn(
    `[Prefetch][pid:${process.pid}] timed out waiting for shared prefetch, skip warming for this worker`
  )
  return { skipped: true }
}

async function runPrefetchAsLockHolder(
  allPages,
  concurrency,
  doneFile,
  skippedFile,
  lockFile,
  payload
) {
  const heartbeat = startPrefetchHeartbeat(lockFile, payload)

  try {
    if (isDone(doneFile)) {
      console.log(`[Prefetch][pid:${process.pid}] reuse warmed cache`)
      return
    }

    // 当前进程已成为新的持锁者，清理旧的 skipped 标记以允许接手预热。
    clearMarker(skippedFile)

    try {
      await doPrefetch(allPages, concurrency)
    } catch (error) {
      markSkipped(skippedFile, `owner-error:${process.pid}:${error.message}`)
      console.warn(
        `[Prefetch][pid:${process.pid}] prefetch aborted, skip warming for this build`,
        error.message
      )
      return
    }

    clearMarker(skippedFile)
    markDone(doneFile)
    console.log(`[Prefetch][pid:${process.pid}] marked done`)
  } finally {
    clearInterval(heartbeat)
    releasePrefetchLock(lockFile, payload)
  }
}

/**
 * 获取优先预生成的页面
 * - 默认排序前 5 篇（Notion 拖拽顺序）
 * - 最新发布 5 篇（按 publishDate 倒序）
 * - 合并去重，适合 ISR 首批路径
 */
export function getPriorityPages(allPages) {
  const published = (allPages ?? []).filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  const top5Default = published.slice(0, 5)
  const top5Latest = [...published]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 5)

  const seen = new Set()
  return [...top5Default, ...top5Latest].filter(page => {
    if (seen.has(page.id)) return false
    seen.add(page.id)
    return true
  })
}

async function doPrefetch(allPages, concurrency = 8) {
  const limit = pLimit(concurrency)
  let hit = 0
  let fetched = 0
  let failed = 0

  console.log(
    `[Prefetch][pid:${process.pid}] start ${allPages.length} page blocks`
  )
  const start = Date.now()

  await Promise.all(
    allPages.map(page =>
      limit(async () => {
        const cacheKey = `page_block_${page.id}`

        if (await getDataFromCache(cacheKey)) {
          hit++
          return
        }

        try {
          const block = await fetchNotionPageBlocks(page.id, 'prefetch')
          await setDataToCache(cacheKey, block, 60 * 60 * 2) // 2小时 (单位:秒)
          fetched++
        } catch (error) {
          console.warn(
            `[Prefetch][pid:${process.pid}] failed page:${page.id}`,
            error.message
          )
          failed++
        }
      })
    )
  )

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(
    `[Prefetch][pid:${process.pid}] done hit=${hit} fetched=${fetched} failed=${failed} elapsed=${elapsed}s`
  )
}

/**
 * 带跨进程保护的全量预热。
 * 同一次 build/export 中只允许一个 worker 真正预热。
 * 其他 worker 优先等待当前构建轮次的 done 标记；
 * 如果 owner 预热失败，会写入 skipped 标记让后续 worker 跳过本轮共享预热。
 * 等待超时只跳过当前 worker，不会写入全局 skipped 标记。
 */
export async function prefetchAllBlockMaps(allPages, concurrency = 8) {
  if (!Array.isArray(allPages) || allPages.length === 0) {
    console.log(`[Prefetch][pid:${process.pid}] skip empty page list`)
    return
  }

  const doneFile = getPrefetchDoneFile()
  const skippedFile = getPrefetchSkippedFile()
  const lockFile = getPrefetchLockFile()
  if (isDone(doneFile)) {
    console.log(`[Prefetch][pid:${process.pid}] reuse warmed cache`)
    return
  }

  const attempt = tryAcquirePrefetchLock(lockFile)
  if (attempt.acquired) {
    await runPrefetchAsLockHolder(
      allPages,
      concurrency,
      doneFile,
      skippedFile,
      lockFile,
      attempt.payload
    )
    return
  }

  if (isSkipped(skippedFile)) {
    console.warn(
      `[Prefetch][pid:${process.pid}] skip shared prefetch for this build`
    )
    return
  }

  console.log(
    `[Prefetch][pid:${process.pid}] waiting for shared prefetch completion`
  )
  const turn = await waitForPrefetchTurn(doneFile, skippedFile, lockFile)

  if (turn.done) {
    console.log(`[Prefetch][pid:${process.pid}] reuse warmed cache`)
    return
  }

  if (turn.skipped) {
    console.warn(
      `[Prefetch][pid:${process.pid}] skip shared prefetch for this build`
    )
    return
  }

  await runPrefetchAsLockHolder(
    allPages,
    concurrency,
    doneFile,
    skippedFile,
    lockFile,
    turn.payload
  )
}
