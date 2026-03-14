export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery || typeof collectionQuery !== 'object') return []

  const ids = new Set()

  const add = (arr) => {
    if (!Array.isArray(arr)) return
    for (const id of arr) {
      if (typeof id === 'string' && id) ids.add(id)
    }
  }

  const walk = (node) => {
    if (!node) return

    if (Array.isArray(node)) {
      for (const item of node) walk(item)
      return
    }

    if (typeof node !== 'object') return

    add(node.blockIds)
    add(node.block_ids)

    if (node.collection_group_results) {
      add(node.collection_group_results.blockIds)
      add(node.collection_group_results.block_ids)
    }

    if (node.results) {
      walk(node.results)
    }

    for (const key of Object.keys(node)) {
      walk(node[key])
    }
  }

  if (collectionId && collectionQuery[collectionId]) {
    walk(collectionQuery[collectionId])
  } else {
    walk(collectionQuery)
  }

  return [...ids]
}
