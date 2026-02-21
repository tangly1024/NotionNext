import { render, screen } from '@testing-library/react'
import { MenuList } from '@/themes/proxio/components/MenuList'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

jest.mock('@/lib/global', () => ({
  useGlobal: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    asPath: '/',
    pathname: '/'
  }))
}))

jest.mock('@/themes/proxio/components/MenuItem', () => ({
  MenuItem: ({ link }) => <li data-testid='menu-item'>{link?.name}</li>
}))

const setupSiteConfig = ({ customMenuEnabled }) => {
  siteConfig.mockImplementation((key, defaultVal) => {
    if (
      key === 'HEO_MENU_ARCHIVE' ||
      key === 'HEO_MENU_SEARCH' ||
      key === 'HEO_MENU_CATEGORY' ||
      key === 'HEO_MENU_TAG'
    ) {
      return true
    }
    if (key === 'CUSTOM_MENU') {
      return customMenuEnabled
    }
    return defaultVal
  })
}

describe('proxio MenuList', () => {
  beforeEach(() => {
    useGlobal.mockReturnValue({
      locale: {
        NAV: { ARCHIVE: 'Archive', SEARCH: 'Search' },
        COMMON: { CATEGORY: 'Category', TAGS: 'Tags' }
      }
    })
    siteConfig.mockReset()
  })

  it('falls back to default links when CUSTOM_MENU is enabled but customMenu is empty', () => {
    setupSiteConfig({ customMenuEnabled: true })

    render(<MenuList customMenu={[]} />)

    expect(screen.getByText('Archive')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
  })

  it('uses custom menu links when CUSTOM_MENU is enabled and customMenu has items', () => {
    setupSiteConfig({ customMenuEnabled: true })

    render(
      <MenuList customMenu={[{ name: 'Custom Entry', href: '/custom', show: true }]} />
    )

    expect(screen.getByText('Custom Entry')).toBeInTheDocument()
    expect(screen.queryByText('Archive')).not.toBeInTheDocument()
  })

  it('merges customNav with default links when CUSTOM_MENU is disabled', () => {
    setupSiteConfig({ customMenuEnabled: false })

    render(
      <MenuList customNav={[{ name: 'External Nav', href: '/external', show: true }]} />
    )

    expect(screen.getByText('External Nav')).toBeInTheDocument()
    expect(screen.getByText('Archive')).toBeInTheDocument()
  })
})

