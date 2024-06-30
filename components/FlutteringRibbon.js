/* eslint-disable */
import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

export const FlutteringRibbon = () => {
  useEffect(() => {
    loadExternalResource('/js/flutteringRibbon.js', 'js').then(url => {
      window.createFlutteringRibbon && window.createFlutteringRibbon()
    })

    return () =>
      window.destroyFlutteringRibbon && window.destroyFlutteringRibbon()
  }, [])
  return <></>
}

export default FlutteringRibbon
