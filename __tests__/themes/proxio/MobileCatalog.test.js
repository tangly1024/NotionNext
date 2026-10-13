/**
 * MobileCatalog 抽屉可访问性回归测试
 *
 * 背景：关闭态抽屉原先只靠 translate 移出屏幕，抽屉内的目录链接仍留在
 * Tab 顺序与可访问性树中——键盘用户 Tab 越过入口按钮后会聚焦到屏幕外
 * 的不可见链接（left=399px）并丢失可见焦点。
 * 修复：关闭态不挂载目录内容；收起时把焦点交还入口按钮。
 */
import { render, act } from '@testing-library/react'
import React from 'react'
import MobileCatalog from '@/themes/proxio/components/MobileCatalog'
import { uuidToId } from 'notion-utils'

jest.mock('@/lib/global', () => ({
  useGlobal: jest.fn(() => ({ locale: { COMMON: { TABLE_OF_CONTENTS: '目录' } } }))
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('notion-utils', () => ({
  uuidToId: id => String(id).replace(/-/g, '').slice(0, 8)
}))

jest.mock('lib/utils/throttle', () => ({
  __esModule: true,
  default: fn => {
    const wrapped = (...args) => fn(...args)
    wrapped.cancel = () => {}
    return wrapped
  }
}))

const uuid = n => `${n}-aaaa-bbbb-cccc-dddddddddddd`
const toc = [
  { id: uuid('h1'), text: '第一章', indentLevel: 0 },
  { id: uuid('h2'), text: '第一节', indentLevel: 1 }
]
const post = { toc }

// 正文中的标题锚点，供 scrollToSection 查找
const mountHeadings = () => {
  return toc.map(item => {
    const el = document.createElement('div')
    el.className = 'notion-h'
    el.setAttribute('data-id', uuidToId(item.id))
    el.getBoundingClientRect = () => ({ top: -800, bottom: -700, left: 0, right: 0, width: 100, height: 100 })
    document.body.appendChild(el)
    return el
  })
}

const getParts = container => ({
  button: container.querySelector('#proxio-mobile-catalog > button'),
  mask: container.querySelectorAll('#proxio-mobile-catalog > div')[0],
  drawer: container.querySelectorAll('#proxio-mobile-catalog > div')[1]
})

describe('MobileCatalog 抽屉关闭态不进入 Tab 顺序', () => {
  let headings
  beforeAll(() => {
    window.scrollTo = () => {}
    Element.prototype.scrollTo = () => {}
    Element.prototype.scrollIntoView = () => {}
  })
  beforeEach(() => {
    // 滚动超过 180px，入口按钮出现
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true, configurable: true })
    document.body.innerHTML = ''
    headings = mountHeadings()
  })
  afterEach(() => {
    headings.forEach(el => el.remove())
  })

  const { siteConfig } = require('@/lib/config')
  beforeEach(() => {
    siteConfig.mockReset()
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'PROXIO_POST_CATALOG_SHOW_LEVEL3') return false
      if (key === 'PROXIO_POST_CATALOG_SCROLL_BEHAVIOR') return 'instant'
      return defaultVal
    })
  })

  const openDrawer = container => {
    const parts = getParts(container)
    act(() => parts.button.click())
    return parts
  }

  it('未打开抽屉时只有入口按钮，没有任何目录链接', () => {
    const { container } = render(<MobileCatalog post={post} />)
    const { button } = getParts(container)

    expect(button).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    // 关闭态抽屉内容不挂载 → 无可 Tab 的目录项
    expect(container.querySelectorAll('nav a').length).toBe(0)
    expect(container.querySelector('#proxio-catalog')).toBeNull()
  })

  it('打开抽屉后条目可聚焦、Enter（click）触发跳转', () => {
    const { container } = render(<MobileCatalog post={post} />)
    const { button } = openDrawer(container)
    expect(button.getAttribute('aria-expanded')).toBe('true')

    const links = container.querySelectorAll('nav a')
    expect(links.length).toBe(2)

    links[0].focus()
    expect(document.activeElement).toBe(links[0])

    const target = document.querySelector(`[data-id="${links[1].getAttribute('href').slice(1)}"]`)
    const spy = jest.spyOn(target, 'scrollIntoView')
    act(() => links[1].click())
    expect(spy).toHaveBeenCalled()
  })

  it('点击蒙版收起后，目录项退出 Tab 顺序且焦点回到入口按钮', () => {
    const { container } = render(<MobileCatalog post={post} />)
    const { button, mask } = openDrawer(container)

    const link = container.querySelector('nav a')
    link.focus()
    expect(document.activeElement).toBe(link)

    act(() => mask.click())

    expect(container.querySelectorAll('nav a').length).toBe(0)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)
  })

  it('抽屉内 Enter 跳转后自动收起，焦点回到可见的入口按钮', () => {
    const { container } = render(<MobileCatalog post={post} />)
    const { button } = openDrawer(container)

    const link = container.querySelector('nav a')
    link.focus()
    act(() => link.click())

    expect(container.querySelectorAll('nav a').length).toBe(0)
    expect(document.activeElement).toBe(button)
  })
})
