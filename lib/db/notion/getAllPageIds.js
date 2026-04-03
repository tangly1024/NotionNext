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

  // ── 策略2：遍历所有 viewId 的 page_sort 兜底 ──
  if (pageSet.size === 0 && collectionView) {
    Object.values(collectionView).forEach(viewEntry => {
      const pageSort = viewEntry?.value?.value?.page_sort
      if (Array.isArray(pageSort)) {
        pageSort.forEach(id => pageSet.add(id))
      }
    })
    if (pageSet.size > 0) {
      // console.log('[getAllPageIds] 策略2命中 page_sort（遍历），数量:', pageSet.size)
    }
  }

  // ── 策略3：旧格式兼容，从 collectionQuery 取 ──
  if (pageSet.size === 0 && collectionQuery && collectionId) {
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
      if (pageSet.size > 0) {
        // console.log('[getAllPageIds] 策略3命中 collectionQuery（旧格式），数量:', pageSet.size)
      }
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