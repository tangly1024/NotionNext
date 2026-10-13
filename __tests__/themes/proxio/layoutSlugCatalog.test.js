/**
 * Proxio LayoutSlug 目录显示回归测试
 *
 * 背景：服务端已生成 post.toc，目录有数据不代表文章已解锁——
 * 锁定文章在未输入密码时桌面目录与移动端目录仍渲染，泄露正文标题。
 * 修复：LayoutSlug 用统一的 showCatalog = !lock && 开关 && 有目录 收口
 * 正文收窄、桌面 aside、移动端 MobileCatalog 三处条件。
 */
import { render } from '@testing-library/react'
import React from 'react'

const mockUseRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: {} })
}))

jest.mock('@/themes/proxio/components/Catalog', () => ({
  __esModule: true,
  default: () => <nav data-testid='catalog' />
}))
jest.mock('@/themes/proxio/components/MobileCatalog', () => ({
  __esModule: true,
  default: () => <div data-testid='mobile-catalog' />
}))
jest.mock('@/themes/proxio/components/ArticleLock', () => ({
  ArticleLock: () => <div data-testid='article-lock' />
}))
jest.mock('@/themes/proxio/style', () => ({ Style: () => null }))
jest.mock('@/components/Loading', () => ({ __esModule: true, default: () => null }))
jest.mock('@/themes/proxio/components/LoadingCover', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/NotionPage', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/Comment', () => ({ __esModule: true, default: () => null }))
jest.mock('@/components/ShareBar', () => ({ __esModule: true, default: () => null }))
jest.mock('@/themes/proxio/components/Banner', () => ({
  Banner: () => null
}))
jest.mock('@/themes/proxio/components/Hero', () => ({ __esModule: true, default: () => null }))
jest.mock('@/themes/proxio/components/Blog', () => ({ __esModule: true, default: () => null }))

const post = { toc: [{ id: 'h1', text: '标题', indentLevel: 0 }] }

const renderSlug = (over = {}) => {
  const { LayoutSlug } = require('@/themes/proxio/index')
  return render(
    <LayoutSlug post={post} lock={false} validPassword={false} {...over} />
  )
}

const { siteConfig } = require('@/lib/config')

const catalogEnabled = impl => {
  siteConfig.mockReset()
  siteConfig.mockImplementation((key, defaultVal) =>
    key === 'PROXIO_POST_CATALOG_ENABLE' ? true : defaultVal
  )
  if (impl) impl()
}

describe('Proxio LayoutSlug：目录显示统一按 lock 控制', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({ route: '/article/[slug]', asPath: '/article/x' })
    catalogEnabled()
  })

  it('锁定文章：两端目录都不渲染、正文保持全宽，仅显示密码框', () => {
    const { container, queryByTestId, getByTestId } = renderSlug({ lock: true })

    expect(getByTestId('article-lock')).not.toBeNull()
    expect(queryByTestId('catalog')).toBeNull()
    expect(queryByTestId('mobile-catalog')).toBeNull()
    expect(container.querySelector('#container-inner').className).not.toContain(
      'xl:w-[calc(100%-16rem)]'
    )
  })

  it('解锁且有目录：目录两端正常显示、正文收窄', () => {
    const { container, getByTestId } = renderSlug({ lock: false })

    expect(getByTestId('catalog')).not.toBeNull()
    expect(getByTestId('mobile-catalog')).not.toBeNull()
    expect(container.querySelector('#container-inner').className).toContain(
      'xl:w-[calc(100%-16rem)]'
    )
  })

  it('关闭目录配置：不渲染目录、正文保持全宽（即使未锁定）', () => {
    siteConfig.mockReset()
    siteConfig.mockImplementation((key, defaultVal) => defaultVal)
    const { container, queryByTestId } = renderSlug({ lock: false })

    expect(queryByTestId('catalog')).toBeNull()
    expect(queryByTestId('mobile-catalog')).toBeNull()
    expect(container.querySelector('#container-inner').className).not.toContain(
      'xl:w-[calc(100%-16rem)]'
    )
  })

  it('目录为空：不渲染目录、正文保持全宽', () => {
    const { container, queryByTestId } = render(
      React.createElement(require('@/themes/proxio/index').LayoutSlug, {
        post: { toc: [] },
        lock: false,
        validPassword: false
      })
    )

    expect(queryByTestId('catalog')).toBeNull()
    expect(queryByTestId('mobile-catalog')).toBeNull()
    expect(container.querySelector('#container-inner').className).not.toContain(
      'xl:w-[calc(100%-16rem)]'
    )
  })
})
