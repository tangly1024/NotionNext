import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import replaceSearchResult from '@/components/Mark'
import React, { createRef } from 'react'

const mockSearch = jest.fn()
jest.mock('algoliasearch', () => () => ({
  initIndex: () => ({ search: mockSearch })
}))
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => mockConfig[key] ?? fallback
}))
const mockConfig = {
  ALGOLIA_APP_ID: 'audit-app',
  ALGOLIA_SEARCH_ONLY_APP_KEY: 'audit-search-key',
  ALGOLIA_INDEX: 'audit-index'
}
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    tagOptions: mockTagOptions,
    locale: { PAGINATION: { NEXT: 'Next', PREV: 'Prev' } }
  })
}))
let mockTagOptions = []
jest.mock('@/components/Mark', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
const mockRouter = {
  asPath: '/',
  query: {},
  push: jest.fn(),
  events: { on() {}, off() {} }
}

function flushUpdates(callback) {
  return act(() => Promise.resolve(callback()))
}

function deferred() {
  let resolve
  const promise = new Promise(r => {
    resolve = r
  })
  return { promise, resolve }
}
function result(title) {
  return {
    hits: [{ objectID: title, title, slug: title }],
    nbHits: 1,
    nbPages: 1,
    processingTimeMS: 1
  }
}

beforeEach(() => {
  mockSearch.mockReset()
  mockTagOptions = []
  mockRouter.asPath = '/'
  Object.assign(mockConfig, {
    ALGOLIA_APP_ID: 'audit-app',
    ALGOLIA_SEARCH_ONLY_APP_KEY: 'audit-search-key',
    ALGOLIA_INDEX: 'audit-index'
  })
})

afterEach(() => {
  jest.clearAllTimers()
  jest.useRealTimers()
})

test('leaves Ctrl+K available to local search when Algolia is not configured', () => {
  delete mockConfig.ALGOLIA_APP_ID
  delete mockConfig.ALGOLIA_SEARCH_ONLY_APP_KEY
  delete mockConfig.ALGOLIA_INDEX
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  expect(
    fireEvent.keyDown(document, { key: 'k', code: 'KeyK', ctrlKey: true })
  ).toBe(true)
  fireEvent.keyUp(document, { key: 'k', code: 'KeyK', ctrlKey: true })
  act(() => ref.current.openSearch())
  expect(mockRouter.push).not.toHaveBeenCalled()
  expect(mockSearch).not.toHaveBeenCalled()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('Ctrl+K falls back to site search when Algolia is enabled but incomplete', () => {
  delete mockConfig.ALGOLIA_SEARCH_ONLY_APP_KEY
  render(<AlgoliaSearchModal cRef={createRef()} />)
  fireEvent.keyDown(document, { key: 'k', code: 'KeyK', ctrlKey: true })
  fireEvent.keyUp(document, { key: 'k', code: 'KeyK', ctrlKey: true })
  expect(mockRouter.push).toHaveBeenCalledWith('/search')
})

test('falls back to site search when an Algolia key is missing', () => {
  const key = mockConfig.ALGOLIA_SEARCH_ONLY_APP_KEY
  delete mockConfig.ALGOLIA_SEARCH_ONLY_APP_KEY
  try {
    const ref = createRef()
    render(<AlgoliaSearchModal cRef={ref} />)
    act(() => ref.current.openSearch())
    expect(mockRouter.push).toHaveBeenCalledWith('/search')
    expect(mockSearch).not.toHaveBeenCalled()
  } finally {
    mockConfig.ALGOLIA_SEARCH_ONLY_APP_KEY = key
  }
})

test('keeps the latest keyword results when older requests finish last', async () => {
  jest.useFakeTimers()
  const first = deferred()
  const second = deferred()
  mockSearch.mockImplementation(query =>
    query === 'first' ? first.promise : second.promise
  )
  const ref = createRef()
  const { unmount } = render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  const input = screen.getByPlaceholderText('在这里输入搜索关键词...')
  fireEvent.change(input, { target: { value: 'first' } })
  await flushUpdates(() => {
    jest.advanceTimersByTime(1000)
  })
  fireEvent.change(input, { target: { value: 'second' } })
  await flushUpdates(() => {
    jest.advanceTimersByTime(1000)
  })
  expect(mockSearch).toHaveBeenCalledTimes(2)
  await flushUpdates(() => {
    second.resolve(result('LATEST_RESULT'))
  })
  expect(screen.getByText('LATEST_RESULT')).toBeInTheDocument()
  await flushUpdates(() => {
    first.resolve(result('STALE_RESULT'))
  })
  expect(input.value).toBe('second')
  expect(screen.queryByText('STALE_RESULT')).not.toBeInTheDocument()
  expect(screen.getByText('LATEST_RESULT')).toBeInTheDocument()
  unmount()
  jest.clearAllTimers()
  jest.useRealTimers()
})

test('invalidates pending results immediately when input is cleared', async () => {
  jest.useFakeTimers()
  const pending = deferred()
  mockSearch.mockReturnValue(pending.promise)
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  const input = screen.getByPlaceholderText('在这里输入搜索关键词...')
  fireEvent.change(input, { target: { value: 'first' } })
  await flushUpdates(() => {
    jest.advanceTimersByTime(700)
  })
  fireEvent.change(input, { target: { value: '' } })
  await flushUpdates(() => {
    pending.resolve(result('STALE_RESULT'))
  })
  expect(screen.queryByText('STALE_RESULT')).not.toBeInTheDocument()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

test('shows a retryable error instead of claiming no results on search failure', async () => {
  jest.useFakeTimers()
  mockSearch
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(result('RETRIED_RESULT'))
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  fireEvent.change(screen.getByPlaceholderText('在这里输入搜索关键词...'), {
    target: { value: 'first' }
  })
  await flushUpdates(() => {
    jest.advanceTimersByTime(700)
  })
  expect(screen.getByRole('alert')).toHaveTextContent('搜索暂时不可用')
  await flushUpdates(() => {
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
  })
  expect(screen.getByText('RETRIED_RESULT')).toBeInTheDocument()
})

test('Ctrl+K opens search, arrows select results and Enter opens the selection', async () => {
  jest.useFakeTimers()
  mockSearch.mockResolvedValue({
    ...result('FIRST'),
    hits: [
      { objectID: 'first', title: 'FIRST', slug: 'first' },
      { objectID: 'second', title: 'SECOND', slug: 'second' }
    ],
    nbHits: 2
  })
  const originalLocation = window.location
  delete window.location
  window.location = { href: '' }
  try {
    render(<AlgoliaSearchModal cRef={createRef()} />)
    fireEvent.keyDown(document, { key: 'k', code: 'KeyK', ctrlKey: true })
    fireEvent.keyUp(document, { key: 'k', code: 'KeyK', ctrlKey: true })
    await flushUpdates(() => jest.advanceTimersByTime(100))
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
    fireEvent.change(input, { target: { value: 'query' } })
    await flushUpdates(() => jest.advanceTimersByTime(600))
    const first = screen.getByText('FIRST').closest('li')
    const second = screen.getByText('SECOND').closest('li')
    const press = (key, code) => {
      fireEvent.keyDown(input, { key, code })
      fireEvent.keyUp(input, { key, code })
    }
    expect(first).toHaveClass('bg-blue-600')
    press('ArrowDown', 'ArrowDown')
    expect(second).toHaveClass('bg-blue-600')
    press('ArrowDown', 'ArrowDown')
    expect(second).toHaveClass('bg-blue-600')
    press('ArrowUp', 'ArrowUp')
    expect(first).toHaveClass('bg-blue-600')
    press('ArrowUp', 'ArrowUp')
    expect(first).toHaveClass('bg-blue-600')
    press('ArrowDown', 'ArrowDown')
    press('Enter', 'Enter')
    expect(window.location.href).toBe('/second')
  } finally {
    window.location = originalLocation
  }
})

test('Escape closes the modal and discards a pending search', async () => {
  jest.useFakeTimers()
  const pending = deferred()
  mockSearch.mockReturnValue(pending.promise)
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'query' } })
  await flushUpdates(() => jest.advanceTimersByTime(700))
  fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' })
  fireEvent.keyUp(input, { key: 'Escape', code: 'Escape' })
  expect(document.getElementById('search-wrapper')).toHaveClass('invisible')
  await flushUpdates(() => pending.resolve(result('STALE_RESULT')))
  act(() => ref.current.openSearch())
  expect(input).toHaveValue('')
  expect(screen.queryByText('STALE_RESULT')).not.toBeInTheDocument()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

test.each(['关闭搜索', 'topic', '第 2 页'])(
  'Escape closes search while %s has focus and restores the opener',
  async name => {
    jest.useFakeTimers()
    mockTagOptions = [{ name: 'topic' }]
    mockSearch.mockResolvedValue({ ...result('RESULT'), nbPages: 2 })
    const ref = createRef()
    render(<><button>Open search</button><AlgoliaSearchModal cRef={ref} /></>)
    const opener = screen.getByRole('button', { name: 'Open search' })
    act(() => opener.focus())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    act(() => ref.current.openSearch())
    expect(screen.getByRole('dialog', { name: '搜索' })).toHaveAttribute('aria-modal', 'true')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'query' } })
    await flushUpdates(() => jest.advanceTimersByTime(700))
    const target = screen.getByRole(name === 'topic' ? 'link' : 'button', { name })
    act(() => target.focus())
    expect(target).toHaveFocus()
    fireEvent.keyDown(target, { key: 'Escape', code: 'Escape' })
    fireEvent.keyUp(target, { key: 'Escape', code: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  }
)

test('Escape also closes search from the retry button', async () => {
  jest.useFakeTimers()
  mockSearch.mockRejectedValue(new Error('offline'))
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'query' } })
  await flushUpdates(() => jest.advanceTimersByTime(700))
  const retry = screen.getByRole('button', { name: '重试' })
  act(() => retry.focus())
  fireEvent.keyDown(retry, { key: 'Escape', code: 'Escape' })
  fireEvent.keyUp(retry, { key: 'Escape', code: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.getElementById('search-wrapper')).toHaveClass('invisible')
})

test('Tab stays inside search, includes new results, and releases focus after closing', async () => {
  jest.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  mockTagOptions = [{ name: 'topic' }]
  mockSearch.mockResolvedValue({ ...result('RESULT'), nbPages: 2 })
  const ref = createRef()
  render(<><button>Open search</button><button>Outside</button><AlgoliaSearchModal cRef={ref} /></>)
  const opener = screen.getByRole('button', { name: 'Open search' })
  const outside = screen.getByRole('button', { name: 'Outside' })
  act(() => opener.focus())
  act(() => ref.current.openSearch())
  await flushUpdates(() => jest.advanceTimersByTime(100))
  const input = screen.getByRole('textbox')
  const close = screen.getByRole('button', { name: '关闭搜索' })
  expect(input).toHaveFocus()
  await user.tab({ shift: true })
  expect(close).toHaveFocus()
  await user.tab({ shift: true })
  expect(screen.getByRole('link', { name: 'topic' })).toHaveFocus()
  await user.tab()
  expect(close).toHaveFocus()
  await user.tab()
  expect(input).toHaveFocus()
  fireEvent.change(input, { target: { value: 'query' } })
  await flushUpdates(() => jest.advanceTimersByTime(600))
  await user.tab()
  expect(screen.getByRole('link', { name: 'topic' })).toHaveFocus()
  await user.tab()
  expect(screen.getByRole('link', { name: 'RESULT' })).toHaveFocus()
  await user.tab()
  expect(screen.getByRole('button', { name: '第 1 页' })).toHaveFocus()
  await user.tab()
  expect(screen.getByRole('button', { name: '第 2 页' })).toHaveFocus()
  await user.tab()
  expect(close).toHaveFocus()
  act(() => outside.focus())
  expect(input).toHaveFocus()
  await user.click(close)
  expect(opener).toHaveFocus()
  await user.tab()
  expect(outside).toHaveFocus()
  expect(document.getElementById('search-wrapper')).toHaveAttribute('inert')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(input).not.toHaveFocus()
})

test('changing the index invalidates pending results without losing the focus return target', async () => {
  jest.useFakeTimers()
  const pending = deferred()
  mockSearch.mockReturnValue(pending.promise)
  const ref = createRef()
  const view = <><button>Open search</button><AlgoliaSearchModal cRef={ref} /></>
  const { rerender } = render(view)
  const opener = screen.getByRole('button', { name: 'Open search' })
  act(() => opener.focus())
  act(() => ref.current.openSearch())
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'query' } })
  await flushUpdates(() => jest.advanceTimersByTime(600))
  mockConfig.ALGOLIA_INDEX = 'another-index'
  rerender(<><button>Open search</button><AlgoliaSearchModal cRef={ref} /></>)
  await flushUpdates(() => pending.resolve(result('STALE_RESULT')))
  expect(screen.queryByText('STALE_RESULT')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '关闭搜索' }))
  expect(opener).toHaveFocus()
})

