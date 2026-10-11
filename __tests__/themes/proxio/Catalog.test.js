/**
 * Catalog 滚动高亮回归测试
 *
 * 背景：PROXIO_POST_CATALOG_SHOW_LEVEL3 默认 false 时 filteredToc 只含
 * L1/L2 项，但滚动监听曾扫描全部 .notion-h——当读者滚到三级标题时
 * activeSection 被设为该隐藏标题的 id，目录中没有任何行匹配，高亮消失。
 * 修复：只在已显示目录项对应的标题中选择当前项（滚过隐藏 L3 时回退到
 * 最近的可见父章节，因其 bbox 仍在视口上方）。
 */
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import Catalog from '@/themes/proxio/components/Catalog'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { uuidToId } from 'notion-utils'

jest.mock('@/lib/global', () => ({
  useGlobal: jest.fn(() => ({ locale: { COMMON: { TABLE_OF_CONTENTS: '目录' } } }))
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

// notion-utils 是 ESM 包，jest 环境下直接提供 uuidToId 实现
jest.mock('notion-utils', () => ({
  uuidToId: id => String(id).replace(/-/g, '').slice(0, 8)
}))

jest.mock('lib/utils/throttle', () => {
  // 测试中直接同步执行，便于触发 scroll 断言
  return { __esModule: true, default: fn => {
    const wrapped = (...args) => fn(...args)
    wrapped.cancel = () => {}
    return wrapped
  } }
})

const uuid = n => `${n}-aaaa-bbbb-cccc-dddddddddddd`

// L1 → L2 → L3 三级标题，id 与 toc 一一对应
// （过滤规则是 indentLevel < maxDepth，L1=1 L2=2 L3=3）
const toc = [
  { id: uuid('h1'), text: '第一章', indentLevel: 0 },
  { id: uuid('h2'), text: '第一节', indentLevel: 1 },
  { id: uuid('h3'), text: '小节', indentLevel: 2 }
]

const post = { toc }

const mountHeadings = () => {
  // top < 0 表示已滚过视口顶部
  const headings = [
    { id: uuidToId(uuid('h1')), top: -800, bottom: -700 },
    { id: uuidToId(uuid('h2')), top: -600, bottom: -300 },
    // 三级标题：当前滚动位置停在这里（top 50 未过线）
    { id: uuidToId(uuid('h3')), top: 50, bottom: 200 }
  ]
  const els = headings.map(h => {
    const el = document.createElement('div')
    el.className = 'notion-h'
    el.setAttribute('data-id', h.id)
    el.getBoundingClientRect = () => ({
      top: h.top,
      bottom: h.bottom,
      left: 0,
      right: 0,
      width: 100,
      height: h.bottom - h.top
    })
    document.body.appendChild(el)
    return el
  })
  return els
}

describe('Catalog 滚动高亮（SHOW_LEVEL3 默认关闭）', () => {
  let headings
  let scrollSpy
  beforeAll(() => {
    // jsdom 没有 scrollTo / Element.scrollTo
    window.scrollTo = () => {}
    Element.prototype.scrollTo = () => {}
  })
  beforeEach(() => {
    siteConfig.mockReset()
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'PROXIO_POST_CATALOG_SHOW_LEVEL3') return false
      if (key === 'PROXIO_POST_CATALOG_SCROLL_BEHAVIOR') return 'instant'
      return defaultVal
    })
    document.body.innerHTML = ''
    headings = mountHeadings()
  })
  afterEach(() => {
    headings.forEach(el => el.remove())
  })

  it('滚过三级标题时，高亮回退到最近可见的二级目录项而不是消失', () => {
    const { container } = render(<Catalog post={post} />)

    // 目录应只显示 2 项（L3 被过滤）
    expect(screen.getByText('第一章')).toBeInTheDocument()
    expect(screen.getByText('第一节')).toBeInTheDocument()
    expect(screen.queryByText('小节')).not.toBeInTheDocument()

    // 触发滚动判定：此时 DOM 里的当前标题是三级标题「小节」
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    // 当前滚动位置落在 L3（top=50 未过线），L2 已滚过（top=-600 < 0）
    // → 应高亮 L2「第一节」（最近可见父章节）
    const active = container.querySelector(
      '.bg-primary\\/10, [class*="bg-primary"]'
    )
    expect(active).not.toBeNull()
    expect(active.textContent).toBe('第一节')
  })

  it('滚动位置在开头时高亮第一个目录项', () => {
    // 全部标题都在视口下方 → 回退高亮第一项
    headings.forEach(el => {
      const rect = el.getBoundingClientRect()
      el.getBoundingClientRect = () => ({ ...rect, top: 500, bottom: 600 })
    })
    const { container } = render(<Catalog post={post} />)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    const active = container.querySelector('[class*="bg-primary"]')
    expect(active).not.toBeNull()
    expect(active.textContent).toBe('第一章')
  })
})

describe('Catalog 键盘可访问性', () => {
  beforeAll(() => {
    window.scrollTo = () => {}
    Element.prototype.scrollTo = () => {}
    Element.prototype.scrollIntoView = () => {}
  })
  beforeEach(() => {
    siteConfig.mockReset()
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'PROXIO_POST_CATALOG_SHOW_LEVEL3') return false
      if (key === 'PROXIO_POST_CATALOG_SCROLL_BEHAVIOR') return 'instant'
      return defaultVal
    })
    document.body.innerHTML = ''
  })

  it('目录条目是原生链接：可 Tab 聚焦、href 指向标题锚点、Enter 触发跳转', () => {
    const { container } = render(<Catalog post={post} />)
    mountHeadings()
    const links = container.querySelectorAll('nav a')

    // 每个条目都可聚焦且带锚点 href
    expect(links.length).toBe(2)
    links.forEach(link => {
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toMatch(/^#[0-9a-zA-Z]{8}$/)
      expect(link.className).toContain('focus-visible:ring')
    })

    // Enter（click 事件）触发滚动到对应标题
    const target = document.querySelector(
      `[data-id="${links[1].getAttribute('href').slice(1)}"]`
    )
    expect(target).not.toBeNull()
    const scrollIntoView = jest.spyOn(target, 'scrollIntoView')
    links[1].click()
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('目录标题是原生按钮，可聚焦并回顶', () => {
    const { container } = render(<Catalog post={post} />)
    const header = container.querySelector('#proxio-catalog > button')
    expect(header).not.toBeNull()
    expect(header.className).toContain('focus-visible:ring')

    const scrollTop = jest.spyOn(window, 'scrollTo')
    header.click()
    expect(scrollTop).toHaveBeenCalled()
  })

  it('抽屉模式点击条目后发出关闭事件', () => {
    const { container } = render(<Catalog post={post} drawer />)
    const link = container.querySelector('nav a')
    const fired = jest.fn()
    document.getElementById('proxio-mobile-catalog')
      ?.addEventListener('proxio-catalog-close', fired)
    // 挂一个监听容器（MobileCatalog 实际挂载点）
    const mount = document.createElement('div')
    mount.id = 'proxio-mobile-catalog'
    document.body.appendChild(mount)
    mount.addEventListener('proxio-catalog-close', fired)

    link.click()
    expect(fired).toHaveBeenCalled()
    mount.remove()
  })
})
