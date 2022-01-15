import { idToUuid } from 'notion-utils'

export default function getAllPageIds (collectionQuery, viewId) {
  if (!collectionQuery) {
    return []
  }
  const views = Object.values(collectionQuery)[0]
  if (!views) {
    return []
  }
  let pageIds = []
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds
  } else {
    const pageSet = new Set()
    Object.values(views).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
  }
  return pageIds
}
