import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const StarrySky = () => {
  useEffect(() => {
    loadExternalResource('/js/starrySky.js', 'js').then(url => {
      window.renderStarrySky && window.renderStarrySky()
    })
  }, [])
  return (
    <></>
  )
}

export default StarrySky