test.each(['route', 'configuration', 'unmount'])(
  'restores and releases focus when search closes because of %s',
  reason => {
    const ref = createRef()
    const view = showModal => <>
      <button>Open search</button><button>Outside</button>
      {showModal && <AlgoliaSearchModal cRef={ref} />}
    </>
    const { rerender } = render(view(true))
    const opener = screen.getByRole('button', { name: 'Open search' })
    const outside = screen.getByRole('button', { name: 'Outside' })
    act(() => opener.focus())
    act(() => ref.current.openSearch())
    expect(screen.getByRole('textbox')).toHaveFocus()
    if (reason === 'route') mockRouter.asPath = '/another-page'
    if (reason === 'configuration') delete mockConfig.ALGOLIA_INDEX
    rerender(view(reason !== 'unmount'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    act(() => outside.focus())
    expect(outside).toHaveFocus()
    if (reason === 'configuration') {
      mockConfig.ALGOLIA_INDEX = 'restored-index'
      rerender(view(true))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(outside).toHaveFocus()
    }
  }
)

test('fetches the selected page using the current keyword', async () => {
  jest.useFakeTimers()
  mockSearch
    .mockResolvedValueOnce({ ...result('PAGE_ONE'), nbPages: 2 })
    .mockResolvedValueOnce({ ...result('PAGE_TWO'), nbPages: 2 })
  const ref = createRef()
  render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'query' }
  })
  await flushUpdates(() => jest.advanceTimersByTime(700))
  await flushUpdates(() => fireEvent.click(screen.getByText('2')))
  expect(mockSearch).toHaveBeenLastCalledWith('query', {
    page: 1,
    hitsPerPage: 10
  })
  expect(screen.getByText('PAGE_TWO')).toBeInTheDocument()
  expect(screen.queryByText('PAGE_ONE')).not.toBeInTheDocument()
})

