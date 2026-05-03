const { translateBlock, richTextToString, rebuildRichText } = require('../../../scripts/translate/block-mapper')

const fakeCtx = {
  translateText: async (text, opts) => {
    if (opts?.hint === 'mermaid') return { text: text.replace(/中国/g, 'China') }
    return { text: '[' + text + ']' }
  }
}

describe('translate/block-mapper', () => {
  test('paragraph rich_text gets translated', async () => {
    const block = {
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'hi' },
            annotations: { bold: true },
            plain_text: 'hi'
          }
        ]
      }
    }
    const out = await translateBlock(block, fakeCtx)
    expect(out.paragraph.rich_text[0].text.content).toBe('[hi]')
    expect(out.paragraph.rich_text[0].annotations.bold).toBe(true)
  })

  test('non-mermaid code blocks are preserved verbatim', async () => {
    const block = {
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: 'x = 1' }, plain_text: 'x = 1' }],
        language: 'python'
      }
    }
    const out = await translateBlock(block, fakeCtx)
    expect(out.code.rich_text[0].text.content).toBe('x = 1')
    expect(out.code.language).toBe('python')
  })

  test('mermaid code blocks translate labels with a hint', async () => {
    const block = {
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: 'pie title 国家\n  "中国" : 50' }, plain_text: 'pie title 国家\n  "中国" : 50' }],
        language: 'mermaid'
      }
    }
    const out = await translateBlock(block, fakeCtx)
    expect(out.code.rich_text[0].text.content).toContain('China')
    expect(out.code.language).toBe('mermaid')
  })

  test('column_list returns null (skipped)', async () => {
    const out = await translateBlock({ type: 'column_list', column_list: {} }, fakeCtx)
    expect(out).toBeNull()
  })

  test('image blocks pass through without translation', async () => {
    const block = {
      type: 'image',
      image: { type: 'external', external: { url: 'https://example.com/x.png' } }
    }
    const out = await translateBlock(block, fakeCtx)
    expect(out.type).toBe('image')
    expect(out.image.external.url).toBe('https://example.com/x.png')
  })

  test('rebuildRichText preserves single-segment annotations', () => {
    const original = [
      { type: 'text', text: { content: 'hi' }, annotations: { italic: true }, plain_text: 'hi' }
    ]
    const out = rebuildRichText('你好', original)
    expect(out[0].text.content).toBe('你好')
    expect(out[0].annotations.italic).toBe(true)
  })

  test('richTextToString concatenates all segments', () => {
    const rich = [
      { plain_text: 'foo ' },
      { plain_text: 'bar' }
    ]
    expect(richTextToString(rich)).toBe('foo bar')
  })
})
