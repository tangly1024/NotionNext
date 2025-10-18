import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const Ribbon = () => {
  useEffect(() => {
    loadExternalResource('/js/ribbon.js', 'js').then(url => {
      window.createRibbon && window.createRibbon()
    })

    return () => window.destroyRibbon && window.destroyRibbon()
  }, [])

  return <></>
}

export default Ribbon
