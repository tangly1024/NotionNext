import BLOG from '@/blog.config'

/**
 * 条件日志工具
 * 仅在 NEXT_PUBLIC_DEBUG=true 时输出日志
 */

const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true' || BLOG.DEBUG

export const logger = {
  /**
   * 调试日志
   */
  debug: (...args) => {
    if (isDebug) {
      console.debug(...args)
    }
  },

  /**
   * 信息日志
   */
  info: (...args) => {
    if (isDebug) {
      console.info(...args)
    }
  },

  /**
   * 警告日志
   */
  warn: (...args) => {
    console.warn(...args)
  },

  /**
   * 错误日志
   */
  error: (...args) => {
    console.error(...args)
  },

  /**
   * 性能日志
   */
  perf: (...args) => {
    if (isDebug) {
      console.log(...args)
    }
  }
}
