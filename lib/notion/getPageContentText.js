import { checkStrIsUuid, isIterable } from '@/lib/utils'

export function getPageContentText(post, pageBlockMap) {
  /**
   * 将对象的指定字段拼接到字符串
   * @param sourceTextArray
   * @param targetObj
   * @param key
   * @returns string
   */
  function getText(targetObj) {
    if (!targetObj) {
      return ''
    }
    const textArray = targetObj['title'] || targetObj['caption']
    return getTextArray(textArray)
  }

  function getTextArray(textArray) {
    const text = textArray ? getTextContent(textArray) : ''
    if (text && text !== 'Untitled') {
      return text
    }
    return ''
  }

  const removeTypeFlag = ['a', 'p', '‣']

  /**
   * 递归获取层层嵌套的数组
   * @param {*} textArray
   * @returns string
   */
  function getTextContent(textArray) {
    if (typeof textArray === 'object' && isIterable(textArray)) {
      let result = ''
      for (const textObj of textArray) {
        if (textArray.length > 1 && removeTypeFlag.includes(textArray[0])) {
          return result
        }
        result = result + getTextContent(textObj)
      }
      return result
    } else if (typeof textArray === 'string') {
      if (checkStrIsUuid(textArray) && pageBlockMap.block[textArray]) {
        return getBlockContentText(textArray)
      } else if (textArray === pageBlockMap.block[postId].value.space_id) {
        return ''
      }
      return textArray
    }
  }

  function getTransclusionReference(block) {
    const result = []
    const blockPointer = block.format.transclusion_reference_pointer
    const blockPointerId = blockPointer.id
    if (blockPointer) {
      const blockContentList = pageBlockMap.block[blockPointerId].value.content
      for (const blockContent of blockContentList) {
        result.push(getBlockContentText(blockContent))
      }
    }
    return result.join('')
  }

  function getBlockContentText(id) {
    const block = pageBlockMap?.block[id].value
    const blockType = block.type
    switch (blockType) {
      case 'transclusion_reference':
        return getTransclusionReference(block)
      case 'table':
        return getTableText(block.content)
      case 'page':
        if (id !== postId) {
          return getText(block.properties)
        }
        return ''
      case 'breadcrumb':
      case 'divider':
        return ''
      case 'quote':
      default:
        const properties = block?.properties
        return getText(properties)
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
    return result.join('')
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
  console.log(contentTextList.join(''))
  return contentTextList.join('')
}
