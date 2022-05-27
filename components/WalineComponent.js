import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
export const WalineComponent = (props) => {
  const walineInstanceRef = React.useRef(null)
  const containerRef = React.createRef()

  React.useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      serverURL: BLOG.COMMENT_WALINE_SERVER_URL
    })

    return () => walineInstanceRef.current?.destroy()
  }, [])

  React.useEffect(() => {
    walineInstanceRef.current?.update(props)
  }, props)

  return <div ref={containerRef} />
}
