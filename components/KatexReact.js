import KaTeX from 'katex'
import { memo, useEffect, useState } from 'react'

/**
 * 数学公式
 * @param {*} param0
 * @returns
 */
const TeX = ({
  children,
  math,
  block,
  errorColor,
  renderError,
  settings,
  as: asComponent,
  ...props
}) => {
  const Component = asComponent || (block ? 'div' : 'span')
  const content = (children ?? math)
  const [state, setState] = useState({ innerHtml: '' })

  useEffect(() => {
    try {
      const innerHtml = KaTeX.renderToString(content, {
        displayMode: true,
        errorColor,
        throwOnError: !!renderError,
        ...settings
      })

      setState({ innerHtml })
    } catch (error) {
      if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
        if (renderError) {
          setState({ errorElement: renderError(error) })
        } else {
          setState({ innerHtml: error.message })
        }
      } else {
        throw error
      }
    }
  }, [block, content, errorColor, renderError, settings])

  if ('errorElement' in state) {
    return state.errorElement
  }

  return (
    <Component
      {...props}
      dangerouslySetInnerHTML={{ __html: state.innerHtml }}
    />
  )
}

export default memo(TeX)
