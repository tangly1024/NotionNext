import { createHash, timingSafeEqual } from 'node:crypto'

import { normalizePostId } from '@/lib/utils/publicPost'
export { normalizePostId, redactProtectedBlocks } from '@/lib/utils/publicPost'

/** Password hashes stay on the server, including legacy md5(slug + password). */
export function verifyPostPassword(post, password) {
  if (
    !post?.password ||
    typeof password !== 'string' ||
    password.length > 1024
  ) {
    return false
  }
  const expected = String(post.password).trim().toLowerCase()
  const algorithm = /^[a-f0-9]{64}$/.test(expected)
    ? 'sha256'
    : /^[a-f0-9]{32}$/.test(expected)
      ? 'md5'
      : null
  if (!algorithm) return false
  const input =
    algorithm === 'md5' ? String(post.slug || '') + password : password
  const actual = createHash(algorithm).update(input).digest()
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'))
}

/** Unknown UUID pages must inherit access from a catalogued ancestor. */
export function findCatalogAncestor(post, allPages) {
  const pages = new Map(allPages.map(page => [normalizePostId(page.id), page]))
  const blocks = new Map(
    Object.entries(post?.blockMap?.block || {}).map(([id, entry]) => [
      normalizePostId(id),
      entry?.value?.value || entry?.value || entry
    ])
  )
  let id = normalizePostId(post?.id)
  const visited = new Set()
  while (id && !visited.has(id)) {
    if (pages.has(id)) return pages.get(id)
    visited.add(id)
    const block = blocks.get(id)
    id = normalizePostId(block?.parent_id || block?.parent?.page_id)
  }
  return null
}

