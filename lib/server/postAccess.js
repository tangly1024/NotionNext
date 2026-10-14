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

/**
 * getPage only fills missing descendants, not the complete ancestor chain.
 * Follow server-supplied parent pointers, loading missing records as needed.
 * Called only after fetchPageFromNotion has verified workspace membership.
 */
export async function resolveUuidPostAccess(post, allPages) {
  const pages = new Map(allPages.map(page => [normalizePostId(page.id), page]))
  const records = new Map()
  const addRecords = recordMap => {
    for (const table of ['block', 'collection']) {
      for (const [id, entry] of Object.entries(recordMap?.[table] || {})) {
        records.set(
          `${table}:${normalizePostId(id)}`,
          entry?.value?.value || entry?.value || entry
        )
      }
    }
  }
  addRecords(post?.blockMap)
  const root = records.get(`block:${normalizePostId(post?.id)}`)
  const spaceId = normalizePostId(root?.space_id)
  let id = post?.id
  let table = 'block'
  const visited = new Set()
  // Bound both corrupted/cyclic chains and requests for deeply nested pages.
  while (id && visited.size < 64) {
    const normalizedId = normalizePostId(id)
    if (!/^[a-f0-9]{32}$/.test(normalizedId)) break
    const key = `${table}:${normalizedId}`
    if (visited.has(key)) break
    visited.add(key)
    if (table === 'block' && pages.has(normalizedId)) {
      const ancestor = pages.get(normalizedId)
      return {
        allowed: ['Published', 'Invisible'].includes(ancestor.status),
        ancestor
      }
    }
    // The client may carry a Notion token. Same-workspace siblings are not
    // necessarily public; only a published (including unlisted) catalog
    // ancestor grants access. Its password requirement is inherited below.
    if (!['block', 'collection'].includes(table)) break
    if (!records.has(key)) {
      const { default: notionAPI } =
        await import('@/lib/db/notion/getNotionAPI')
      const result =
        table === 'block'
          ? await notionAPI.getBlocks([id])
          : await notionAPI.__call('fetch', {
              endpoint: 'syncRecordValuesMain',
              body: { requests: [{ id, table, version: -1 }] }
            })
      addRecords(result?.recordMap)
    }
    const record = records.get(key)
    if (!record || record.alive === false) break
    if (record.id && normalizePostId(record.id) !== normalizedId) break
    if (
      spaceId &&
      record.space_id &&
      normalizePostId(record.space_id) !== spaceId
    )
      break
    id =
      record.parent_id || record.parent?.page_id || record.parent?.database_id
    table =
      record.parent_table ||
      (record.parent?.database_id ? 'collection' : 'block')
  }
  return { allowed: false }
}
