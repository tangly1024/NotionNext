const {
  TRANSLATABLE_BLOCK_TYPES,
  COPY_AS_IS_BLOCK_TYPES,
  SKIP_BLOCK_TYPES,
  TRANSLATABLE_CODE_LANGUAGES
} = require('./state')

function richTextToString(rich) {
  if (!Array.isArray(rich)) return ''
  return rich.map(rt => rt.plain_text || '').join('')
}

function rebuildRichText(translated, originalRich) {
  if (!translated) return []
  if (originalRich.length === 1) {
    const rt = originalRich[0]
    return [
      {
        type: 'text',
        text: { content: translated, link: rt.text?.link || null },
        annotations: rt.annotations || {},
        plain_text: translated,
        href: rt.href || null
      }
    ]
  }
  const annotations = originalRich[0]?.annotations || {}
  return [
    {
      type: 'text',
      text: { content: translated, link: null },
      annotations,
      plain_text: translated,
      href: null
    }
  ]
}

function shouldTranslateRichText(rich) {
  if (!Array.isArray(rich) || rich.length === 0) return false
  const text = richTextToString(rich)
  if (!text.trim()) return false
  const allCode = rich.every(rt => rt.annotations?.code)
  return !allCode
}

async function translateBlock(block, ctx) {
  const type = block.type
  const data = block[type]

  if (SKIP_BLOCK_TYPES.has(type)) return null

  // 特殊处理：mermaid / plantuml 代码块同时包含可翻译的标签和严格语法。
  // 整体送入翻译模型并附带语言提示，由模型仅替换文本而保留语法结构。
  if (type === 'code' && data?.language && TRANSLATABLE_CODE_LANGUAGES.has(data.language)) {
    const newData = { ...data }
    if (data.rich_text && shouldTranslateRichText(data.rich_text)) {
      const sourceText = richTextToString(data.rich_text)
      const result = await ctx.translateText(sourceText, { hint: data.language })
      newData.rich_text = rebuildRichText(result.text, data.rich_text)
    }
    return cloneBlockForCreate({ ...block, code: newData })
  }

  if (COPY_AS_IS_BLOCK_TYPES.has(type)) {
    return cloneBlockForCreate(block)
  }

  if (TRANSLATABLE_BLOCK_TYPES.has(type)) {
    const newData = { ...data }
    if (data.rich_text && shouldTranslateRichText(data.rich_text)) {
      const sourceText = richTextToString(data.rich_text)
      const result = await ctx.translateText(sourceText)
      newData.rich_text = rebuildRichText(result.text, data.rich_text)
    }
    if (Array.isArray(data.children) && data.children.length) {
      newData.children = []
      for (const child of data.children) {
        const t = await translateBlock(child, ctx)
        if (t) newData.children.push(t)
      }
    }
    return cloneBlockForCreate({ ...block, [type]: newData })
  }

  return cloneBlockForCreate(block)
}

function cloneBlockForCreate(block) {
  const type = block.type
  if (!type) return null
  const data = block[type]
  if (!data) return { object: 'block', type, [type]: {} }

  const cleaned = stripReadOnly(data)
  return { object: 'block', type, [type]: cleaned }
}

function stripReadOnly(obj) {
  if (Array.isArray(obj)) return obj.map(stripReadOnly).filter(v => v !== undefined)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'plain_text' || k === 'href') continue
      if (v === null || v === undefined) continue // Notion 不接受可选字段为 null，需直接省略
      out[k] = stripReadOnly(v)
    }
    return out
  }
  return obj
}

module.exports = {
  translateBlock,
  richTextToString,
  rebuildRichText,
  shouldTranslateRichText
}
