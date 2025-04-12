/**
 * 鼠标滚动阻尼感
 */
import { useEffect } from 'react'
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
        '/js/lenis.js',
        'js'
      ).then(() => {
        console.log('Lenis',window.Lenis)
        if(!window.Lenis) {
          console.error('Lenis not loaded')
          return
        }
        const Lenis = window.Lenis
        // 创建 Lenis 实例

        const lenis = new Lenis({ 
          duration: 1.2, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou 
          direction: 'vertical', // vertical, horizontal 
          gestureDirection: 'vertical', // vertical, horizontal, both 
          smooth: true, 
          mouseMultiplier: 1, 
          smoothTouch: false, 
          touchMultiplier: 2, 
          infinite: false, 
          }) 
          
          //get scroll value 
          lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => { console.log({ scroll, limit, velocity, direction, progress }) 
          }) 
          
          function raf(time) { 
          lenis.raf(time) 
          requestAnimationFrame(raf) 
          } 
          
          requestAnimationFrame(raf) 
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
