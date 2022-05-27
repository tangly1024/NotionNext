import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
export const WalineComponent = (props) => {
  const walineInstanceRef = React.useRef(null)
  const containerRef = React.createRef()
  const router = useRouter()

  React.useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      serverURL: BLOG.COMMENT_WALINE_SERVER_URL
    })

    return () => walineInstanceRef.current?.destroy()
  }, [])

  const updateWaline = url => {
    walineInstanceRef.current?.update(props)
  }

  React.useEffect(() => {
    walineInstanceRef.current?.update(props)
    router.events.on('routeChangeComplete', updateWaline)
    return () => {
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  React.useEffect(() => {

  }, [])

  return <div ref={containerRef} />
}
