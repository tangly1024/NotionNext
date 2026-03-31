import { useEffect, useRef } from 'react'
import { loadExternalResource } from '@/lib/utils'

/**
 * 滚动阻尼特效
 * @returns {JSX.Element}
 */
const Lenis = () => {
  const lenisRef = useRef(null) // 用于存储 Lenis 实例
  const rafIdRef = useRef(null) // 用于存储 requestAnimationFrame ID
  const isAbortedRef = useRef(false) // 防止组件卸载后继续初始化

  useEffect(() => {
    // 仅桌面端启用 Lenis
    const isDesktop = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (hover: hover)'
    ).matches
    if (!isDesktop) return

    const allowMotion = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches
    if (!allowMotion) return

    const uaPlatform =
      navigator.userAgentData?.platform || navigator.platform || ''
    const ua = navigator.userAgent || ''
    const isAppleLike =
      /mac/i.test(uaPlatform) ||
      /Mac OS X|iPad|iPhone|iPod/i.test(ua) ||
      (/MacIntel/i.test(uaPlatform) && navigator.maxTouchPoints > 1)

    isAbortedRef.current = false
    // 异步加载
    async function loadLenis() {
      try {
        await loadExternalResource('/js/lenis.js', 'js')

        // console.log('Lenis', window.Lenis)
        if (!window.Lenis) {
          console.error('Lenis not loaded')
          return
        }
        const LenisLib = window.Lenis
        if (isAbortedRef.current) return

        // 等待 DOM 完全加载
        if (document.readyState === 'loading') {
          await new Promise(resolve => {
            const done = () => resolve()
            window.addEventListener('DOMContentLoaded', done, { once: true })
          })
          if (isAbortedRef.current) return
        }

        // 创建 Lenis 实例
        const wheelMultiplier = isAppleLike ? 0.85 : 1
        const lenis = new LenisLib({
          duration: isAppleLike ? 0.85 : 1.1,
          easing: t => 1 - Math.pow(1 - t, 3),
          direction: 'vertical', // vertical, horizontal
          gestureDirection: 'vertical', // vertical, horizontal, both
          smooth: true,
          smoothWheel: true,
          wheelMultiplier,
          mouseMultiplier: wheelMultiplier,
          infinite: false
        })

        // 存储实例到 ref
        lenisRef.current = lenis

        // 监听滚动事件
        // lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // console.log({ scroll, limit, velocity, direction, progress })
        // })

        // 动画帧循环
        const raf = (time) => {
          if (isAbortedRef.current || !lenisRef.current) return
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
      isAbortedRef.current = true
      if (rafIdRef.current) {
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
