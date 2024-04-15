import * as React from 'react'

import * as types from 'notion-types'
import throttle from 'lodash.throttle'
import { getBlockParentPage, getBlockTitle } from 'notion-utils'

import { NotionContextConsumer, NotionContextProvider } from '../context'
import { ClearIcon } from '../icons/clear-icon'
import { LoadingIcon } from '../icons/loading-icon'
import { SearchIcon } from '../icons/search-icon'
import { cs } from '../utils'
import { PageTitle } from './page-title'

export class SearchDialog extends React.Component<{
  isOpen: boolean
  rootBlockId: string
  onClose: () => void
  searchNotion: (params: types.SearchParams) => Promise<types.SearchResults>
}> {
  constructor(props) {
    super(props)
    this._inputRef = React.createRef()
  }

  state = {
    isLoading: false,
    query: '',
    searchResult: null,
    searchError: null
  }

  _inputRef: any
  _search: any

  componentDidMount() {
    this._search = throttle(this._searchImpl.bind(this), 1000)
    this._warmupSearch()
  }

  render() {
    const { isOpen, onClose } = this.props
    const { isLoading, query, searchResult, searchError } = this.state

    const hasQuery = !!query.trim()

    return (
      <NotionContextConsumer>
        {(ctx) => {
          const { components, defaultPageIcon, mapPageUrl } = ctx

          return (
            <components.Modal
              isOpen={isOpen}
              contentLabel='Search'
              className='notion-search'
              overlayClassName='notion-search-overlay'
              onRequestClose={onClose}
              onAfterOpen={this._onAfterOpen}
            >
              <div className='quickFindMenu'>
                <div className='searchBar'>
                  <div className='inlineIcon'>
                    {isLoading ? (
                      <LoadingIcon className='loadingIcon' />
                    ) : (
                      <SearchIcon />
                    )}
                  </div>

                  <input
                    className='searchInput'
                    placeholder='Search'
                    value={query}
                    ref={this._inputRef}
                    onChange={this._onChangeQuery}
                  />

                  {query && (
                    <div
                      role='button'
                      className='clearButton'
                      onClick={this._onClearQuery}
                    >
                      <ClearIcon className='clearIcon' />
                    </div>
                  )}
                </div>

                {hasQuery && searchResult && (
                  <>
                    {searchResult.results.length ? (
                      <NotionContextProvider
                        {...ctx}
                        recordMap={searchResult.recordMap}
                      >
                        <div className='resultsPane'>
                          {searchResult.results.map((result) => (
                            <components.PageLink
                              key={result.id}
                              className={cs('result', 'notion-page-link')}
                              href={mapPageUrl(
                                result.page.id,
                                searchResult.recordMap
                              )}
                            >
                              <PageTitle
                                block={result.page}
                                defaultIcon={defaultPageIcon}
                              />

                              {result.highlight?.html && (
                                <div
                                  className='notion-search-result-highlight'
                                  dangerouslySetInnerHTML={{
                                    __html: result.highlight.html
                                  }}
                                />
                              )}
                            </components.PageLink>
                          ))}
                        </div>

                        <footer className='resultsFooter'>
                          <div>
                            <span className='resultsCount'>
                              {searchResult.total}
                            </span>

                            {searchResult.total === 1 ? ' result' : ' results'}
                          </div>
                        </footer>
                      </NotionContextProvider>
                    ) : (
                      <div className='noResultsPane'>
                        <div className='noResults'>No results</div>
                        <div className='noResultsDetail'>
                          Try different search terms
                        </div>
                      </div>
                    )}
                  </>
                )}

                {hasQuery && !searchResult && searchError && (
                  <div className='noResultsPane'>
                    <div className='noResults'>Search error</div>
                  </div>
                )}
              </div>
            </components.Modal>
          )
        }}
      </NotionContextConsumer>
    )
  }

  _onAfterOpen = () => {
    if (this._inputRef.current) {
      this._inputRef.current.focus()
    }
  }

  _onChangeQuery = (e) => {
    const query = e.target.value
    this.setState({ query })

    if (!query.trim()) {
      this.setState({ isLoading: false, searchResult: null, searchError: null })
      return
    } else {
      this._search()
    }
  }

  _onClearQuery = () => {
    this._onChangeQuery({ target: { value: '' } })
  }

  _warmupSearch = async () => {
    const { searchNotion, rootBlockId } = this.props

    // search is generally implemented as a serverless function wrapping the notion
    // private API, upon opening the search dialog, so we eagerly invoke an empty
    // search in order to warm up the serverless lambda
    await searchNotion({
      query: '',
      ancestorId: rootBlockId
    })
  }

  _searchImpl = async () => {
    const { searchNotion, rootBlockId } = this.props
    const { query } = this.state

    if (!query.trim()) {
      this.setState({ isLoading: false, searchResult: null, searchError: null })
      return
    }

    this.setState({ isLoading: true })
    const result: any = await searchNotion({
      query,
      ancestorId: rootBlockId
    })

    console.log('search', query, result)

    let searchResult: any = null // TODO
    let searchError: types.APIError = null

    if (result.error || result.errorId) {
      searchError = result
    } else {
      searchResult = { ...result }

      const results = searchResult.results
        .map((result: any) => {
          const block = searchResult.recordMap.block[result.id]?.value
          if (!block) return

          const title = getBlockTitle(block, searchResult.recordMap)
          if (!title) {
            return
          }

          result.title = title
          result.block = block
          result.recordMap = searchResult.recordMap
          result.page =
            getBlockParentPage(block, searchResult.recordMap, {
              inclusive: true
            }) || block

          if (!result.page.id) {
            return
          }

          if (result.highlight?.text) {
            result.highlight.html = result.highlight.text
              .replace(/<gzkNfoUU>/gi, '<b>')
              .replace(/<\/gzkNfoUU>/gi, '</b>')
          }

          return result
        })
        .filter(Boolean)

      // dedupe results by page id
      const searchResultsMap = results.reduce(
        (map, result) => ({
          ...map,
          [result.page.id]: result
        }),
        {}
      )
      searchResult.results = Object.values(searchResultsMap)
    }

    if (this.state.query === query) {
      this.setState({ isLoading: false, searchResult, searchError })
    }
  }
}
