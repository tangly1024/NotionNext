import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import SearchInput from '@/themes/gitbook/components/SearchInput'

const mockConfig = {}
const mockRouter = { asPath: '/', query: {}, push: jest.fn() }
const mockSetFilteredNavPages = jest.fn()
const mockAllNavPages = [
  { id: 'one', title: 'First article' },
  { id: 'two', title: 'Second article' }
]
let mockSearchModal

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => mockConfig[key] ?? fallback
}))
jest.mock('@/lib/utils', () => ({ deepClone: value => JSON.parse(JSON.stringify(value)) }))
jest.mock('@/lib/global', () => ({ useGlobal: () => ({ tagOptions: [] }) }))
jest.mock('@/themes/gitbook', () => ({
  useGitBookGlobal: () => ({
    searchModal: mockSearchModal,
    setFilteredNavPages: mockSetFilteredNavPages,
    allNavPages: mockAllNavPages
  })
}))
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('algoliasearch', () => () => ({ initIndex: () => ({ search: jest.fn() }) }))
jest.mock('@/components/Mark', () => ({ __esModule: true, default: jest.fn() }))

beforeEach(() => {
  Object.assign(mockConfig, {
    ALGOLIA_APP_ID: 'audit-app',
    ALGOLIA_SEARCH_ONLY_APP_KEY: 'audit-search-key',
    ALGOLIA_INDEX: 'audit-index'
  })
  mockSearchModal = createRef()
})

function renderSearch() {
  return render(<>
    <SearchInput cRef={createRef()} />
    <AlgoliaSearchModal cRef={mockSearchModal} />
  </>)
}

test.each(['ALGOLIA_APP_ID', 'ALGOLIA_SEARCH_ONLY_APP_KEY', 'ALGOLIA_INDEX'])(
  'keeps local input and filtering when %s is missing',
  missingKey => {
    delete mockConfig[missingKey]
    renderSearch()
    const input = screen.getByPlaceholderText('Search')
    act(() => input.focus())
    fireEvent.change(input, { target: { value: 'First' } })
    fireEvent.keyUp(input, { key: 't', keyCode: 84 })
    expect(input).toHaveFocus()
    expect(input).toHaveValue('First')
    expect(mockRouter.push).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.keyUp(input, { key: 'Enter', keyCode: 13 })
    expect(mockSetFilteredNavPages).toHaveBeenLastCalledWith([mockAllNavPages[0]])
    fireEvent.keyUp(input, { key: 'Escape', keyCode: 27 })
    expect(input).toHaveValue('')
    expect(mockSetFilteredNavPages).toHaveBeenLastCalledWith(mockAllNavPages)
    expect(mockRouter.push).not.toHaveBeenCalled()
  }
)

test.each(['button', 'Escape'])('closing Algolia with %s restores the GitBook input without reopening', async closeWith => {
  jest.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  try {
    renderSearch()
    const input = screen.getByPlaceholderText('Search')
    act(() => input.focus())
    act(() => jest.advanceTimersByTime(100))
    const dialog = screen.getByRole('dialog', { name: '搜索' })
    expect(dialog).toContainElement(document.activeElement)
    if (closeWith === 'Escape') {
      await user.keyboard('{Escape}')
    } else {
      await user.click(screen.getByRole('button', { name: '关闭搜索' }))
    }
    expect(input).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    // A later, explicit activation must still work.
    fireEvent.click(screen.getByText('Ctrl+K'))
    expect(screen.getByRole('dialog', { name: '搜索' })).toBeInTheDocument()
    expect(mockRouter.push).not.toHaveBeenCalled()
  } finally {
    jest.clearAllTimers()
    jest.useRealTimers()
  }
})
