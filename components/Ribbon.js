import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const Ribbon = () => {
  useEffect(() => {
    // 确保在浏览器环境中运行
    if (typeof window !== 'undefined') {
      loadExternalResource('/js/ribbon.js', 'js')
        .then(url => {
          try {
            window.createRibbon && window.createRibbon()
          } catch (error) {
            console.warn('Ribbon initialization failed:', error)
          }
        })
        .catch(err => {
          console.warn('Failed to load ribbon.js:', err)
        })
    }

    return () => {
      try {
        window.destroyRibbon && window.destroyRibbon()
      } catch (error) {
        console.warn('Ribbon cleanup failed:', error)
      }
    }
  }, [])

  return <></>
}

export default Ribbon
