'use client'

import { useEffect, useCallback } from 'react'
import { isBrowser } from '@/lib/utils'

/**
 * Viewport Scale Hook - Endfield-style proportional scaling
 * 
 * This hook dynamically adjusts the html element's font-size based on viewport dimensions,
 * allowing all rem-based measurements to scale proportionally.
 * 
 * Algorithm based on Endfield website:
 * - Landscape: design base 1920 x 1080 (standard HD for larger content)
 * - Portrait: design base 390 x 844 (iPhone 14 size for mobile)
 * - Scales by whichever dimension maintains aspect ratio
 */
const useViewportScale = (options = {}) => {
  const {
    // 1440x900 as landscape base for larger content on regular screens (similar to Notion style)
    landscapeBase = { width: 1440, height: 900 },
    // 390x844 as portrait base (iPhone 14 size)
    portraitBase = { width: 390, height: 844 },
    baseFontSize = 16,
    minFontSize = 14,
    maxFontSize = 24
  } = options

  // Cache previous dimensions to avoid unnecessary updates
  let _innerWidth = 0
  let _innerHeight = 0

  const applyScale = useCallback(() => {
    if (!isBrowser) return

    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    // Skip if dimensions haven't changed
    if (innerWidth === _innerWidth && innerHeight === _innerHeight) {
      return
    }
    _innerWidth = innerWidth
    _innerHeight = innerHeight

    let fontSize = baseFontSize

    if (innerHeight >= innerWidth) {
      // Portrait mode: use portrait design base (1080 x 1920)
      const designWidth = portraitBase.width
      const designHeight = portraitBase.height
      
      if (innerWidth / innerHeight > designWidth / designHeight) {
        // Viewport is wider than design ratio, scale by height
        fontSize = baseFontSize * (innerHeight / designHeight)
      } else {
        // Viewport is taller than design ratio, scale by width
        fontSize = baseFontSize * (innerWidth / designWidth)
      }
    } else {
      // Landscape mode: use landscape design base (2560 x 1440)
      const designWidth = landscapeBase.width
      const designHeight = landscapeBase.height
      
      if (innerWidth / innerHeight > designWidth / designHeight) {
        // Viewport is wider than design ratio, scale by height
        fontSize = baseFontSize * (innerHeight / designHeight)
      } else {
        // Viewport is narrower than design ratio, scale by width
        fontSize = baseFontSize * (innerWidth / designWidth)
      }
    }

    // Clamp font size to reasonable bounds
    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize))

    // Apply to html element
    const html = document.documentElement
    html.style.fontSize = `${fontSize}px`
    
    // Also set CSS custom properties for additional flexibility
    html.style.setProperty('--endspace-viewport-scale', (fontSize / baseFontSize).toString())
    html.style.setProperty('--endspace-base-font-size', `${fontSize}px`)
  }, [landscapeBase, portraitBase, baseFontSize, minFontSize, maxFontSize])

  useEffect(() => {
    if (!isBrowser) return

    // Apply initial scale immediately
    applyScale()

    // Handle resize events
    const handleResize = () => {
      applyScale()
    }

    // Handle orientation change with small delay for browser to settle
    const handleOrientationChange = () => {
      setTimeout(applyScale, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      // Reset font-size on unmount
      document.documentElement.style.fontSize = ''
      document.documentElement.style.removeProperty('--endspace-viewport-scale')
      document.documentElement.style.removeProperty('--endspace-base-font-size')
    }
  }, [applyScale])

  return { applyScale }
}

export default useViewportScale
