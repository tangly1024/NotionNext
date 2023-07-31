
export default function getAllPageIds (collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  // 优先按照第一个视图排序
  if (viewIds && viewIds.length > 0) {
    const ids = collectionView[viewIds[0]].value.page_sort
    // console.log('PageIds: 从viewId获取', viewIds)
    for (const id of ids) {
      pageIds.push(id)
    }
    // 否则按照数据库原始排序
  } else if (collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }
  return pageIds
}
