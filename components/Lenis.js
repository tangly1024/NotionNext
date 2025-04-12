/**
 * 鼠标滚动阻尼感
 */
import { useEffect } from 'react'
// import anime from 'animejs'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

/**
 * 鼠标点击烟花特效
 * @returns
 */
const Lenis = () => {

  useEffect(() => {
    // 异步加载
    async function loadLenis() {
      loadExternalResource(
        'https://unpkg.com/lenis@1.2.3/dist/lenis.mjs',
        'js'
      ).then(() => {
        console.log('Lenis',window.Lenis)
      })
    }

    loadLenis()

    return () => {
      // 在组件卸载时清理资源
    }
  }, [])

  return <></>
}

export default Lenis
