/**
 * 获取属性值，优先从 overrides 中读取，否则按顺序从 properties 中读取，最后返回默认值
 * @param {Object} properties 原始属性对象
 * @param {Array} keys 优先级字段名列表
 * @param {Object} overrides 自定义覆盖对象（可选）
 * @param {string} defaultValue 默认值（可选）
 */
function getPropertyValue(properties, keys, overrides = {}, defaultValue = '') {
  for (const key of keys) {
    if (overrides[key]) return overrides[key]
    if (properties[key]) return properties[key]
  }
  return defaultValue
}

/**
 * 提取 Notion 装饰文本的纯文本内容。
 * 可选传入 resolveRef 来解析引用（例如 '‣' 指向的页面标题）
 *
 * @param {Array} text - Notion Decoration[] 格式的文本数组
 * @returns {string}
 */
function getFullTextContent(text) {
  if (!text) return ''

  if (!Array.isArray(text)) return String(text)

  return text.reduce((result, item) => {
    const value = item[0]
    const decorations = item[1]

    if (value === '⁍') {
      // 检查是否有公式
      const equation = decorations?.find(d => d[0] === 'e')
      if (equation) {
        return result + equation[1] // 提取 LaTeX 内容
      }
      return result // 否则什么都不加
    }

    if (value === '‣') {
      const ref = Array.isArray(decorations) ? decorations[0] : null
      const type = ref?.[0]
      const data = ref?.[1]
      // todo: 处理更多类型 https://github.com/NotionX/react-notion-x/blob/9ee2d9334e260ee3600f4f8d7212f66b641b19cc/packages/notion-types/src/core.ts#L108
      switch (type) {
        case 'd':
          // 日期字符串
          const date =
            data?.start_date ||
            data?.start_time ||
            data?.end_date ||
            data?.end_time ||
            '[Date]'
          return result + date
        case 'lm':
          // Link Mention
          const title = data?.title || data?.href || '[Link]'
          return result + title
        // 用户 ID，这里不展开，默认忽略或标记
        case 'u':
        default:
          return result
      }
    }

    // 默认拼接普通文本
    return result + value
  }, '')
}

export function getPageContentText(post, pageBlockMap) {
  /**
   * 将对象的指定字段拼接到字符串
   * @param block
   * @param customKeys 优先级字段名列表
   * @returns string
   */
  function getText(block, customKeys = ['title', 'caption']) {
    const result = []
    const properties = block.properties
    if (!properties) {
      return ''
    }
    const textArray = getPropertyValue(properties, customKeys)
    result.push(getTextArray(textArray))
    if (block.type !== 'page' && block['content']?.length > 0) {
      for (const blockContent of block.content) {
        result.push(getBlockContentText(blockContent))
      }
    }
    return result.join(' ')
  }

  function getTextArray(textArray) {
    const text = textArray ? getFullTextContent(textArray) : ''
    if (text && text !== 'Untitled') {
      return text
    }
    return ''
  }

  function getTransclusionReference(block) {
    const result = []
    const blockPointer = block.format.transclusion_reference_pointer
    const blockPointerId = blockPointer.id
    if (blockPointer && pageBlockMap.block[blockPointerId].value) {
      const blockContentList = pageBlockMap.block[blockPointerId].value.content
      for (const blockContent of blockContentList) {
        result.push(getBlockContentText(blockContent))
      }
    }
    return result.join(' ')
  }

  function getBlockContentText(id) {
    const block = pageBlockMap?.block[id]?.value
    if (!block) {
      return ''
    }
    const blockType = block.type
    // todo: 处理更多类型 https://github.com/NotionX/react-notion-x/blob/9ee2d9334e260ee3600f4f8d7212f66b641b19cc/packages/notion-types/src/block.ts#L3
    switch (blockType) {
      case 'transclusion_reference':
        return getTransclusionReference(block)
      case 'table':
        return getTableText(block.content)
      case 'page':
        if (id !== postId) {
          return getText(block)
        }
        return ''
      case 'breadcrumb':
      case 'external_object_instance':
      case 'divider':
        return ''
      case 'image':
        return getText(block, ['alt_text', 'title'])
      // 除title以外,还有额外的link和description可供索引，但认为不需要
      case 'bookmark':
      case 'quote':
      case 'callout':
      case 'header':
      case 'sub_header':
      case 'code':
      case 'equation':
      case 'text':
      default:
        return getText(block)
    }
  }

  function getTableText(tableRowIds) {
    const result = []
    for (const blockRowId of tableRowIds) {
      if (pageBlockMap.block[blockRowId]) {
        const blockRow = pageBlockMap.block[blockRowId].value
        const blockRowProperties = blockRow.properties
        for (const blockRowPropertyValue of Object.values(blockRowProperties)) {
          result.push(getTextArray(blockRowPropertyValue))
        }
      }
    }
    return result.join(' ')
  }

  const postId = post.id
  const postContent = post.content
  let contentTextList = []
  // 防止搜到加密文章的内容
  if (postContent && postContent.length > 0 && !post.password) {
    for (const postContentId of postContent) {
      const blockContentText = getBlockContentText(postContentId)
      if (blockContentText) {
        contentTextList.push(blockContentText)
      }
    }
  }
  // console.log('开始', contentTextList.join(''), '结束')
  return contentTextList.join('')
}
