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
    // 页面渲染后删除hidden属性
    // const sideBarWrapperElement = document.getElementById('sidebar-wrapper')
    // sideBarWrapperElement?.classList?.remove('hidden')

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
      onOpen()
    } else {
      onClose()
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer')
    const sideBarDrawerBackground = window.document.getElementById('sidebar-drawer-background')

    if (showStatus) {
      sideBarDrawer.classList.replace('-ml-80', 'ml-0')
      sideBarDrawerBackground.classList.replace('hidden', 'block')
    } else {
      sideBarDrawer.classList.replace('ml-0', '-ml-80')
      sideBarDrawerBackground.classList.replace('block', 'hidden')
    }
  }

  return <div id='sidebar-wrapper' className={' ' + className}>
    <div id='sidebar-drawer' className={`${isOpen ? 'ml-0' : '-ml-80'} bg-white dark:bg-gray-900 flex flex-col duration-300 fixed h-full left-0 overflow-y-scroll scroll-hidden top-0 z-40`}>
      {children}
    </div>
    {/* 背景蒙版 */}
    <div id='sidebar-drawer-background' onClick={() => { switchSideDrawerVisible(false) }}
         className={`${isOpen ? 'block' : 'hidden'} animate__animated animate__fadeIn fixed top-0 duration-300 left-0 z-30 w-full h-full glassmorphism`}/>
  </div>
}
export default SideBarDrawer
