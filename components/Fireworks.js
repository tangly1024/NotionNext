/**
 * https://codepen.io/juliangarnier/pen/gmOwJX
 * custom by hexo-theme-yun @YunYouJun
 */
import { useEffect } from 'react'
// import anime from 'animejs'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

/**
 * 鼠标点击烟花特效
 * @returns
 */
const Fireworks = () => {
  const fireworksColor = siteConfig('FIREWORKS_COLOR')

  useEffect(() => {
    // 异步加载
    async function loadFireworks() {
      loadExternalResource(
        'https://cdnjs.snrat.com/ajax/libs/animejs/3.2.1/anime.min.js',
        'js'
      ).then(() => {
        loadExternalResource('/js/fireworks.js', 'js').then(() => {
          if (window.anime && window.createFireworks) {
            window.createFireworks({
              config: { colors: fireworksColor },
              anime: window.anime
            })
          }
        })
      })
    }

    loadFireworks()

    return () => {
      // 在组件卸载时清理资源
      const fireworksElements = document.getElementsByClassName('fireworks')
      while (fireworksElements.length > 0) {
        fireworksElements[0].parentNode.removeChild(fireworksElements[0])
      }
    }
  }, [])

  return <></>
}

export default Fireworks
