import { useRouter } from 'next/router'
import React from 'react'

/**
 * 侧边栏抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const SideBarDrawer = ({ children, isOpen, onOpen, onClose, className }) => {
  const router = useRouter()
  React.useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false)
    }
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener)
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener)
    }
  }, [router.events])

  // 点击按钮更改侧边抽屉状态
  const switchSideDrawerVisible = (showStatus) => {
    if (showStatus) {
      onOpen && onOpen()
    } else {
      onClose && onClose()
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer')
    const sideBarDrawerBackground = window.document.getElementById('sidebar-drawer-background')

    if (showStatus) {
      sideBarDrawer.classList.replace('-ml-56', 'ml-0')
      sideBarDrawerBackground.classList.replace('hidden', 'block')
    } else {
      sideBarDrawer.classList.replace('ml-0', '-ml-56')
      sideBarDrawerBackground.classList.replace('block', 'hidden')
    }
  }

  return <div id='sidebar-wrapper' className={' ' + className }>
    <div id='sidebar-drawer' className={`${isOpen ? 'ml-0 w-56' : '-ml-56'} bg-white dark:bg-gray-900 shadow-black shadow-lg flex flex-col duration-300 fixed h-full left-0 overflow-y-scroll scroll-hidden top-0 z-30`}>
      {children}
    </div>

    {/* 背景蒙版 */}
    <div id='sidebar-drawer-background' onClick={() => { switchSideDrawerVisible(false) }}
         className={`${isOpen ? 'block' : 'hidden'} animate__animated animate__fadeIn fixed top-0 duration-300 left-0 z-20 w-full h-full bg-black/70`}/>
  </div>
}
export default SideBarDrawer
