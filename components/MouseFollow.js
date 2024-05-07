import { useEffect } from 'react'
// import anime from 'animejs'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

/**
 * 鼠标跟随特效
 * @returns
 */
const MOUSE_FOLLOW = () => {
  const type = siteConfig('MOUSE_FOLLOW_EFFECT_TYPE')
  const color = siteConfig('MOUSE_FOLLOW_EFFECT_COLOR')

  useEffect(() => {
    loadExternalResource('/js/mouse-follow.js', 'js').then(url => {
      if (window.createMouseCanvas) {
        window.createMouseCanvas()({
          type,
          color
        })
      }
    })
  }, [])

  return <></>
}
export default MOUSE_FOLLOW
