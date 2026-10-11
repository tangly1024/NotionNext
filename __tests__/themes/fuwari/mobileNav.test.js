/**
 * fuwari MobileNav 回归测试
 *
 * 背景：FUWARI_MOBILE_MENU 的条件返回曾位于 useState/useRef 与 useEffect
 * 之间——同一组件两次渲染的 Hooks 数量不同（2 个 state + ref → 0），
 * 违反 React Hooks 规则。在主题控制台切换「Mobile菜单」开关触发重渲染时，
 * React 抛出 "Rendered more hooks than during the previous render"，
 * ErrorBoundary 显示 Something went wrong。
 * 修复：条件返回移到所有 Hooks 之后。
 */
import { render } from '@testing-library/react'
import React from 'react'
import MobileNav from '@/themes/fuwari/components/MobileNav'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: {} })
}))

jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ children, ...rest }) => <a {...rest}>{children}</a>
}))

jest.mock('@/themes/fuwari/components/menu', () => ({
  getFuwariMenuLinks: () => [
    { id: 'home', name: '首页', href: '/' },
    { id: 'archive', name: '归档', href: '/archive' }
  ]
}))

const { siteConfig } = require('@/lib/config')

describe('fuwari MobileNav：FUWARI_MOBILE_MENU 开关切换不违反 Hooks 规则', () => {
  beforeEach(() => {
    siteConfig.mockReset()
    siteConfig.mockImplementation((key, defaultVal) =>
      key === 'FUWARI_MOBILE_MENU' ? true : defaultVal
    )
  })

  it('开关开启时渲染菜单按钮与链接', () => {
    const { container } = render(
      <MobileNav locale={{}} customNav={[]} customMenu={[]} />
    )
    expect(container.querySelector('button[aria-label="Open Menu"]')).not.toBeNull()
    // 菜单面板默认收起（open=false），仅渲染入口按钮
    expect(container.querySelector('nav')).toBeNull()
  })

  it('开关关闭时返回 null，但 Hooks 调用序列保持一致（重渲染不崩溃）', () => {
    // 先以开启态挂载（建立 Hooks 基线），再以关闭态重渲染同一组件位置。
    // 修复前：关闭态提前 return null，Hooks 数 3 → 0，React 抛错。
    const { container, rerender } = render(
      <MobileNav locale={{}} customNav={[]} customMenu={[]} />
    )
    expect(container.querySelector('button[aria-label="Open Menu"]')).not.toBeNull()

    siteConfig.mockImplementation((key, defaultVal) =>
      key === 'FUWARI_MOBILE_MENU' ? false : defaultVal
    )
    rerender(<MobileNav locale={{}} customNav={[]} customMenu={[]} />)

    expect(container.querySelector('button[aria-label="Open Menu"]')).toBeNull()
    expect(container.textContent).toBe('')
  })
})
