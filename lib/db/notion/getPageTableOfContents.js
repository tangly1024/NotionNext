import { getTextContent } from 'notion-utils'

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2
}

/**
 * @see https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (page, recordMap) => {
  const contents = page.content ?? []
  const toc = getBlockHeader(contents, recordMap)
  const indentLevelStack = [
    {
      actual: -1,
      effective: -1
    }
  ]

  // Adjust indent levels to always change smoothly.
  // This is a little tricky, but the key is that when increasing indent levels,
  // they should never jump more than one at a time.
  for (const tocItem of toc) {
    const { indentLevel } = tocItem
    const actual = indentLevel

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1]
      const { actual: prevActual, effective: prevEffective } = prevIndent

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel
        })
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective
        break
      } else {
        indentLevelStack.pop()
      }

      // eslint-disable-next-line no-constant-condition
    } while (true)
  }

  return toc
}

/**
 * 重写获取目录方法
 */
function getBlockHeader(contents, recordMap, toc) {
  if (!toc) {
    toc = []
  }
  if (!contents) {
    return toc
  }

  for (const blockId of contents) {
    const block = recordMap.block[blockId]?.value
    if (!block) {
      continue
    }
    const { type } = block
    if (block.content?.length > 0) {
      getBlockHeader(block.content, recordMap, toc)
    } else {
      if (type.indexOf('header') >= 0) {
        const existed = toc.find(e => e.id === blockId)
        if (!existed) {
          toc.push({
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel: indentLevels[type]
          })
        }
      } else if (type === 'transclusion_reference') {
        getBlockHeader(
          [block.format.transclusion_reference_pointer.id],
          recordMap,
          toc
        )
      } else if (type === 'transclusion_container') {
          getBlockHeader(block.content, recordMap, toc)
      }
    }
  }

  return toc
}
