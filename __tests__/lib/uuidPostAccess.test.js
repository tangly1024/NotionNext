/** @jest-environment node */
import { resolveUuidPostAccess } from '@/lib/server/postAccess'
import notionAPI from '@/lib/db/notion/getNotionAPI'

jest.mock('@/lib/db/notion/getNotionAPI', () => ({
  __esModule: true,
  default: { getBlocks: jest.fn(), __call: jest.fn() }
}))

const child = '11111111-1111-1111-1111-111111111111'
const middle = '22222222-2222-2222-2222-222222222222'
const ancestor = '33333333-3333-3333-3333-333333333333'
const space = '44444444-4444-4444-4444-444444444444'
const catalog = [
  { id: ancestor, password: 'protected-hash', status: 'Published' }
]
const page = parent => ({
  id: child,
  blockMap: {
    block: {
      [child]: {
        value: {
          id: child,
          space_id: space,
          parent_id: parent,
          parent_table: 'block'
        }
      }
    }
  }
})

it('inherits protection across a missing parent record without mutating the original blockMap', async () => {
  const post = page(middle)
  notionAPI.getBlocks.mockResolvedValueOnce({
    recordMap: {
      block: {
        [middle]: {
          value: {
            value: {
              id: middle,
              space_id: space,
              parent_id: ancestor,
              parent_table: 'block'
            }
          }
        }
      }
    }
  })
  expect(await resolveUuidPostAccess(post, catalog)).toEqual({
    allowed: true,
    ancestor: catalog[0]
  })
  expect(notionAPI.getBlocks).toHaveBeenCalledWith([middle])
  expect(post.blockMap.block[middle]).toBeUndefined()
})

it('follows a nested collection to a published catalog page', async () => {
  const post = page(middle)
  post.blockMap.block[child].value.parent_table = 'collection'
  notionAPI.__call.mockResolvedValueOnce({
    recordMap: {
      collection: {
        [middle]: {
          value: { id: middle, parent_id: ancestor, parent_table: 'block' }
        }
      }
    }
  })
  expect((await resolveUuidPostAccess(post, catalog)).ancestor).toBe(catalog[0])
  expect(notionAPI.__call).toHaveBeenCalledWith('fetch', {
    endpoint: 'syncRecordValuesMain',
    body: { requests: [{ id: middle, table: 'collection', version: -1 }] }
  })
})

it.each(['Published', 'Invisible'])('allows a %s catalog descendant when ids use different UUID formats', async status => {
  const publicCatalog = [
    { id: ancestor.replaceAll('-', '').toUpperCase(), status }
  ]
  expect(await resolveUuidPostAccess(page(ancestor), publicCatalog)).toEqual({
    allowed: true,
    ancestor: publicCatalog[0]
  })
  expect(notionAPI.getBlocks).not.toHaveBeenCalled()
})

it('does not expose an unlisted sibling merely because a token can read its workspace', async () => {
  const post = page(space)
  post.blockMap.block[child].value.parent_table = 'space'
  expect(await resolveUuidPostAccess(post, catalog)).toEqual({ allowed: false })
  expect(notionAPI.getBlocks).not.toHaveBeenCalled()
})

it.each(['Draft', 'Archived', undefined])('rejects a descendant of a non-public catalog page (%s)', async status => {
  expect(
    (
      await resolveUuidPostAccess(page(ancestor), [
        { id: ancestor, status }
      ])
    ).allowed
  ).toBe(false)
})

it.each(['missing', 'deleted', 'cycle', 'foreign-space', 'foreign-id'])(
  'rejects %s ancestor evidence',
  async kind => {
    const record = {
      id: middle,
      space_id: space,
      parent_id: ancestor,
      parent_table: 'block'
    }
    if (kind === 'deleted') record.alive = false
    if (kind === 'cycle') record.parent_id = child
    if (kind === 'foreign-space')
      record.space_id = '55555555-5555-5555-5555-555555555555'
    if (kind === 'foreign-id') record.id = ancestor
    notionAPI.getBlocks.mockResolvedValueOnce({
      recordMap: {
        block: kind === 'missing' ? {} : { [middle]: { value: record } }
      }
    })
    expect((await resolveUuidPostAccess(page(middle), catalog)).allowed).toBe(
      false
    )
  }
)

it('bounds long ancestor chains', async () => {
  const post = page('00000000000000000000000000000001')
  notionAPI.getBlocks.mockImplementation(([id]) => ({
    recordMap: {
      block: {
        [id]: {
          value: {
            id,
            parent_id: (BigInt(`0x${id}`) + 1n).toString(16).padStart(32, '0'),
            parent_table: 'block'
          }
        }
      }
    }
  }))
  expect((await resolveUuidPostAccess(post, catalog)).allowed).toBe(false)
  expect(notionAPI.getBlocks.mock.calls.length).toBeLessThanOrEqual(63)
})
