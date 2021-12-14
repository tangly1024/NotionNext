
const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2
}

export const getPageTableOfContents = (page, recordMap) => {
  // 获取 header sub_header sub_sub_header
  const toc = (page.content ?? [])
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (block) {
        const { type } = block

        if (
          type === 'header' ||
          type === 'sub_header' ||
          type === 'sub_sub_header'
        ) {
          return {
            id: blockId,
            type,
            indentLevel: indentLevels[type]
          }
        }
      }

      return null
    })
    .filter(Boolean)

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
    } while (true)
  }

  return toc
}
