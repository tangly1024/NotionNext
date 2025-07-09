import { getTextContent } from 'notion-utils'

export function getPageContentText(post, pageBlockMap) {
  /**
   * 将对象的指定字段拼接到字符串
   * @param block
   * @returns string
   */
  function getText(block) {
    const result = []
    const properties = block.properties
    if (!properties) {
      return ''
    }
    const textArray = properties['title'] || properties['caption']
    result.push(getTextArray(textArray))
    if (block['content']?.length > 0) {
      for (const blockContent of block.content) {
        result.push(getBlockContentText(blockContent))
      }
    }
    return result.join(' ')
  }

  function getTextArray(textArray) {
    const text = textArray ? getTextContent(textArray) : ''
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
    // todo: 处理更多类型
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
      case 'divider':
        return ''
      case 'quote':
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
  let contentTextList = []
  // 防止搜到加密文章的内容
  if (pageBlockMap && pageBlockMap.block && !post.password) {
    const contentIds = Object.keys(pageBlockMap.block)
    for (const id of contentIds) {
      const blockContentText = getBlockContentText(id)
      if (blockContentText) {
        contentTextList.push(blockContentText)
      }
    }
  }
  // console.log(contentTextList.join(''))
  return contentTextList.join('')
}
