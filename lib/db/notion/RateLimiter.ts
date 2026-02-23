import fs from 'fs'
import path from 'path'

interface QueueItem<T> {
  requestFunc: () => Promise<T>
  resolve: (value: T) => void
  reject: (err: any) => void
}

export class RateLimiter {
  private queue: QueueItem<any>[] = []
  private inflight = new Set<string>()
  private isProcessing = false
  private lastRequestTime = 0
  private requestCount = 0
  private windowStart = Date.now()

  constructor(
    private maxRequestsPerMinute = 200,
    private lockFilePath?: string
  ) { }

  private async acquireLock() {
    if (!this.lockFilePath) return
    // 如果锁文件存在且创建时间过久（比如 >5分钟），认为是陈旧锁，直接删除
    if (fs.existsSync(this.lockFilePath)) {
      const stats = fs.statSync(this.lockFilePath)
      const age = Date.now() - stats.ctimeMs
      if (age > 30 * 1000) { // 30秒
        try {
          fs.unlinkSync(this.lockFilePath)
          console.warn('[限流] 删除陈旧锁文件:', this.lockFilePath)
        } catch (err) {
          console.error('[限流] 删除陈旧锁失败:', err)
        }
      }
    }
    while (true) {
      try {
        fs.writeFileSync(this.lockFilePath, process.pid.toString(), { flag: 'wx' })
        return
      } catch (err: any) {
        if (err.code === 'EEXIST') await new Promise(res => setTimeout(res, 100))
        else throw err
      }
    }
  }

  private releaseLock() {
    if (!this.lockFilePath) return
    try { if (fs.existsSync(this.lockFilePath)) fs.unlinkSync(this.lockFilePath) }
    catch (err) { console.error('释放锁失败', err) }
  }

  public enqueue<T>(key: string, requestFunc: () => Promise<T>): Promise<T> {
    if (this.inflight.has(key)) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (!this.inflight.has(key)) {
            clearInterval(interval)
            this.enqueue(key, requestFunc).then(resolve).catch(reject)
          }
        }, 50)
      })
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ requestFunc, resolve, reject })
      if (!this.isProcessing) this.processQueue()
    })
  }

  private async processQueue() {
    if (this.queue.length === 0) { this.isProcessing = false; return }
    this.isProcessing = true

    try {
      await this.acquireLock()
      const now = Date.now()
      const elapsed = now - this.windowStart

      if (elapsed > 60_000) { this.requestCount = 0; this.windowStart = now }
      if (this.requestCount >= this.maxRequestsPerMinute) {
        const waitTime = 60_000 - elapsed + 100
        await new Promise(res => setTimeout(res, waitTime))
        this.requestCount = 0
        this.windowStart = Date.now()
      }

      const minInterval = 300
      const waitTime = Math.max(0, minInterval - (now - this.lastRequestTime))
      if (waitTime > 0) await new Promise(res => setTimeout(res, waitTime))

      const { requestFunc, resolve, reject } = this.queue.shift()!
      const key = crypto.randomUUID()
      this.inflight.add(key)

      try {
        const result = await requestFunc()
        this.lastRequestTime = Date.now()
        this.requestCount++
        resolve(result)
      } catch (err) { reject(err) }
      finally { this.inflight.delete(key) }

    } catch (err) {
      console.error('限流队列异常', err)
    } finally {
      this.releaseLock()
      setTimeout(() => this.processQueue(), 0)
    }
  }
}
