import { loadExternalResource } from '@/lib/utils'

/**
 * 将搜索结果的关键词高亮
 */
export default async function replaceSearchResult({ doms, search, target }) {
  if (!doms || !search || !target) {
    return
  }

  try {
    await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js', 'js')
    const Mark = window.Mark
    if (doms instanceof HTMLCollection) {
      for (const container of doms) {
        const re = new RegExp(search, 'gim')
        const instance = new Mark(container)
        instance.markRegExp(re, target)
      }
    } else {
      const re = new RegExp(search, 'gim')
      const instance = new Mark(doms)
      instance.markRegExp(re, target)
    }
  } catch (error) {
    console.error('markjs 加载失败', error)
  }
}