test('route changes close the modal and invalidate pending results', async () => {
  jest.useFakeTimers()
  const pending = deferred()
  mockSearch.mockReturnValue(pending.promise)
  const ref = createRef()
  const { rerender } = render(<AlgoliaSearchModal cRef={ref} />)
  act(() => ref.current.openSearch())
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'query' }
  })
  await flushUpdates(() => jest.advanceTimersByTime(700))
  mockRouter.asPath = '/another-page'
  rerender(<AlgoliaSearchModal cRef={ref} />)
  expect(document.getElementById('search-wrapper')).toHaveClass('invisible')
  await flushUpdates(() => pending.resolve(result('STALE_RESULT')))
  expect(screen.queryByText('STALE_RESULT')).not.toBeInTheDocument()
  expect(screen.getByRole('textbox', { hidden: true })).toHaveValue('')
})

test('does not update state or highlight results after unmount', async () => {
  jest.useFakeTimers()
  const pending = deferred()
  const setters = []
  const useState = React.useState
  const stateSpy = jest.spyOn(React, 'useState').mockImplementation(initial => {
    const [state, setState] = useState(initial)
    const setter = jest.fn(setState)
    setters.push(setter)
    return [state, setter]
  })
  try {
    mockSearch.mockReturnValue(pending.promise)
    const ref = createRef()
    const { unmount } = render(<AlgoliaSearchModal cRef={ref} />)
    act(() => ref.current.openSearch())
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'query' }
    })
    await flushUpdates(() => jest.advanceTimersByTime(700))
    unmount()
    expect(setters.length).toBeGreaterThan(0)
    setters.forEach(setter => setter.mockClear())
    await flushUpdates(() => pending.resolve(result('STALE_RESULT')))
    act(() => jest.runOnlyPendingTimers())
    setters.forEach(setter => expect(setter).not.toHaveBeenCalled())
    expect(replaceSearchResult).not.toHaveBeenCalled()
  } finally {
    stateSpy.mockRestore()
  }
})
