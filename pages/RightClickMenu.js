import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

const RightClickMenu = ({ posts: propPosts }) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()
  const { posts: globalPosts = [] } = useGlobal() || {}
  const posts = propPosts || globalPosts
  const routeChangeInProgress = useRef(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      routeChangeInProgress.current = true
    }

    const handleRouteChangeComplete = () => {
      routeChangeInProgress.current = false
      setLoading(false)
    }

    const handleRouteChangeError = () => {
      routeChangeInProgress.current = false
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router])

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      if (routeChangeInProgress.current) return
      setVisible(true)

      // 获取视窗尺寸
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // 获取菜单尺寸
      const menuWidth = 256 // w-64 = 16 * 16 = 256px
      const menuHeight = menuRef.current?.offsetHeight || 400 // 预设高度

      // 计算菜单位置，确保不超出视窗
      let x = e.clientX
      let y = e.clientY

      // 处理右边界
      if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth - 16
      }

      // 处理下边界
      if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight - 16
      }

      // 处理左边界
      if (x < 16) {
        x = 16
      }

      // 处理上边界
      if (y < 16) {
        y = 16
      }

      setPosition({ x, y })
    }

    const handleClick = () => {
      if (!routeChangeInProgress.current) {
        setVisible(false)
      }
    }

    const handleResize = () => {
      if (visible && !routeChangeInProgress.current) {
        setVisible(false)
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [visible])

  // 顶部导航图标
  const navIcons = [
    { icon: '←', label: '后退', action: () => window.history.back() },
    { icon: '→', label: '前进', action: () => window.history.forward() },
    { icon: '↻', label: '刷新', action: () => window.location.reload() },
    { icon: '↑', label: '回顶', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
  ]

  // 下方菜单项
  const menuItems = [
    { icon: '🔀', label: '随便逛逛', description: '发现精彩内容' },
    { icon: '📁', label: '博客分类', description: '浏览文章分类' },
    { icon: '🏷️', label: '文章标签', description: '查看所有标签' },
    { divider: true },
    { icon: '📋', label: '复制地址', description: '复制当前页面链接' },
    { icon: '🌓', label: '深色模式', description: '切换显示模式' },
    { icon: '繁', label: '轉為繁體', description: '繁简体切换' }
  ]

  const handleRandomPost = async () => {
    // 检查是否有可用的文章
    if (!posts || posts.length === 0) {
      console.log('没有可用的文章')
      return
    }

    setLoading(true)
    try {
      // 获取当前页面的路径
      const currentPath = router.asPath

      // 过滤掉当前文章，只选择其他文章
      const availablePosts = posts.filter(post => {
        // 确保文章有有效的链接
        const postPath = post.slug || post.id || post.path
        // 移除路径中的前导斜杠以进行比较
        const normalizedPath = postPath?.startsWith('/') ? postPath.substring(1) : postPath
        const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath
        return postPath && normalizedPath !== normalizedCurrentPath
      })

      if (availablePosts.length === 0) {
        console.log('没有其他可用的文章')
        setLoading(false)
        return
      }

      // 随机选择一篇文章
      const randomIndex = Math.floor(Math.random() * availablePosts.length)
      const selectedPost = availablePosts[randomIndex]

      // 获取文章链接
      const postPath = selectedPost.slug || selectedPost.id || selectedPost.path
      if (!postPath) {
        console.error('选中的文章链接无效')
        setLoading(false)
        return
      }

      try {
        // 开始过渡动画
        setIsTransitioning(true)
        // 等待过渡动画开始
        await new Promise(resolve => setTimeout(resolve, 50))

        // 确保路径以斜杠开头
        const normalizedPath = postPath.startsWith('/') ? postPath : '/' + postPath
        await router.push(normalizedPath)

        // 显示成功消息
        console.log('成功跳转到:', selectedPost.title)
      } catch (error) {
        console.error('跳转失败:', error)
        setIsTransitioning(false)
      }
    } catch (error) {
      console.error('随机文章选择失败:', error)
    } finally {
      // 重置状态
      setLoading(false)
      setVisible(false)
    }
  }

  const handleItemClick = async (item) => {
    if (loading) return

    try {
      switch (item.label) {
        case '随便逛逛':
          await handleRandomPost()
          break
        case '博客分类':
          await router.push('/category')
          setVisible(false)
          break
        case '文章标签':
          await router.push('/tag')
          setVisible(false)
          break
        case '复制地址':
          await navigator.clipboard.writeText(window.location.href)
          setVisible(false)
          break
        case '深色模式':
          document.documentElement.classList.toggle('dark')
          setVisible(false)
          break
      }
    } catch (error) {
      console.error('菜单操作失败:', error)
      setLoading(false)
    }
  }

  // 监听路由变化完成事件
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsTransitioning(false)
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router])

  // 添加过渡效果的样式
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = `
        body {
          opacity: ${isTransitioning ? 0 : 1};
          transition: opacity 300ms ease-in-out;
        }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <style jsx global>{`
        body {
          opacity: ${isTransitioning ? 0 : 1};
          transition: opacity 300ms ease-in-out;
        }
      `}</style>
      {visible && (
        <div
          ref={menuRef}
          className="fixed z-50 animate-scale-up backdrop-blur-sm
            bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-2xl w-64
            border border-indigo-500/20 dark:border-yellow-500/20
            overflow-hidden"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transformOrigin: 'top left'
          }}
        >
          {/* 科技感装饰元素 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-yellow-500 dark:to-orange-500"></div>
            <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-500/10 dark:bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-purple-500/10 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* 顶部导航图标区 */}
          <div className="relative">
            <div className="flex justify-around items-center py-3 px-2 border-b border-indigo-500/20 dark:border-yellow-500/20">
              {navIcons.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action()
                    setVisible(false)
                  }}
                  className="group relative p-2.5 rounded-lg transition-all duration-300
                    hover:bg-indigo-500/20 dark:hover:bg-yellow-500/20"
                >
                  <span className="text-xl text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {item.icon}
                  </span>
                  {/* 悬浮提示 */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 下方菜单区 */}
          <div className="relative py-2">
            {menuItems.map((item, index) => (
              item.divider ? (
                <div key={`divider-${index}`} className="my-1.5 border-t border-indigo-500/20 dark:border-yellow-500/20" />
              ) : (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`group px-4 py-2.5 hover:bg-indigo-500/20 dark:hover:bg-yellow-500/20 cursor-pointer
                    transition-colors duration-300 relative overflow-hidden ${loading && item.label === '随便逛逛' ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 text-center text-lg group-hover:scale-110 transition-transform duration-300 
                      ${loading && item.label === '随便逛逛' ? 'animate-spin' : ''}`}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[15px] dark:text-gray-200 font-medium">{item.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-yellow-500 transition-colors duration-300">
                        {loading && item.label === '随便逛逛' ? '正在寻找文章...' : item.description}
                      </span>
                    </div>
                  </div>
                  {/* 悬浮时的装饰线条 */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 
                    dark:from-yellow-500 dark:to-orange-500 group-hover:w-full transition-all duration-300"></div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default RightClickMenu