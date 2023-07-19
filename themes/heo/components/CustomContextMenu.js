import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToCookies } from '@/themes/theme'

/**
 * 自定义右键菜单
 * @param {*} props
 * @returns
 */
export default function CustomContextMenu(props) {
  const [position, setPosition] = useState({ x: '0px', y: '0px' })
  const [show, setShow] = useState(false)
  const { isDarkMode, updateDarkMode } = useGlobal()
  const menuRef = useRef(null)

  const { latestPosts } = props
  const router = useRouter()
  function handleJumpToRandomPost() {
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    router.push(randomPost.slug)
  }

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault()
      setPosition({ y: `${event.clientY}px`, x: `${event.clientX}px` })
      setShow(true)
    }

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(false)
      }
    }

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('click', handleClick)
    }
  }, [])

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
    setShow(false)
  }

  function handleCopyLink() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('页面地址已复制')
      })
      .catch((error) => {
        console.error('复制页面地址失败:', error)
      })
    setShow(false)
  }

  function handleChangeDarkMode() {
    const newStatus = !isDarkMode
    saveDarkModeToCookies(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
        <div
            ref={menuRef}
            style={{ top: position.y, left: position.x }}
            className={`${show ? '' : 'invisible opacity-0'} transition-opacity duration-200 fixed z-50`}
        >

            {/* 菜单内容 */}
            <div className='rounded-xl w-52 dark:hover:border-yellow-600 bg-white dark:bg-[#040404] dark:text-gray-200 dark:border-gray-600 p-3 border drop-shadow-lg flex-col duration-300 transition-colors'>
                {/* 顶部导航按钮 */}
                <div className='flex justify-between'>
                    <i onClick={handleBack} className="hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-left"></i>
                    <i onClick={handleForward} className="hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-right"></i>
                    <i onClick={handleRefresh} className="hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-rotate-right"></i>
                    <i onClick={handleScrollTop} className="hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid fa-arrow-up"></i>
                </div>

                <hr className='my-2 border-dashed' />

                {/* 跳转导航按钮 */}
                <div className='w-full px-2'>

                    <div onClick={handleJumpToRandomPost} title={'随机前往一篇文章'} className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
                        <i className="fa-solid fa-podcast mr-2" />
                        <div className='whitespace-nowrap'> 随便逛逛</div>
                    </div>

                    <Link href='/category' title={'博客分类'} className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
                        <i class="fa-solid fa-square-minus mr-2" />
                        <div className='whitespace-nowrap'> 博客分类</div>
                    </Link>

                    <Link href='/tag' title={'文章标签'} className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
                        <i class="fa-solid fa-tag mr-2" />
                        <div className='whitespace-nowrap'> 文章标签</div>
                    </Link>

                </div>

                <hr className='my-2 border-dashed' />

                {/* 功能按钮 */}
                <div className='w-full px-2'>

                    <div onClick={handleCopyLink} title={'复制地址'} className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
                        <i class="fa-solid fa-arrow-up-right-from-square mr-2" />
                        <div className='whitespace-nowrap'> 复制地址</div>
                    </div>

                    <div onClick={handleChangeDarkMode} title={'深色模式'} className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'>
                        <i class="fa-regular fa-moon mr-2" />
                        <div className='whitespace-nowrap'> 深色模式</div>
                    </div>

                </div>

            </div>
        </div>
  )
}
