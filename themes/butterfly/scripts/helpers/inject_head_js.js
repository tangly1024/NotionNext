'use strict'

hexo.extend.helper.register('inject_head_js', function () {
  const { darkmode, aside, pjax } = this.theme
  const start = darkmode.start || 6
  const end = darkmode.end || 18
  const { theme_color } = hexo.theme.config
  const themeColorLight = theme_color && theme_color.enable ? theme_color.meta_theme_color_light : '#ffffff'
  const themeColorDark = theme_color && theme_color.enable ? theme_color.meta_theme_color_dark : '#0d0d0d'

  const createCustomJs = () => `
    const saveToLocal = {
      set: (key, value, ttl) => {
        if (!ttl) return
        const expiry = Date.now() + ttl * 86400000
        localStorage.setItem(key, JSON.stringify({ value, expiry }))
      },
      get: key => {
        const itemStr = localStorage.getItem(key)
        if (!itemStr) return undefined
        const { value, expiry } = JSON.parse(itemStr)
        if (Date.now() > expiry) {
          localStorage.removeItem(key)
          return undefined
        }
        return value
      }
    }

    window.btf = {
      saveToLocal,
      getScript: (url, attr = {}) => new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.async = true
        Object.entries(attr).forEach(([key, val]) => script.setAttribute(key, val))
        script.onload = script.onreadystatechange = () => {
          if (!script.readyState || /loaded|complete/.test(script.readyState)) resolve()
        }
        script.onerror = reject
        document.head.appendChild(script)
      }),
      getCSS: (url, id) => new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        if (id) link.id = id
        link.onload = link.onreadystatechange = () => {
          if (!link.readyState || /loaded|complete/.test(link.readyState)) resolve()
        }
        link.onerror = reject
        document.head.appendChild(link)
      }),
      addGlobalFn: (key, fn, name = false, parent = window) => {
        if (!${pjax.enable} && key.startsWith('pjax')) return
        const globalFn = parent.globalFn || {}
        globalFn[key] = globalFn[key] || {}
        globalFn[key][name || Object.keys(globalFn[key]).length] = fn
        parent.globalFn = globalFn
      }
    }
  `

  const createDarkmodeJs = () => {
    if (!darkmode.enable) return ''

    let darkmodeJs = `
      const activateDarkMode = () => {
        document.documentElement.setAttribute('data-theme', 'dark')
        if (document.querySelector('meta[name="theme-color"]') !== null) {
          document.querySelector('meta[name="theme-color"]').setAttribute('content', '${themeColorDark}')
        }
      }
      const activateLightMode = () => {
        document.documentElement.setAttribute('data-theme', 'light')
        if (document.querySelector('meta[name="theme-color"]') !== null) {
          document.querySelector('meta[name="theme-color"]').setAttribute('content', '${themeColorLight}')
        }
      }

      btf.activateDarkMode = activateDarkMode
      btf.activateLightMode = activateLightMode

      const theme = saveToLocal.get('theme')
    `

    switch (darkmode.autoChangeMode) {
      case 1:
        darkmodeJs += `
          const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)')
          const mediaQueryLight = window.matchMedia('(prefers-color-scheme: light)')

          if (theme === undefined) {
            if (mediaQueryLight.matches) activateLightMode()
            else if (mediaQueryDark.matches) activateDarkMode()
            else {
              const hour = new Date().getHours()
              const isNight = hour <= ${start} || hour >= ${end}
              isNight ? activateDarkMode() : activateLightMode()
            }
            mediaQueryDark.addEventListener('change', () => {
              if (saveToLocal.get('theme') === undefined) {
                e.matches ? activateDarkMode() : activateLightMode()
              }
            })
          } else {
            theme === 'light' ? activateLightMode() : activateDarkMode()
          }
        `
        break
      case 2:
        darkmodeJs += `
          const hour = new Date().getHours()
          const isNight = hour <= ${start} || hour >= ${end}
          if (theme === undefined) isNight ? activateDarkMode() : activateLightMode()
          else theme === 'light' ? activateLightMode() : activateDarkMode()
        `
        break
      default:
        darkmodeJs += `
          theme === 'dark' ? activateDarkMode() : theme === 'light' ? activateLightMode() : null
        `
    }

    return darkmodeJs
  }

  const createAsideStatusJs = () => {
    if (!aside.enable || !aside.button) return ''
    return `
      const asideStatus = saveToLocal.get('aside-status')
      if (asideStatus !== undefined) {
        document.documentElement.classList.toggle('hide-aside', asideStatus === 'hide')
      }
    `
  }

  const createDetectAppleJs = () => `
    const detectApple = () => {
      if (/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)) {
        document.documentElement.classList.add('apple')
      }
    }
    detectApple()
  `

  return `<script>
    (() => {
      ${createCustomJs()}
      ${createDarkmodeJs()}
      ${createAsideStatusJs()}
      ${createDetectAppleJs()}
    })()
  </script>`
})
