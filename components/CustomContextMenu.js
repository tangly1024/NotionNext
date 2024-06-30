import useWindowSize from '@/hooks/useWindowSize'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { THEMES, saveDarkModeToLocalStorage } from '@/themes/theme'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * 自定义右键菜单
 * @param {*} props
 * @returns
 */
export default function CustomContextMenu(props) {
  const [position, setPosition] = useState({ x: '0px', y: '0px' })
  const [show, setShow] = useState(false)
  const { isDarkMode, updateDarkMode, locale } = useGlobal()
  const menuRef = useRef(null)
  const windowSize = useWindowSize()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const { allNavPages } = props
  const router = useRouter()
  /**
   * 随机跳转文章
   */
  function handleJumpToRandomPost() {
    const randomIndex = Math.floor(Math.random() * allNavPages.length)
    const randomPost = allNavPages[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  useLayoutEffect(() => {
    setWidth(menuRef.current.offsetWidth)
    setHeight(menuRef.current.offsetHeight)
  }, [])

  useEffect(() => {
    setShow(false)
  }, [router])

  useEffect(() => {
    const handleContextMenu = event => {
      event.preventDefault()
      // 计算点击位置加菜单宽高是否超出屏幕，如果超出则贴边弹出
      const x =
        event.clientX < windowSize.width - width
          ? event.clientX
          : windowSize.width - width
      const y =
        event.clientY < windowSize.height - height
          ? event.clientY
          : windowSize.height - height
      setPosition({ y: `${y}px`, x: `${x}px` })
      setShow(true)
    }

    /**
     * 鼠标点击即关闭菜单
     */
    const handleClick = event => {
      setShow(false)
    }

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('click', handleClick)
    }
  }, [windowSize])

  function handleBack() {
    window.history.back()
  }

  function handleForward() {
    window.history.forward()
  }

  function handleRefresh() {
    window.location.reload()
  }

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCopyLink() {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // console.log('页面地址已复制')
        alert(`${locale.COMMON.PAGE_URL_COPIED} : ${url}`)
      })
      .catch(error => {
        console.error('复制页面地址失败:', error)
      })
  }

  /**
   * 切换主题
   */
  function handleChangeTheme() {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)] // 从THEMES数组中 随机取一个主题
    const query = router.query
    query.theme = randomTheme
    router.push({ pathname: router.pathname, query })
  }

  /**
   * 复制内容
   */
  function handleCopy() {
    const selectedText = document.getSelection().toString()
    if (selectedText) {
      const tempInput = document.createElement('input')
      tempInput.value = selectedText
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      // alert("Text copied: " + selectedText);
    } else {
      // alert("Please select some text first.");
    }
  }

  function handleChangeDarkMode() {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  // 一些配置变量
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST'
  )
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY'
  )
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_TAG = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_TAG'
  )
  const CAN_COPY = siteConfig('CAN_COPY')
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK'
  )
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE'
  )
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH = siteConfig(
    'CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH'
  )
  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className={`${show ? '' : 'invisible opacity-0'} select-none transition-opacity duration-200 fixed z-50`}>
      {/* 菜单内容 */}
      <div className='rounded-xl w-52 dark:hover:border-yellow-600 bg-white dark:bg-[#040404] dark:text-gray-200 dark:border-gray-600 p-3 border drop-shadow-lg flex-col duration-300 transition-colors'>
        {/* 顶部导航按钮 */}
        <div className='flex justify-between'>
          <i
            onClick={handleBack}
            className='hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-left'></i>
          <i
            onClick={handleForward}
            className='hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-right'></i>
          <i
            onClick={handleRefresh}
            className='hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-rotate-right'></i>
          <i
            onClick={handleScrollTop}
            className='hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-up'></i>
        </div>

        <hr className='my-2 border-dashed' />

        {/* 跳转导航按钮 */}
        <div className='w-full px-2'>
          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST && (
            <div
              onClick={handleJumpToRandomPost}
              title={locale.MENU.WALK_AROUND}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-podcast mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.WALK_AROUND}</div>
            </div>
          )}

          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY && (
            <Link
              href='/category'
              title={locale.MENU.CATEGORY}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-square-minus mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.CATEGORY}</div>
            </Link>
          )}

          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_TAG && (
            <Link
              href='/tag'
              title={locale.MENU.TAGS}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-tag mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.TAGS}</div>
            </Link>
          )}
        </div>

        <hr className='my-2 border-dashed' />

        {/* 功能按钮 */}
        <div className='w-full px-2'>
          {CAN_COPY && (
            <div
              onClick={handleCopy}
              title={locale.MENU.COPY}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-copy mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.COPY}</div>
            </div>
          )}

          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK && (
            <div
              onClick={handleCopyLink}
              title={locale.MENU.SHARE_URL}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-arrow-up-right-from-square mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.SHARE_URL}</div>
            </div>
          )}

          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE && (
            <div
              onClick={handleChangeDarkMode}
              title={
                isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE
              }
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              {isDarkMode ? (
                <i className='fa-regular fa-sun mr-2' />
              ) : (
                <i className='fa-regular fa-moon mr-2' />
              )}
              <div className='whitespace-nowrap'>
                {' '}
                {isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}
              </div>
            </div>
          )}

          {CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH && (
            <div
              onClick={handleChangeTheme}
              title={locale.MENU.THEME_SWITCH}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
              <i className='fa-solid fa-palette mr-2' />
              <div className='whitespace-nowrap'>
                {locale.MENU.THEME_SWITCH}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
