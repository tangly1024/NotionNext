import fs from 'fs'
import path from 'path'

const LOCK_DIR = path.join(process.cwd(), '.next/cache/notion/.locks')

function getLockPath(key) {
  const safe = key.replace(/[^a-z0-9_-]/gi, '_')
  return path.join(LOCK_DIR, `${safe}.lock`)
}

function tryAcquire(lockPath) {
  try {
    fs.mkdirSync(LOCK_DIR, { recursive: true })
    fs.writeFileSync(lockPath, String(process.pid), { flag: 'wx' })
    return true
  } catch {
    return false
  }
}

function release(lockPath) {
  try { fs.unlinkSync(lockPath) } catch {}
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * 带 per-key 文件锁执行
 * 同一 key 同一时刻只有一个 Worker 执行 fn
 * 其他 Worker 等待后重读缓存，不重复发请求
 *
 * @param {string}   key        缓存 key
 * @param {Function} fn         持锁期间执行（负责写缓存并返回数据）
 * @param {Function} readCache  等待锁释放后重读缓存的函数
 * @param {number}   timeout    最长等待 ms，默认 30s
 */
export async function withFileLock(key, fn, readCache, timeout = 30000) {
  const lockPath = getLockPath(key)
  const start = Date.now()

  if (tryAcquire(lockPath)) {
    try {
      return await fn()
    } finally {
      release(lockPath)
    }
  }

  console.log(`[FileLock][pid:${process.pid}] 等待锁释放: ${key}`)

  while (Date.now() - start < timeout) {
    await sleep(200)

    if (!fs.existsSync(lockPath)) {
      const cached = await readCache()
      if (cached) {
        console.log(`[FileLock][pid:${process.pid}] 锁释放后命中缓存: ${key}`)
        return cached
      }
      // 持锁方失败，自己抢锁补救
      if (tryAcquire(lockPath)) {
        try { return await fn() } finally { release(lockPath) }
      }
    }
  }

  console.warn(`[FileLock][pid:${process.pid}] 等待超时，直接执行: ${key}`)
  return fn()
}