import { useEffect, useRef } from 'react'
import { loadExternalResource } from '@/lib/utils'

/**
 * 滚动阻尼特效
 * @returns {JSX.Element}
 */
const Lenis = () => {
  const lenisRef = useRef(null) // 用于存储 Lenis 实例
  const rafIdRef = useRef(null) // 用于存储 requestAnimationFrame ID
  const isDisposedRef = useRef(false) // 防止组件卸载后继续初始化

  useEffect(() => {
    // 仅桌面端启用 Lenis
    const isDesktopLike = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (hover: hover)'
    ).matches
    if (!isDesktopLike) return

    const allowMotion = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches
    if (!allowMotion) return

    isDisposedRef.current = false
    const lenisScriptUrl = '/js/lenis.js'

    // 异步加载
    async function loadLenis() {
      try {
        if (!window.Lenis) {
          await loadExternalResource(lenisScriptUrl, 'js')
        }
        if (isDisposedRef.current) return

        // console.log('Lenis', window.Lenis)
        if (!window.Lenis) {
          console.error('Lenis not loaded')
          return
        }
        const LenisLib = window.Lenis
        if (isDisposedRef.current) return

        // 创建 Lenis 实例
        const lenis = new LenisLib({
          duration: 1.1,
          easing: t => 1 - Math.pow(1 - t, 3),
          direction: 'vertical', // vertical, horizontal
          gestureDirection: 'vertical', // vertical, horizontal, both
          smooth: true,
          smoothWheel: true,
          smoothTouch: false,
          mouseMultiplier: 1,
          infinite: false
        })
        if (isDisposedRef.current) {
          lenis.destroy()
          return
        }

        // 存储实例到 ref
        lenisRef.current = lenis

        // 监听滚动事件
        // lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // console.log({ scroll, limit, velocity, direction, progress })
        // })

        // 动画帧循环
        const raf = (time) => {
          if (isDisposedRef.current || !lenisRef.current) return
          lenisRef.current.raf(time)
          rafIdRef.current = requestAnimationFrame(raf)
        }

        rafIdRef.current = requestAnimationFrame(raf)
      } catch (error) {
        console.error('Failed to load Lenis:', error)
      }
    }

    loadLenis()

    return () => {
      // 在组件卸载时清理资源
      isDisposedRef.current = true
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (lenisRef.current) {
        lenisRef.current.destroy() // 销毁 Lenis 实例
        lenisRef.current = null
        // console.log('Lenis instance destroyed')
      }
    }
  }, [])

  return <></>
}

export default Lenis
