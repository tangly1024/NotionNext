/**
 * 构建前预热脚本
 * 用法：node scripts/prefetch.mjs
 * 在 next build 之前执行，把所有页面 block 写入文件缓存
 */

// 让模块系统识别路径别名 @/
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
register('tsconfig-paths/esm', pathToFileURL('./'))

const start = Date.now()
console.log('\n========================================')
console.log('  [Prefetch] 开始预热所有页面 block')
console.log('========================================\n')

;(async () => {
  const { fetchGlobalAllData } = await import('../lib/db/SiteDataApi.js')
  const { prefetchAllBlockMaps } = await import('../lib/build/prefetch.js')
  try {
    const { allPages } = await fetchGlobalAllData({ from: 'prefetch-script', locale: undefined })
    console.log(`[Prefetch] 共 ${allPages?.length ?? 0} 个页面需要预热\n`)

    await prefetchAllBlockMaps(allPages ?? [])

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log('\n========================================')
    console.log(`  [Prefetch] 预热完成，总耗时 ${elapsed}s`)
    console.log('========================================\n')
  } catch (e) {
    console.error('[Prefetch] 预热失败:', e)
    process.exit(1)
  }
})()