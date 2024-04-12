/* eslint-disable  */
;(function () {
  var baseUrl = 'https://giscus.app'
  var giscusIframe = null

  // 错误日志
  function handleError(a) {
    return '[giscus] An error occurred. Error message: "'.concat(a, '".')
  }
  // 站点元信息
  function getMetaContent(name, includeProperty) {
    void 0 === includeProperty && (includeProperty = !1)
    includeProperty = includeProperty
      ? "meta[property='og:".concat(name, "'],")
      : ''
    return (name = document.querySelector(
      includeProperty + "meta[name='".concat(name, "']")
    ))
      ? name.content
      : ''
  }

  // 渲染
  function render(querySelector) {
    //   const giscusContainer = document.currentScript
    const giscusContainer = document.querySelector(querySelector)
    //   var k = new URL(m.src).origin
    let dataset = new URL(location.href)
    let paramsSession = dataset.searchParams.get('giscus') || ''
    const localStorageSession = localStorage.getItem('giscus-session')
    dataset.searchParams.delete('giscus')
    dataset.hash = ''
    let url = dataset.toString()
    if (paramsSession)
      localStorage.setItem('giscus-session', JSON.stringify(paramsSession)),
        history.replaceState(void 0, document.title, url)
    else if (localStorageSession) {
      try {
        paramsSession = JSON.parse(localStorageSession)
      } catch (a) {
        localStorage.removeItem('giscus-session'),
          console.warn(
            ''.concat(
              handleError(a === null || void 0 === a ? void 0 : a.message),
              ' Session has been cleared.'
            )
          )
      }
    }

    dataset = giscusContainer.dataset
    var params = {}
    params.origin = url
    params.session = paramsSession
    params.theme = dataset.theme
    params.reactionsEnabled = dataset.reactionsEnabled || '1'
    params.emitMetadata = dataset.emitMetadata || '0'
    params.inputPosition = dataset.inputPosition || 'bottom'
    params.repo = dataset.repo
    params.repoId = dataset.repoId
    params.category = dataset.category || ''
    params.categoryId = dataset.categoryId
    params.strict = dataset.strict || '0'
    params.description = getMetaContent('description', !0)
    params.backLink = getMetaContent('giscus:backlink') || url
    switch (dataset.mapping) {
      case 'url':
        params.term = url
        break
      case 'title':
        params.term = document.title
        break
      case 'og:title':
        params.term = getMetaContent('title', !0)
        break
      case 'specific':
        params.term = dataset.term
        break
      case 'number':
        params.number = dataset.term
        break
      default:
        params.term =
          location.pathname.length < 2
            ? 'index'
            : location.pathname.substring(1).replace(/\.\w+$/, '')
    }
    const q =
      (paramsSession = document.querySelector('.giscus')) && paramsSession.id
    q && (params.origin = ''.concat(url, '#').concat(q))
    url = dataset.lang ? '/'.concat(dataset.lang) : ''
    url = ''
      .concat(baseUrl)
      .concat(url, '/widget?')
      .concat(new URLSearchParams(params))
    dataset = dataset.loading === 'lazy' ? 'lazy' : void 0

    // 创建iframe
    giscusIframe = document.createElement('iframe')
    Object.entries({
      class: 'giscus-frame giscus-frame--loading',
      title: 'Comments',
      scrolling: 'no',
      allow: 'clipboard-write',
      src: url,
      loading: dataset
    }).forEach(function (a) {
      const g = a[0]
      return (a = a[1]) && giscusIframe.setAttribute(g, a)
    })
    giscusIframe.style.opacity = '0'
    giscusIframe.addEventListener('load', function () {
      giscusIframe.style.removeProperty('opacity')
      giscusIframe.classList.remove('giscus-frame--loading')
    })
    dataset =
      document.getElementById('giscus-css') || document.createElement('link')
    dataset.id = 'giscus-css'
    dataset.rel = 'stylesheet'
    dataset.href = ''.concat(baseUrl, '/default.css')
    document.head.prepend(dataset)
    if (paramsSession) {
      for (; paramsSession.firstChild; ) paramsSession.firstChild.remove()
      paramsSession.appendChild(giscusIframe)
    } else
      (paramsSession = document.createElement('div')),
        paramsSession.setAttribute('class', 'giscus'),
        paramsSession.appendChild(giscusIframe),
        giscusContainer.insertAdjacentElement('afterend', paramsSession)
  }

  // 处理接收消息
  function handdleMessage(event) {
    if (!giscusIframe) {
      return
    }
    event.origin === baseUrl &&
      ((event = event.data),
      typeof event === 'object' &&
        event.giscus &&
        (event.giscus.resizeHeight &&
          (giscusIframe.style.height = ''.concat(
            event.giscus.resizeHeight,
            'px'
          )),
        event.giscus.signOut
          ? (localStorage.removeItem('giscus-session'),
            console.log(
              '[giscus] User has logged out. Session has been cleared.'
            ),
            p())
          : event.giscus.error &&
            ((event = event.giscus.error),
            event.includes('Bad credentials') ||
            event.includes('Invalid state value') ||
            event.includes('State has expired')
              ? localStorage.getItem('giscus-session') !== null
                ? (localStorage.removeItem('giscus-session'),
                  console.warn(
                    ''.concat(handleError(event), ' Session has been cleared.')
                  ),
                  p())
                : localStorageSession ||
                  console.error(
                    ''
                      .concat(
                        handleError(event),
                        ' No session is stored initially. '
                      )
                      .concat(
                        'Please consider reporting this error at https://github.com/giscus/giscus/issues/new.'
                      )
                  )
              : event.includes('Discussion not found')
                ? console.warn(
                    '[giscus] '.concat(
                      event,
                      '. A new discussion will be created if a comment/reaction is submitted.'
                    )
                  )
                : event.includes('API rate limit exceeded')
                  ? console.warn(handleError(event))
                  : console.error(
                      ''
                        .concat(handleError(event), ' ')
                        .concat(
                          'Please consider reporting this error at https://github.com/giscus/giscus/issues/new.'
                        )
                    ))))
  }

  // 初始化
  function initializeGiscus(querySelector) {
    render(querySelector)
    window.addEventListener('message', handdleMessage)
  }

  // 销毁
  function destroyGiscus() {
    giscusIframe?.remove()
    giscusIframe = null
  }

  // 暴露接口
  window.Giscus = {
    init: initializeGiscus,
    destroy: destroyGiscus
  }
})()
