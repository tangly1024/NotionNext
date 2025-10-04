window.addEventListener('load', () => {
  const { algolia } = GLOBAL_CONFIG
  const { appId, apiKey, indexName, hitsPerPage = 5, languages } = algolia

  if (!appId || !apiKey || !indexName) {
    return console.error('Algolia setting is invalid!')
  }

  const $searchMask = document.getElementById('search-mask')
  const $searchDialog = document.querySelector('#algolia-search .search-dialog')

  const animateElements = show => {
    const action = show ? 'animateIn' : 'animateOut'
    const maskAnimation = show ? 'to_show 0.5s' : 'to_hide 0.5s'
    const dialogAnimation = show ? 'titleScale 0.5s' : 'search_close .5s'
    btf[action]($searchMask, maskAnimation)
    btf[action]($searchDialog, dialogAnimation)
  }

  const fixSafariHeight = () => {
    if (window.innerWidth < 768) {
      $searchDialog.style.setProperty('--search-height', `${window.innerHeight}px`)
    }
  }

  const openSearch = () => {
    btf.overflowPaddingR.add()
    animateElements(true)
    showLoading(false)

    setTimeout(() => {
      const searchInput = document.querySelector('#algolia-search-input .ais-SearchBox-input')
      if (searchInput) searchInput.focus()
    }, 100)

    const handleEscape = event => {
      if (event.code === 'Escape') {
        closeSearch()
        document.removeEventListener('keydown', handleEscape)
      }
    }

    document.addEventListener('keydown', handleEscape)
    fixSafariHeight()
    window.addEventListener('resize', fixSafariHeight)
  }

  const closeSearch = () => {
    btf.overflowPaddingR.remove()
    animateElements(false)
    window.removeEventListener('resize', fixSafariHeight)
  }

  const searchClickFn = () => {
    btf.addEventListenerPjax(document.querySelector('#search-button > .search'), 'click', openSearch)
  }

  const searchFnOnce = () => {
    $searchMask.addEventListener('click', closeSearch)
    document.querySelector('#algolia-search .search-close-button').addEventListener('click', closeSearch)
  }

  const cutContent = content => {
    if (!content) return ''

    let contentStr = ''
    if (typeof content === 'string') {
      contentStr = content.trim()
    } else if (typeof content === 'object') {
      if (content.value !== undefined) {
        contentStr = String(content.value).trim()
        if (!contentStr) return ''
      } else if (content.matchedWords || content.matchLevel || content.fullyHighlighted !== undefined) {
        return ''
      } else {
        try {
          contentStr = JSON.stringify(content).trim()
          if (contentStr === '{}' || contentStr === '[]' || contentStr === '""') {
            return ''
          }
        } catch (e) {
          return ''
        }
      }
    } else if (content.toString && typeof content.toString === 'function') {
      contentStr = content.toString().trim()
      if (contentStr === '[object Object]' || contentStr === '[object Array]') {
        return ''
      }
    } else {
      return ''
    }

    const firstOccur = contentStr.indexOf('<mark>')
    let start = firstOccur - 30
    let end = firstOccur + 120
    let pre = ''
    let post = ''

    if (start <= 0) {
      start = 0
      end = 140
    } else {
      pre = '...'
    }

    if (end > contentStr.length) {
      end = contentStr.length
    } else {
      post = '...'
    }

    // Ensure we don't cut off HTML tags in the middle
    let substr = contentStr.substring(start, end)

    // Handle tag completeness
    // Check for incomplete opening tags at the beginning
    const firstCloseBracket = substr.indexOf('>')
    const firstOpenBracket = substr.indexOf('<')

    // If there's a closing bracket but no opening bracket before it, we've cut a tag
    if (firstCloseBracket !== -1 && (firstOpenBracket === -1 || firstCloseBracket < firstOpenBracket)) {
      substr = substr.substring(firstCloseBracket + 1)
    }

    // Check for incomplete closing tags at the end
    const lastOpenBracket = substr.lastIndexOf('<')
    const lastCloseBracket = substr.lastIndexOf('>')

    // If there's an opening bracket after the last closing bracket, we've cut a tag
    if (lastOpenBracket !== -1 && lastOpenBracket > lastCloseBracket) {
      substr = substr.substring(0, lastOpenBracket)
    }

    // Balance tags in the substring
    const tagStack = []
    let balancedStr = ''
    let i = 0

    while (i < substr.length) {
      if (substr[i] === '<') {
        // Check if it's a closing tag
        if (substr[i + 1] === '/') {
          const closeTagEnd = substr.indexOf('>', i)
          if (closeTagEnd !== -1) {
            const closeTagName = substr.substring(i + 2, closeTagEnd)
            // Remove matching opening tag from stack
            for (let j = tagStack.length - 1; j >= 0; j--) {
              if (tagStack[j] === closeTagName) {
                tagStack.splice(j, 1)
                break
              }
            }
            balancedStr += substr.substring(i, closeTagEnd + 1)
            i = closeTagEnd + 1
            continue
          }
        } else if (substr.substr(i, 2) === '<!' || (substr.indexOf('/>', i) !== -1 && substr.indexOf('/>', i) < substr.indexOf('>', i))) {
          const tagEnd = substr.indexOf('>', i)
          if (tagEnd !== -1) {
            balancedStr += substr.substring(i, tagEnd + 1)
            i = tagEnd + 1
            continue
          }
        } else {
          const tagEnd = substr.indexOf('>', i)
          if (tagEnd !== -1) {
            const tagName = substr.substring(i + 1, (substr.indexOf(' ', i) > -1 && substr.indexOf(' ', i) < tagEnd)
              ? substr.indexOf(' ', i)
              : tagEnd).split(/\s/)[0]
            tagStack.push(tagName)
            balancedStr += substr.substring(i, tagEnd + 1)
            i = tagEnd + 1
            continue
          }
        }
      }
      balancedStr += substr[i]
      i++
    }

    // Close any unclosed tags
    while (tagStack.length > 0) {
      const tagName = tagStack.pop()
      balancedStr += `</${tagName}>`
    }

    // If we removed content from the beginning, add prefix
    if (start > 0 || pre) {
      const actualFirstOpenBracket = contentStr.indexOf('<', start > 0 ? start - 30 : 0)
      const actualFirstMark = contentStr.indexOf('<mark>', start > 0 ? start - 30 : 0)

      if (actualFirstOpenBracket !== -1 &&
          (actualFirstMark === -1 || actualFirstOpenBracket < actualFirstMark)) {
        pre = '...'
      }
    }

    substr = balancedStr
    return `${pre}${substr}${post}`
  }

  // Helper function to handle Algolia highlight results
  const extractHighlightValue = highlightObj => {
    if (!highlightObj) return ''

    if (typeof highlightObj === 'string') {
      return highlightObj.trim()
    }

    if (typeof highlightObj === 'object' && highlightObj.value !== undefined) {
      return String(highlightObj.value).trim()
    }

    return ''
  }

  // Initialize Algolia client
  let searchClient

  if (window['algoliasearch/lite'] && typeof window['algoliasearch/lite'].liteClient === 'function') {
    searchClient = window['algoliasearch/lite'].liteClient(appId, apiKey)
  } else if (typeof window.algoliasearch === 'function') {
    searchClient = window.algoliasearch(appId, apiKey)
  } else {
    return console.error('Algolia search client not found!')
  }

  if (!searchClient) {
    return console.error('Failed to initialize Algolia search client')
  }

  // Search state
  let currentQuery = ''

  // Show loading state
  const showLoading = show => {
    const loadingIndicator = document.getElementById('loading-status')
    if (loadingIndicator) {
      loadingIndicator.hidden = !show
    }
  }

  // Cache frequently used elements
  const elements = {
    get searchInput () { return document.querySelector('#algolia-search-input .ais-SearchBox-input') },
    get hits () { return document.getElementById('algolia-hits') },
    get hitsEmpty () { return document.getElementById('algolia-hits-empty') },
    get hitsList () { return document.querySelector('#algolia-hits .ais-Hits-list') },
    get hitsWrapper () { return document.querySelector('#algolia-hits .ais-Hits') },
    get pagination () { return document.getElementById('algolia-pagination') },
    get paginationList () { return document.querySelector('#algolia-pagination .ais-Pagination-list') },
    get stats () { return document.querySelector('#algolia-info .ais-Stats-text') },
  }

  // Show/hide search results area
  const toggleResultsVisibility = hasResults => {
    elements.pagination.style.display = hasResults ? '' : 'none'
    elements.stats.style.display = hasResults ? '' : 'none'
  }

  // Render search results
  const renderHits = (hits, query, page = 0) => {
    if (hits.length === 0 && query) {
      elements.hitsEmpty.textContent = languages.hits_empty.replace(/\$\{query}/, query)
      elements.hitsEmpty.style.display = ''
      elements.hitsWrapper.style.display = 'none'
      elements.stats.style.display = 'none'
      return
    }

    elements.hitsEmpty.style.display = 'none'

    const hitsHTML = hits.map((hit, index) => {
      const itemNumber = page * hitsPerPage + index + 1
      const link = hit.permalink || (GLOBAL_CONFIG.root + hit.path)
      const result = hit._highlightResult || hit

      // Content extraction
      let content = ''
      try {
        if (result.contentStripTruncate) {
          content = cutContent(result.contentStripTruncate)
        } else if (result.contentStrip) {
          content = cutContent(result.contentStrip)
        } else if (result.content) {
          content = cutContent(result.content)
        } else if (hit.contentStripTruncate) {
          content = cutContent(hit.contentStripTruncate)
        } else if (hit.contentStrip) {
          content = cutContent(hit.contentStrip)
        } else if (hit.content) {
          content = cutContent(hit.content)
        }
      } catch (error) {
        content = ''
      }

      // Title handling
      let title = 'no-title'
      try {
        if (result.title) {
          title = extractHighlightValue(result.title) || 'no-title'
        } else if (hit.title) {
          title = extractHighlightValue(hit.title) || 'no-title'
        }

        if (!title || title === 'no-title') {
          if (typeof hit.title === 'string' && hit.title.trim()) {
            title = hit.title.trim()
          } else if (hit.title && typeof hit.title === 'object' && hit.title.value) {
            title = String(hit.title.value).trim() || 'no-title'
          } else {
            title = 'no-title'
          }
        }
      } catch (error) {
        title = 'no-title'
      }

      return `
        <li class="ais-Hits-item" value="${itemNumber}">
          <a href="${link}" class="algolia-hit-item-link">
            <span class="algolia-hits-item-title">${title}</span>
            ${content ? `<div class="algolia-hit-item-content">${content}</div>` : ''}
          </a>
        </li>`
    }).join('')

    elements.hitsList.innerHTML = hitsHTML
    elements.hitsWrapper.style.display = query ? '' : 'none'

    if (hits.length > 0) {
      elements.stats.style.display = ''
    }
  }

  // Render pagination
  const renderPagination = (page, nbPages) => {
    if (nbPages <= 1) {
      elements.pagination.style.display = 'none'
      elements.paginationList.innerHTML = ''
      return
    }

    elements.pagination.style.display = 'block'

    const isFirstPage = page === 0
    const isLastPage = page === nbPages - 1

    // Responsive page display
    const isMobile = window.innerWidth < 768
    const maxVisiblePages = isMobile ? 3 : 5
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(nbPages - 1, startPage + maxVisiblePages - 1)

    // Adjust starting page to maintain max visible pages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    let pagesHTML = ''

    // Only add ellipsis and first page when there are many pages
    if (nbPages > maxVisiblePages && startPage > 0) {
      pagesHTML += `
        <li class="ais-Pagination-item ais-Pagination-item--page">
          <a class="ais-Pagination-link" aria-label="Page 1" href="#" data-page="0">1</a>
        </li>`
      if (startPage > 1) {
        pagesHTML += `
          <li class="ais-Pagination-item ais-Pagination-item--ellipsis">
            <span class="ais-Pagination-link">...</span>
          </li>`
      }
    }

    // Add middle page numbers
    for (let i = startPage; i <= endPage; i++) {
      const isSelected = i === page
      if (isSelected) {
        pagesHTML += `
          <li class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected">
            <span class="ais-Pagination-link" aria-label="Page ${i + 1}">${i + 1}</span>
          </li>`
      } else {
        pagesHTML += `
          <li class="ais-Pagination-item ais-Pagination-item--page">
            <a class="ais-Pagination-link" aria-label="Page ${i + 1}" href="#" data-page="${i}">${i + 1}</a>
          </li>`
      }
    }

    // Only add ellipsis and last page when there are many pages
    if (nbPages > maxVisiblePages && endPage < nbPages - 1) {
      if (endPage < nbPages - 2) {
        pagesHTML += `
          <li class="ais-Pagination-item ais-Pagination-item--ellipsis">
            <span class="ais-Pagination-link">...</span>
          </li>`
      }
      pagesHTML += `
        <li class="ais-Pagination-item ais-Pagination-item--page">
          <a class="ais-Pagination-link" aria-label="Page ${nbPages}" href="#" data-page="${nbPages - 1}">${nbPages}</a>
        </li>`
    }

    if (nbPages > 1) {
      elements.paginationList.innerHTML = `
            <li class="ais-Pagination-item ais-Pagination-item--previousPage ${isFirstPage ? 'ais-Pagination-item--disabled' : ''}">
              ${isFirstPage
                ? '<span class="ais-Pagination-link ais-Pagination-link--disabled" aria-label="Previous Page"><i class="fas fa-angle-left"></i></span>'
                : `<a class="ais-Pagination-link" aria-label="Previous Page" href="#" data-page="${page - 1}"><i class="fas fa-angle-left"></i></a>`
              }
            </li>
            ${pagesHTML}
            <li class="ais-Pagination-item ais-Pagination-item--nextPage ${isLastPage ? 'ais-Pagination-item--disabled' : ''}">
              ${isLastPage
                ? '<span class="ais-Pagination-link ais-Pagination-link--disabled" aria-label="Next Page"><i class="fas fa-angle-right"></i></span>'
                : `<a class="ais-Pagination-link" aria-label="Next Page" href="#" data-page="${page + 1}"><i class="fas fa-angle-right"></i></a>`
              }
            </li>`
      elements.pagination.style.display = currentQuery ? '' : 'none'
    } else {
      elements.pagination.style.display = 'none'
    }
  }

  // Render statistics
  const renderStats = (nbHits, processingTimeMS, query) => {
    if (query) {
      const stats = languages.hits_stats
        .replace(/\$\{hits}/, nbHits)
        .replace(/\$\{time}/, processingTimeMS)
      elements.stats.innerHTML = `<hr>${stats}`
      elements.stats.style.display = ''
    } else {
      elements.stats.style.display = 'none'
    }
  }

  // Perform search
  const performSearch = async (query, page = 0) => {
    if (!query.trim()) {
      currentQuery = ''
      renderHits([], '', 0)
      renderPagination(0, 0)
      renderStats(0, 0, '')
      toggleResultsVisibility(false)
      return
    }

    showLoading(true)
    currentQuery = query

    try {
      let result

      if (searchClient && typeof searchClient.search === 'function') {
        // v5 multi-index search
        const searchResult = await searchClient.search([{
          indexName,
          query,
          params: {
            page,
            hitsPerPage,
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
            attributesToHighlight: ['title', 'content', 'contentStrip', 'contentStripTruncate']
          }
        }])
        result = searchResult.results[0]
      } else if (searchClient && typeof searchClient.initIndex === 'function') {
        // v4 single-index search
        const index = searchClient.initIndex(indexName)
        result = await index.search(query, {
          page,
          hitsPerPage,
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          attributesToHighlight: ['title', 'content', 'contentStrip', 'contentStripTruncate']
        })
      } else {
        throw new Error('Algolia: No compatible search method available')
      }

      renderHits(result.hits || [], query, page)

      const actualNbPages = result.nbHits <= hitsPerPage ? 1 : (result.nbPages || 0)
      renderPagination(page, actualNbPages)
      renderStats(result.nbHits || 0, result.processingTimeMS || 0, query)

      const hasResults = result.hits && result.hits.length > 0
      toggleResultsVisibility(hasResults)

      // Refresh Pjax links
      if (window.pjax) {
        window.pjax.refresh(document.getElementById('algolia-hits'))
      }
    } catch (error) {
      console.error('Algolia search error:', error)
      renderHits([], query, page)
      renderPagination(0, 0)
      renderStats(0, 0, query)
    } finally {
      showLoading(false)
    }
  }

  // Debounced search
  let searchTimeout
  const debouncedSearch = (query, delay = 300) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => performSearch(query), delay)
  }

  // Initialize search box and events
  const initializeSearch = () => {
    showLoading(false)

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', e => {
        const query = e.target.value
        debouncedSearch(query)
      })
    }

    const searchForm = document.querySelector('#algolia-search-input .ais-SearchBox-form')
    if (searchForm) {
      searchForm.addEventListener('submit', e => {
        e.preventDefault()
        const query = elements.searchInput.value
        performSearch(query)
      })
    }

    // Pagination event delegation
    elements.pagination.addEventListener('click', e => {
      e.preventDefault()
      const link = e.target.closest('a[data-page]')
      if (link) {
        const page = parseInt(link.dataset.page, 10)
        if (!isNaN(page) && currentQuery) {
          performSearch(currentQuery, page)
        }
      }
    })

    // Initial state
    toggleResultsVisibility(false)
  }

  // Initialize
  initializeSearch()
  searchClickFn()
  searchFnOnce()

  window.addEventListener('pjax:complete', () => {
    if (!btf.isHidden($searchMask)) closeSearch()
    searchClickFn()
  })
})
