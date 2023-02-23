import * as React from 'react'

import Katex from '@/components/KatexReact'
import { getBlockTitle } from 'notion-utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export const Equation = ({ block, math, inline = false, className, ...rest }) => {
//   const { recordMap } = useNotionContext()
  math = math || getBlockTitle(block, null)
  if (!math) return null

  return (
    <span
      role='button'
      tabIndex={0}
      className={`notion-equation ${inline ? 'notion-equation-inline' : 'notion-equation-block'}`}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </span>
  )
}
