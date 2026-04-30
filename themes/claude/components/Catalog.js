import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import CONFIG from '../config'

/**
 * 目录导航组件 — Claude Code Docs 风格
 *
 * 行为：
 * 1. 默认显示 L1 + L2 目录项
 * 2. 滚动到某个 L2 时，高亮该 L2 及其父 L1；同时自动展开该 L2 下的 L3 子级
 * 3. 可配置 CLAUDE_TOC_SHOW_LEVEL3 控制是否显示第三级
 * 4. 点击 "On this page" 标题回到页面顶部
 * 5. 高亮颜色：浅色模式 = 加粗黑色，深色模式 = 陶土色 (terracotta)
 */
const Catalog = ({ post }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const clickLockRef = useRef(false)
  const [activeSection, setActiveSection] = useState(null)
  const activeSectionRef = useRef(activeSection)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // 配置
  const showLevel3 = siteConfig('CLAUDE_TOC_SHOW_LEVEL3', true, CONFIG)
  const scrollBehavior = siteConfig('CLAUDE_TOC_SCROLL_BEHAVIOR', 'instant', CONFIG)

  // 最大深度：如果不显示 L3 则只显示到 L2 (indentLevel < 2)，否则到 L3 (indentLevel < 3)
  const maxDepth = showLevel3 ? 3 : 2

  // 过滤 TOC
  const filteredToc = useMemo(() => {
    if (!post?.toc) return []
    return post.toc.filter(item => item.indentLevel < maxDepth)
  }, [post?.toc, maxDepth])

  // 构建层级关系
  const tocHierarchy = useMemo(() => {
    const hierarchy = new Map()
    const parentStack = []

    filteredToc.forEach((item, index) => {
      const id = uuidToId(item.id)

      // 回退栈直到找到比当前层级更小的父级
      while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= item.indentLevel) {
        parentStack.pop()
      }

      const parentId = parentStack.length > 0 ? parentStack[parentStack.length - 1].id : null

      hierarchy.set(id, {
        item,
        index,
        parentId,
        children: [],
        indentLevel: item.indentLevel
      })

      // 将当前项添加为父级的子项
      if (parentId) {
        hierarchy.get(parentId)?.children.push(id)
      }

      parentStack.push({ id, level: item.indentLevel })
    })

    return hierarchy
  }, [filteredToc])

  // 获取某个 ID 的所有祖先 ID（含自身）
  const getAncestorChain = useCallback((targetId) => {
    const chain = new Set()
    let current = targetId
    while (current) {
      chain.add(current)
      const node = tocHierarchy.get(current)
      current = node?.parentId
    }
    return chain
  }, [tocHierarchy])

  // 获取当前激活的 L2 section 的 ID（用于展开其 L3 子级）
  const activeL2Id = useMemo(() => {
    if (!activeSection) return null
    const node = tocHierarchy.get(activeSection)
    if (!node) return null

    // 如果当前是 L2 (indentLevel=1)，返回自身
    if (node.indentLevel === 1) return activeSection
    // 如果当前是 L3 (indentLevel=2)，返回其 L2 父级
    if (node.indentLevel === 2) return node.parentId
    // 如果当前是 L1 (indentLevel=0)，无 L2 激活
    return null
  }, [activeSection, tocHierarchy])

  // 高亮集合：当前项 + 所有祖先
  const highlightedIds = useMemo(() => {
    if (!activeSection) return new Set()
    return getAncestorChain(activeSection)
  }, [activeSection, getAncestorChain])

  // 判断某项是否应该显示
  const shouldShowItem = useCallback((id, indentLevel) => {
    // L1 总是显示
    if (indentLevel === 0) return true
    // L2 总是显示
    if (indentLevel === 1) return true
    // L3 仅在其父 L2 激活时显示（或者 showLevel3 关闭时已被过滤）
    if (indentLevel === 2) {
      if (!showLevel3) return false
      const node = tocHierarchy.get(id)
      if (!node) return false
      // 父级 L2 是否是当前激活的 L2
      return node.parentId === activeL2Id
    }
    return false
  }, [showLevel3, tocHierarchy, activeL2Id])

  // 监听滚动事件
  useEffect(() => {
    if (!post || !filteredToc || filteredToc.length < 1) return

    const throttleMs = 100

    const actionSectionScrollSpy = throttle(() => {
      if (clickLockRef.current) return

      const sections = document.getElementsByClassName('notion-h')
      if (!sections || sections.length === 0) return

      const container = document.querySelector('#container-inner')
      if (!container) return
      const containerTop = container.getBoundingClientRect().top

      let currentSectionId = null

      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue

        const bbox = section.getBoundingClientRect()
        const relativeTop = bbox.top - containerTop

        if (relativeTop <= 30) {
          currentSectionId = section.getAttribute('data-id')
        } else {
          break
        }
      }

      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].getAttribute('data-id')
      }

      if (currentSectionId !== activeSectionRef.current) {
        setActiveSection(currentSectionId)

        // 滚动目录使当前项可见
        const index = filteredToc.findIndex(
          obj => uuidToId(obj.id) === currentSectionId
        )
        if (index !== -1 && tRef?.current) {
          const itemHeight = 28
          const containerHeight = tRef.current.clientHeight
          const scrollTop = Math.max(0, itemHeight * index - containerHeight / 2 + itemHeight / 2)
          tRef.current.scrollTo({ top: scrollTop, behavior: scrollBehavior })
        }
      }
    }, throttleMs)

    const content = document.querySelector('#container-inner')
    if (!content) return

    content.addEventListener('scroll', actionSectionScrollSpy)
    setTimeout(() => actionSectionScrollSpy(), 300)

    return () => {
      content?.removeEventListener('scroll', actionSectionScrollSpy)
      actionSectionScrollSpy.cancel?.()
    }
  }, [post, filteredToc, tocHierarchy, scrollBehavior])

  // 点击 "On this page" 标题回到顶部
  const handleTitleClick = () => {
    const container = document.querySelector('#container-inner')
    if (container) {
      container.scrollTo({ top: 0, behavior: scrollBehavior })
    }
  }

  if (!post || !filteredToc || filteredToc.length < 1) {
    return <></>
  }

  return (
    <div className='catalog-wrapper h-full flex flex-col'>
      {/* 标题 — 点击回到顶部 */}
      <div
        className='catalog-title cursor-pointer select-none'
        onClick={handleTitleClick}>
        <i className='mr-2 fas fa-list-ul text-xs' />
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>

      {/* 目录列表 */}
      <div
        className='catalog-list overflow-y-auto overscroll-none flex-1'
        ref={tRef}>
        <nav className='toc-nav'>
          {filteredToc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            const isHighlighted = highlightedIds.has(id)
            const isActive = activeSection === id
            const show = shouldShowItem(id, tocItem.indentLevel)

            if (!show) return null

            // 缩进
            const paddingLeft = tocItem.indentLevel === 0 ? 0
              : tocItem.indentLevel === 1 ? 20
                : 40

            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  clickLockRef.current = true

                  const target = document.querySelector(`[data-id="${id}"]`)
                  if (target) {
                    const container = document.querySelector('#container-inner')
                    if (container) {
                      const targetRect = target.getBoundingClientRect()
                      const containerRect = container.getBoundingClientRect()
                      const scrollOffset = container.scrollTop + targetRect.top - containerRect.top - 20
                      container.scrollTo({ top: scrollOffset, behavior: scrollBehavior })
                    }
                  }

                  const delay = scrollBehavior === 'smooth' ? 500 : 50
                  setTimeout(() => {
                    setActiveSection(id)
                    clickLockRef.current = false
                  }, delay)
                }}
                className={`toc-item block
                  ${isActive ? 'toc-active' : ''}
                  ${isHighlighted && !isActive ? 'toc-highlighted' : ''}
                  ${!isHighlighted ? 'toc-inactive' : ''}
                `}
                style={{ paddingLeft: `${paddingLeft}px` }}>
                <span className='block break-words'>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
