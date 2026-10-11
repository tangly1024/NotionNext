import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState, useMemo } from 'react'
import CONFIG from '../config'

/**
 * 目录导航组件 — Proxio 主题侧边栏目录
 *
 * 行为：
 * 1. 默认显示 L1 + L2 目录项
 * 2. 滚动到某个标题时高亮对应目录项
 * 3. 可配置 PROXIO_POST_CATALOG_SHOW_LEVEL3 控制是否显示第三级
 * 4. 点击目录标题回到文章顶部
 */
const Catalog = ({ post, drawer = false }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const clickLockRef = useRef(false)
  const [activeSection, setActiveSection] = useState(null)
  const activeSectionRef = useRef(activeSection)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // 配置
  const showLevel3 = siteConfig('PROXIO_POST_CATALOG_SHOW_LEVEL3', false, CONFIG)
  const scrollBehavior = siteConfig('PROXIO_POST_CATALOG_SCROLL_BEHAVIOR', 'instant', CONFIG)

  // 最大深度：如果不显示 L3 则只显示到 L2
  const maxDepth = showLevel3 ? 3 : 2

  // 过滤 TOC
  const filteredToc = useMemo(() => {
    if (!post?.toc) return []
    return post.toc.filter(item => item.indentLevel < maxDepth)
  }, [post?.toc, maxDepth])

  // 滚动监听，同步高亮
  useEffect(() => {
    if (!post || !filteredToc || filteredToc.length < 1) return

    // 只在「已显示目录项」对应的标题中选当前项：目录里被过滤掉的
    // 三级标题不应成为高亮目标，否则滚到 L3 时高亮会消失
    const visibleIds = new Set(filteredToc.map(t => uuidToId(t.id)))
    const getVisibleHeadings = () => {
      const all = document.getElementsByClassName('notion-h')
      const visible = []
      for (const section of all) {
        if (!section || !(section instanceof Element)) continue
        if (visibleIds.has(section.getAttribute('data-id'))) {
          visible.push(section)
        }
      }
      return visible
    }

    const throttleMs = 200
    const actionSectionScrollSpy = throttle(() => {
      if (clickLockRef.current) return
      const sections = getVisibleHeadings()
      if (!sections || sections.length === 0) return

      let prevBBox = null
      let currentSectionId = null
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
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
      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].getAttribute('data-id')
      }

      if (currentSectionId !== activeSectionRef.current) {
        setActiveSection(currentSectionId)
        const index = filteredToc.findIndex(
          t => uuidToId(t.id) === currentSectionId
        )
        if (index !== -1 && tRef?.current) {
          const itemHeight = 28
          const containerHeight = tRef.current.clientHeight
          const scrollTop = Math.max(
            0,
            itemHeight * index - containerHeight / 2 + itemHeight / 2
          )
          tRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }
    }, throttleMs)

    window.addEventListener('scroll', actionSectionScrollSpy, { passive: true })
    setTimeout(() => actionSectionScrollSpy(), 300)
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      actionSectionScrollSpy.cancel?.()
    }
  }, [post, filteredToc])

  // 无目录不渲染
  if (!filteredToc || filteredToc.length === 0) {
    return null
  }

  /**
   * 点击目录项滚动到对应标题
   */
  const scrollToSection = item => {
    const id = uuidToId(item.id)
    clickLockRef.current = true
    setActiveSection(id)
    const target = document.querySelector(`[data-id="${id}"]`)
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: scrollBehavior })
    }
    const delay = scrollBehavior === 'smooth' ? 500 : 50
    setTimeout(() => {
      clickLockRef.current = false
    }, delay)
  }

  return (
    <div id='proxio-catalog' className='flex flex-col gap-2'>
      {/* 抽屉模式的标题由外层面板头渲染，桌面侧边栏保留标题 */}
      {!drawer && (
        <button
          type='button'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='cursor-pointer rounded-md text-left text-sm font-semibold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </button>
      )}
      <nav
        ref={tRef}
        aria-label={locale.COMMON.TABLE_OF_CONTENTS}
        className={
          'flex-1 overflow-y-auto text-sm text-gray-500 dark:text-gray-400 ' +
          (drawer ? 'max-h-none' : 'max-h-[calc(100vh-200px)]')
        }>
        {filteredToc.map((item, idx) => {
          const id = uuidToId(item.id)
          const isActive = activeSection === id
          return (
            <a
              key={id + '-' + idx}
              href={`#${id}`}
              data-id={item.id}
              onClick={event => {
                // 原生锚点跳转会整页 hash 导航，改为平滑滚动并接管高亮
                event.preventDefault()
                scrollToSection(item)
                // 抽屉模式：跳转后自动收起
                if (drawer) {
                  const close = document.getElementById('proxio-mobile-catalog')
                  if (close) close.dispatchEvent(new Event('proxio-catalog-close'))
                }
              }}
              style={{ paddingLeft: drawer ? `${(item.indentLevel - 1) * 10 + 10}px` : `${(item.indentLevel - 1) * 12}px` }}
              className={
                'block cursor-pointer truncate rounded-md leading-7 transition-colors hover:text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:text-gray-100 dark:hover:bg-gray-700 ' +
                (isActive
                  ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-blue-300'
                  : '')
              }>
              {item.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

export default Catalog
