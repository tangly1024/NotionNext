import { useEffect } from 'react'

import { loadExternalResource } from '@/lib/utils/resourceLoader'

const Nest = () => {
  useEffect(() => {
    loadExternalResource('/js/nest.js', 'js').then(url => {
      window.createNest && window.createNest()
    })
    return () => window.destroyNest && window.destroyNest()
  }, [])
  return <></>
}

export default Nest
