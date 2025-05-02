/* eslint-disable */
import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const Sakura = () => {
  useEffect(() => {
    loadExternalResource('/js/sakura.js', 'js').then(url => {
        window.createSakura && window.createSakura({})
    })
    return () => window.destroySakura && window.destroySakura()
  }, [])
  return <></>
}

export default Sakura