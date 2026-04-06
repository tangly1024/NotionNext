
// lib/build/staticPaths.js
import { fetchGlobalAllData } from '@/lib/db/notion'
import { prefetchAllBlockMaps } from '@/lib/build/prefetch'
import { isExport } from '../utils/buildMode'

let _prefetchDone = false // 模块级标记，同一构建进程只预热一次

export async function getStaticPathsBase(filterFn) {
  if (!isExport()) {
    return { paths: [], fallback: 'blocking' }
  }

  const { allPages } = await fetchGlobalAllData({ from: 'static-paths' })

  // 只在第一个调用的路由文件里执行预热
  if (!_prefetchDone) {
    _prefetchDone = true
    // 预热全部，但优先处理最新5篇
    await prefetchAllBlockMaps(allPages)
  }

  return {
    paths: allPages.filter(filterFn).map(pageToParams),
    fallback: false
  }
}

// 把最新5篇单独导出，供各路由文件复用
export async function getLatestSlugs(allPages, count = 5) {
  return [...allPages]
    .filter(p => p.type === 'Post' && p.status === 'Published')
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, count)
}

// 把最新5篇单独导出，供各路由文件复用
export async function getLatestSlugs(allPages, count = 5) {
  return [...allPages]
    .filter(p => p.type === 'Post' && p.status === 'Published')
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, count)
}