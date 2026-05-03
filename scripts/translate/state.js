const crypto = require('crypto')

function sha256OfBlocks(blocks) {
  const normalized = blocks.map(normalizeForHash).filter(Boolean)
  const hash = crypto.createHash('sha256')
  hash.update(JSON.stringify(normalized))
  return hash.digest('hex')
}

function normalizeForHash(block) {
  const type = block.type
  const data = block[type]
  if (!data) return { type }
  if (data.rich_text) {
    return {
      type,
      text: data.rich_text.map(rt => rt.plain_text || '').join('')
    }
  }
  if (type === 'code') {
    return { type, text: (data.rich_text || []).map(rt => rt.plain_text).join(''), language: data.language }
  }
  if (type === 'image' || type === 'video' || type === 'file') {
    const file = data.file || data.external
    return { type, url: file?.url || '' }
  }
  return { type }
}

const TRANSLATABLE_BLOCK_TYPES = new Set([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'bulleted_list_item',
  'numbered_list_item',
  'quote',
  'callout',
  'toggle',
  'to_do'
])

// 此白名单内的代码块（按 language 字段判断）虽然属于代码，但其内容中
// 含有需要翻译的可读文本（如图表标签、节点说明），翻译时仅替换文字，
// 严格保留语法结构。不在此列表中的代码块统一原样保留。
const TRANSLATABLE_CODE_LANGUAGES = new Set(['mermaid', 'plantuml'])

const COPY_AS_IS_BLOCK_TYPES = new Set([
  'code',
  'equation',
  'image',
  'video',
  'file',
  'pdf',
  'embed',
  'divider',
  'table_of_contents',
  'bookmark',
  'breadcrumb',
  'link_preview',
  'link_to_page',
  'child_page',
  'child_database'
])

// 这些块类型在创建时必须携带 children 字段，但我们采用扁平方式获取
// 块列表，不包含嵌套子节点。直接丢弃以避免提交无效请求；页面其余内容
// 不受影响。（多列布局、表格、同步块在博客文章中较少使用。）
const SKIP_BLOCK_TYPES = new Set([
  'synced_block',
  'column_list',
  'column',
  'table',
  'table_row',
  'unsupported'
])

module.exports = {
  sha256OfBlocks,
  TRANSLATABLE_BLOCK_TYPES,
  COPY_AS_IS_BLOCK_TYPES,
  SKIP_BLOCK_TYPES,
  TRANSLATABLE_CODE_LANGUAGES
}
