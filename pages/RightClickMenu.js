import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

const RightClickMenu = () => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const router = useRouter()
  const { posts = [] } = useGlobal() || {}

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      setVisible(true)
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = () => {
      setVisible(false)
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // 顶部导航图标
  const navIcons = [
    { icon: '←', action: () => window.history.back() },
    { icon: '→', action: () => window.history.forward() },
    { icon: '↻', action: () => window.location.reload() },
    { icon: '↑', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
  ]

  // 下方菜单项
  const menuItems = [
    { icon: '🔀', label: '随便逛逛' },
    { icon: '📁', label: '博客分类' },
    { icon: '🏷️', label: '文章标签' },
    { divider: true },
    { icon: '📋', label: '复制地址' },
    { icon: '🌓', label: '深色模式' },
    { icon: '繁', label: '轉為繁體' }
  ]

  const handleItemClick = (item) => {
    switch (item.label) {
      case '随便逛逛':
        if (posts?.length > 0) {
          const randomIndex = Math.floor(Math.random() * posts.length)
          router.push(`/article/${posts[randomIndex].slug}`)
        }
        break
      case '博客分类':
        router.push('/category')
        break
      case '文章标签':
        router.push('/tag')
        break
      case '复制地址':
        navigator.clipboard.writeText(window.location.href)
        break
      case '深色模式':
        document.documentElement.classList.toggle('dark')
        break
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-52 border-2 border-[#4460E7]/70"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {/* 顶部导航图标区 */}
      <div className="flex justify-around items-center py-3 px-2 border-b border-[#4460E7]/50 dark:border-[#4460E7]/50">
        {navIcons.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action()
              setVisible(false)
            }}
            className="hover:bg-[#4460E7]/20 dark:hover:bg-[#4460E7]/20 p-2.5 rounded-lg transition-colors duration-200"
          >
            <span className="text-xl text-gray-700 dark:text-gray-300">{item.icon}</span>
          </button>
        ))}
      </div>

      {/* 下方菜单区 */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          item.divider ? (
            <div key={`divider-${index}`} className="my-1.5 border-t border-[#4460E7]/50 dark:border-[#4460E7]/50" />
          ) : (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="px-4 py-2.5 hover:bg-[#4460E7]/20 dark:hover:bg-[#4460E7]/20 cursor-pointer flex items-center gap-4 text-[15px] dark:text-gray-200 transition-colors duration-200"
            >
              <span className="w-6 text-center text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default RightClickMenu