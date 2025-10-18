import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 侧边栏抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const SideBarDrawer = ({
  children,
  isOpen,
  onOpen,
  onClose,
  className,
  showOnPC = false
}) => {
  const router = useRouter()

  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false)
    }
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener)
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener)
    }
  }, [router.events])

  // 点击按钮更改侧边抽屉状态
  const switchSideDrawerVisible = showStatus => {
    if (showStatus) {
      onOpen && onOpen()
    } else {
      onClose && onClose()
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer')
    const sideBarDrawerBackground = window.document.getElementById(
      'sidebar-drawer-background'
    )

    if (showStatus) {
      sideBarDrawer?.classList.replace('translate-x-[-100%]', 'translate-x-0')
      sideBarDrawerBackground?.classList.replace('hidden', 'block')
    } else {
      sideBarDrawer?.classList.replace('translate-x-0', 'translate-x-[-100%]')
      sideBarDrawerBackground?.classList.replace('block', 'hidden')
    }
  }

  return (
    <div
      id='sidebar-wrapper'
      className={`block ${showOnPC ? '' : 'lg:hidden'} top-0`}>
      <div
        id='sidebar-drawer'
        className={`z-50 ${className} ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'} transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 flex flex-col fixed h-full left-0 overflow-y-scroll top-0`}>
        {children}
      </div>

      {/* 背景蒙版 */}
      <div
        id='sidebar-drawer-background'
        onClick={() => switchSideDrawerVisible(false)}
        className={`${isOpen ? 'block' : 'hidden'} fixed top-0 left-0 z-20 w-full h-full bg-black/70 transition-opacity duration-300`}
      />
    </div>
  )
}

export default SideBarDrawer
