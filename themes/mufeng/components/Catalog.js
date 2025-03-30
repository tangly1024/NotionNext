import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  // 目录自动滚动
  const tRef = useRef(null)
  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)
  // 是否折叠目录
  const [collapsed, setCollapsed] = useState(false)
  // 目录最大高度
  const [maxHeight, setMaxHeight] = useState('60vh')

  // 根据窗口高度设置目录最大高度
  useEffect(() => {
    const updateMaxHeight = () => {
      // 窗口高度减去预估的头部区域(16rem)，再留出一些底部空间
      const calculatedHeight = window.innerHeight - 16 * 16 - 80
      const newMaxHeight = `${Math.max(calculatedHeight, 300)}px`
      setMaxHeight(newMaxHeight)
    }

    updateMaxHeight()
    window.addEventListener('resize', updateMaxHeight)
    return () => window.removeEventListener('resize', updateMaxHeight)
  }, [])

  // 监听滚动事件
  useEffect(() => {
    const throttleMs = 200
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = post?.toc?.findIndex(
        obj => uuidToId(obj.id) === currentSectionId
      )
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, throttleMs)

    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [post])

  // 无目录就直接返回空
  if (!post || !post?.toc || post?.toc?.length < 1) {
    return <></>
  }

  // 目录项点击处理
  const handleTocItemClick = (e, id) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (targetElement) {
      // 计算目标元素顶部距离视口顶部的距离
      const topOffset = 80 // 顶部导航栏高度估计值
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - topOffset
      
      // 平滑滚动到目标位置
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // 设置当前活动目录项
      setActiveSection(id)
      
      // 添加高亮效果，然后淡出
      targetElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900', 'transition-colors', 'duration-1000')
      
      // 延迟移除高亮效果
      setTimeout(() => {
        targetElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'transition-colors', 'duration-1000')
      }, 1500)
    }
  }

  // 切换目录折叠状态
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className='w-full'>
      <div className='dark:text-white mb-2 flex items-center justify-between cursor-pointer select-none border-b pb-2 dark:border-gray-700' onClick={toggleCollapse}>
        <div className='flex items-center'>
          <i className='mr-1 fas fa-list-ul text-red-500 dark:text-red-400' />
          <span className='font-medium text-gray-700 dark:text-gray-300'>{locale.COMMON.TABLE_OF_CONTENTS}</span>
        </div>
        <div className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'>
          <i className={`fas ${collapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
        </div>
      </div>

      {!collapsed && (
        <div
          className='overflow-y-auto overscroll-none scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800'
          style={{ maxHeight }}
          ref={tRef}>
          <nav className='h-full text-black'>
            {post?.toc?.map(tocItem => {
              const id = uuidToId(tocItem.id)
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  title={tocItem.text}
                  onClick={(e) => handleTocItemClick(e, id)}
                  className={`${
                    activeSection === id 
                      ? 'dark:border-red-500 border-red-500 text-red-700 dark:text-red-400 font-bold bg-gray-50 dark:bg-gray-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } hover:font-semibold border-l pl-4 block hover:text-red-600 duration-150 dark:text-gray-400 dark:border-gray-700
                  notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item w-full overflow-hidden py-1 rounded-r-md`}>
                  <span
                    style={{
                      display: 'inline-block',
                      marginLeft: tocItem.indentLevel * 16
                    }}
                    className={`truncate max-w-[140px] sm:max-w-[150px] block ${activeSection === id ? 'font-bold text-red-600 dark:text-red-400' : ''}`}>
                    {tocItem.text}
                  </span>
                </a>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}

export default Catalog
