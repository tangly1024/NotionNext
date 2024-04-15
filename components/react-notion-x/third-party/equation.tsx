import * as React from 'react'

import Katex from '@matejmazur/react-katex'
import { EquationBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'

import { useNotionContext } from '../context'
import { cs } from '../utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export const Equation: React.FC<{
  block: EquationBlock
  math?: string
  inline?: boolean
  className?: string
}> = ({ block, math, inline = false, className, ...rest }) => {
  const { recordMap } = useNotionContext()
  math = math || getBlockTitle(block, recordMap)
  if (!math) return null

  return (
    <span
      role='button'
      tabIndex={0}
      className={cs(
        'notion-equation',
        inline ? 'notion-equation-inline' : 'notion-equation-block',
        className
      )}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </span>
  )
}
