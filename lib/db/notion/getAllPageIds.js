import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds, block = {}) {
  const pageSet = new Set()

  // ── 策略1：从 collectionView[viewId].value.value.page_sort 取（新格式）──
  if (collectionView && viewIds?.length > 0) {
    const groupIndex = BLOG.NOTION_INDEX || 0
    const targetViewId = viewIds[groupIndex]
    const pageSort = collectionView?.[targetViewId]?.value?.value?.page_sort

    if (Array.isArray(pageSort) && pageSort.length > 0) {
      pageSort.forEach(id => pageSet.add(id))
      // console.log('[getAllPageIds] 策略1命中 page_sort，数量:', pageSet.size)
    }
  }

  // ── 策略2：补充所有 view 的 page_sort，避免目标视图 page_sort 不完整 ──
  if (collectionView) {
    Object.values(collectionView).forEach(viewEntry => {
      const pageSort = viewEntry?.value?.value?.page_sort
      if (Array.isArray(pageSort)) {
        pageSort.forEach(id => pageSet.add(id))
      }
    })
  }

  // ── 策略3：始终合并 collectionQuery ──
  // 某些新版 Notion 数据源里，API 新建页会先进入 collectionQuery，
  // 但 page_sort 刷新滞后；如果只在 page_sort 为空时才读 collectionQuery，会漏掉新页。
  if (collectionQuery && collectionId) {
    const viewQuery = collectionQuery?.[collectionId]
    if (viewQuery) {
      Object.values(viewQuery).forEach(viewData => {
        [
          viewData?.collection_group_results?.blockIds,
          viewData?.results?.blockIds,
          viewData?.blockIds,
        ].forEach(ids => {
          if (Array.isArray(ids)) ids.forEach(id => pageSet.add(id))
        })
      })
    }
  }

  if (pageSet.size === 0) {
    // console.warn('[getAllPageIds] 所有策略均未命中，返回空数组')
    return []
  }

  // ── 统一过滤：只保留有权限的 pageId ──
  // const accessibleIds = [...pageSet].filter(id => {
  //   const entry = block[id]
  //   if (!entry) return true // block 里没有记录，保留交给后续 fetch 处理
  //   return entry?.value?.role !== 'none'
  // })

  // console.log(`[getAllPageIds] 过滤后可访问数量: ${accessibleIds.length}／${pageSet.size}`)
  // return accessibleIds
  return [...pageSet]
}