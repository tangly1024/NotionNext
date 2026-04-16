import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0) {
      const ids =
        collectionQuery?.[collectionId]?.[viewIds[groupIndex]]?.collection_group_results?.blockIds ||
        collectionQuery?.[collectionId]?.[viewIds[groupIndex]]?.blockIds ||
        collectionView?.[viewIds[groupIndex]]?.value?.page_sort ||
        []
      if (ids) {
        for (const id of ids) {
          pageIds.push(id)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching page IDs:', {
      collectionId,
      viewIds,
      hasCollectionQuery: !!collectionQuery
    }, error)
    return []
  }

  // 否则按照数据库原始排序
  if (pageIds.length === 0 && collectionQuery && collectionId && collectionQuery[collectionId]) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }

  // 新版 Notion 可能不给 collection_query，但会在 collection_view.value.page_sort 里保留顺序
  if (pageIds.length === 0 && collectionView) {
    const pageSet = new Set()
    const preferredViewId = viewIds?.[BLOG.NOTION_INDEX || 0]
    if (preferredViewId) {
      collectionView?.[preferredViewId]?.value?.page_sort?.forEach(id => pageSet.add(id))
    }

    Object.values(collectionView).forEach(view => {
      view?.value?.page_sort?.forEach(id => pageSet.add(id))
    })

    pageIds = [...pageSet]
  }
  return pageIds
}
