export const normalizePostId = value =>
  String(value || '')
    .replace(/-/g, '')
    .toLowerCase()

/** Keep the existing truthy password flag without publishing a password hash. */
export function redactPost(post) {
  if (!post || typeof post !== 'object' || !post.password) return post
  const summary = { ...post }
  for (const key of [
    'blockMap',
    'content',
    'toc',
    'results',
    'wordCount',
    'readTime',
    'originalityProof'
  ])
    delete summary[key]
  return { ...summary, password: 'protected' }
}

export function redactSiteData(data) {
  for (const key of [
    'allPages',
    'latestPosts',
    'allNavPages',
    'allLinkPages',
    'allMembers',
    'allEvents',
    'customNav',
    'customMenu'
  ]) {
    if (Array.isArray(data[key])) data[key] = data[key].map(redactPost)
  }
  if (data.notice) data.notice = redactPost(data.notice)
  return data
}

/** A public article must not serialize a protected page nested in its recordMap. */
export function redactProtectedBlocks(post, allPages) {
  const blocks = post.blockMap?.block || {}
  const allowedRoot = normalizePostId(post.id)
  const denied = new Set(
    allPages
      .filter(
        page =>
          page.password && normalizePostId(page.id) !== normalizePostId(post.id)
      )
      .map(page => normalizePostId(page.id))
  )
  let changed = true
  while (changed) {
    changed = false
    for (const [id, entry] of Object.entries(blocks)) {
      const value = entry?.value?.value || entry?.value || entry
      if (
        normalizePostId(id) !== allowedRoot &&
        !denied.has(normalizePostId(id)) &&
        denied.has(normalizePostId(value?.parent_id))
      ) {
        denied.add(normalizePostId(id))
        changed = true
      }
      if (denied.has(normalizePostId(id))) {
        for (const child of value?.content || []) {
          if (normalizePostId(child) !== allowedRoot && !denied.has(normalizePostId(child))) {
            denied.add(normalizePostId(child))
            changed = true
          }
        }
      }
    }
  }
  for (const id of Object.keys(post.blockMap?.signed_urls || {})) {
    if (denied.has(normalizePostId(id))) delete post.blockMap.signed_urls[id]
  }
  for (const [id, entry] of Object.entries(blocks)) {
    if (denied.has(normalizePostId(id))) {
      delete blocks[id]
      if (post.blockMap.signed_urls) delete post.blockMap.signed_urls[id]
    } else if (entry?.value?.content) {
      entry.value.content = entry.value.content.filter(
        child => !denied.has(normalizePostId(child))
      )
    }
  }
  const root = Object.entries(blocks).find(
    ([id]) => normalizePostId(id) === normalizePostId(post.id)
  )?.[1]?.value
  // A database page's properties may contain the original Notion password column.
  if (root?.properties)
    root.properties = { title: root.properties.title || [[post.title || '']] }
}

/** Clone cached records before filtering them for a public response or index. */
export function getPublicPostBlockMap(post, blockMap, allPages = []) {
  if (!blockMap || post?.password) return { block: {} }
  const publicPost = { ...post, blockMap: JSON.parse(JSON.stringify(blockMap)) }
  redactProtectedBlocks(publicPost, allPages)
  return publicPost.blockMap
}
