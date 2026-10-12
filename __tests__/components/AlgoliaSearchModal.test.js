import { act, fireEvent, render, screen } from '@testing-library/react'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { createRef } from 'react'

const mockSearch = jest.fn()
jest.mock('algoliasearch', () => () => ({
  initIndex: () => ({ search: mockSearch })
}))
jest.mock('@/lib/config', () => ({
  siteConfig: key => mockConfig[key]
}))
const mockConfig = {
  ALGOLIA_APP_ID: 'audit-app',
  ALGOLIA_SEARCH_ONLY_APP_KEY: 'audit-search-key',
  ALGOLIA_INDEX: 'audit-index'
}
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    tagOptions: [],
    locale: { PAGINATION: { NEXT: 'Next', PREV: 'Prev' } }
  })
}))
jest.mock('@/components/Mark', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
const mockRouter = { query: {}, push: jest.fn(), events: { on() {}, off() {} } }

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

afterEach(() => {
  jest.clearAllTimers()
  jest.useRealTimers()
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
  await act(async () => {
    jest.advanceTimersByTime(1000)
  })
  fireEvent.change(input, { target: { value: 'second' } })
  await act(async () => {
    jest.advanceTimersByTime(1000)
  })
  expect(mockSearch).toHaveBeenCalledTimes(2)
  await act(async () => {
    second.resolve(result('LATEST_RESULT'))
  })
  expect(screen.getByText('LATEST_RESULT')).toBeInTheDocument()
  await act(async () => {
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
  await act(async () => {
    jest.advanceTimersByTime(700)
  })
  fireEvent.change(input, { target: { value: '' } })
  await act(async () => {
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
  await act(async () => {
    jest.advanceTimersByTime(700)
  })
  expect(screen.getByRole('alert')).toHaveTextContent('搜索暂时不可用')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
  })
  expect(screen.getByText('RETRIED_RESULT')).toBeInTheDocument()
})
