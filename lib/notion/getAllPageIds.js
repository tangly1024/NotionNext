export default function getAllPageIds(collectionQuery, collectionId) {
  if (!collectionQuery || typeof collectionQuery !== 'object') return []

  const ids = new Set()

  const add = (arr) => {
    if (!Array.isArray(arr)) return
    for (const id of arr) {
      if (typeof id === 'string' && id) ids.add(id)
    }
  }

  const collectFromNode = (node) => {
    if (!node || typeof node !== 'object') return

    // direct keys
    add(node.blockIds)
    add(node.block_ids)

    // reducer/result shapes
    const rr = node.reducerResults || node
    add(rr?.collection_group_results?.blockIds)
    add(rr?.collection_group_results?.block_ids)
    add(rr?.results?.blockIds)
    add(rr?.results?.block_ids)
    add(rr?.blockIds)
    add(rr?.block_ids)
  }

  const walk = (node) => {
    if (!node) return

    if (Array.isArray(node)) {
      for (const item of node) walk(item)
      return
    }

    if (typeof node !== 'object') return

    collectFromNode(node)

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

