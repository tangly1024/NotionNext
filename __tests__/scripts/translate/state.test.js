const {
  sha256OfBlocks,
  TRANSLATABLE_BLOCK_TYPES,
  COPY_AS_IS_BLOCK_TYPES,
  SKIP_BLOCK_TYPES,
  TRANSLATABLE_CODE_LANGUAGES
} = require('../../../scripts/translate/state')

const para = text => ({
  type: 'paragraph',
  paragraph: { rich_text: [{ plain_text: text }] }
})

describe('translate/state', () => {
  test('sha256OfBlocks is deterministic for identical inputs', () => {
    const a = [para('hello world'), { type: 'divider' }]
    const b = [para('hello world'), { type: 'divider' }]
    expect(sha256OfBlocks(a)).toBe(sha256OfBlocks(b))
  })

  test('sha256OfBlocks changes when content changes', () => {
    const a = [para('hello world')]
    const b = [para('hello world!')]
    expect(sha256OfBlocks(a)).not.toBe(sha256OfBlocks(b))
  })

  test('block-type classifications are disjoint', () => {
    for (const t of TRANSLATABLE_BLOCK_TYPES) {
      expect(COPY_AS_IS_BLOCK_TYPES.has(t)).toBe(false)
      expect(SKIP_BLOCK_TYPES.has(t)).toBe(false)
    }
    for (const t of COPY_AS_IS_BLOCK_TYPES) {
      expect(SKIP_BLOCK_TYPES.has(t)).toBe(false)
    }
  })

  test('column_list and table are skipped (require inlined children on create)', () => {
    expect(SKIP_BLOCK_TYPES.has('column_list')).toBe(true)
    expect(SKIP_BLOCK_TYPES.has('table')).toBe(true)
    expect(SKIP_BLOCK_TYPES.has('synced_block')).toBe(true)
  })

  test('mermaid is in TRANSLATABLE_CODE_LANGUAGES', () => {
    expect(TRANSLATABLE_CODE_LANGUAGES.has('mermaid')).toBe(true)
  })
})
