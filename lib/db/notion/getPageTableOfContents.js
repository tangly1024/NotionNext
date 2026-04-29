import { getTextContent } from 'notion-utils'

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2,
  heading_1: 0,
  heading_2: 1,
  heading_3: 2
}

const unknownHeadingStats = new Map()

/**
 * @see https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (page, recordMap) => {
  const pageId = page?.id
  if (process.env.NODE_ENV !== 'production' && pageId) {
    unknownHeadingStats.set(pageId, 0)
  }
  const contents = page.content ?? []
  const toc = getBlockHeader(contents, recordMap, [], pageId)
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
    const actual = Number.isInteger(tocItem.indentLevel) ? tocItem.indentLevel : 0

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1]
      if (!prevIndent) {
        tocItem.indentLevel = 0
        indentLevelStack.push({
          actual,
          effective: 0
        })
        break
      }
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

  if (process.env.NODE_ENV !== 'production' && pageId) {
    const unknownCount = unknownHeadingStats.get(pageId) || 0
    if (unknownCount > 0) {
      console.warn('[TOC] unknown heading summary', { pageId, unknownCount })
    }
    unknownHeadingStats.delete(pageId)
  }

  return toc
}

/**
 * 重写获取目录方法
 */
function getBlockHeader(contents, recordMap, toc, pageId) {
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
    const isHeading =
      typeof type === 'string' &&
      (type.indexOf('header') >= 0 || /^heading_[123]$/.test(type))

    if (block.content?.length > 0) {
      getBlockHeader(block.content, recordMap, toc, pageId)
    } else {
      if (isHeading) {
        const existed = toc.find(e => e.id === blockId)
        const indentLevel = indentLevels[type]
        if (!Number.isInteger(indentLevel)) {
          // Emit debug signal only in development for quick reproduction.
          if (process.env.NODE_ENV !== 'production') {
            if (pageId) {
              unknownHeadingStats.set(
                pageId,
                (unknownHeadingStats.get(pageId) || 0) + 1
              )
            }
            console.warn('[TOC] unknown heading type', {
              pageId,
              blockId,
              type,
              title: getTextContent(block.properties?.title),
              parentId: block.parent_id
            })
          }
          continue
        }
        if (!existed) {
          toc.push({
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel
          })
        }
      } else if (
        type === 'transclusion_reference' &&
        block.format?.transclusion_reference_pointer?.id
      ) {
        getBlockHeader(
          [block.format.transclusion_reference_pointer.id],
          recordMap,
          toc,
          pageId
        )
      } else if (type === 'transclusion_container') {
        getBlockHeader(block.content, recordMap, toc, pageId)
      }
    }
  }

  return toc
}
