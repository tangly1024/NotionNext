/* eslint-disable no-useless-escape */
window.CUSDIS = {}
let cusdisIframe

function createIframe(targetElement) {
  if (!cusdisIframe) {
    cusdisIframe = document.createElement('iframe')
    setupIframe(cusdisIframe, targetElement)
  }
  cusdisIframe.srcdoc = generateIframeContent(targetElement)
  cusdisIframe.style.width = '100%'
  cusdisIframe.style.border = '0'
}

function setupIframe(iframe, targetElement) {
  const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const messageHandler = event => {
    try {
      const message = JSON.parse(event.data)
      if (message.from === 'cusdis') {
        switch (message.event) {
          case 'onload':
            if (targetElement.dataset.theme === 'auto') {
              setTheme(colorSchemeMediaQuery.matches ? 'dark' : 'light')
            }
            break
          case 'resize':
            iframe.style.height = message.data + 'px'
            break
        }
      }
    } catch (error) {}
  }

  const colorSchemeChangeHandler = e => {
    const isDarkMode = e.matches
    if (targetElement.dataset.theme === 'auto') {
      setTheme(isDarkMode ? 'dark' : 'light')
    }
  }
  window.addEventListener('message', messageHandler)
  colorSchemeMediaQuery.addEventListener('change', colorSchemeChangeHandler)
}

function generateIframeContent(element) {
  const cusdisHost = element.dataset.host || 'https://cusdis.com'
  const iframeSrc = element.dataset.iframe || `${cusdisHost}/js/iframe.umd.js`
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="${cusdisHost}/js/style.css">
    <base target="_parent" />
    <link>
    <script>
      window.CUSDIS_LOCALE = ${JSON.stringify(window.CUSDIS_LOCALE)}
      window.__DATA__ = ${JSON.stringify(element.dataset)}
    <\/script>
    <style>
      :root {
        color-scheme: light;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${iframeSrc}" type="module">
      
    <\/script>
  </body>
</html>`
}

function setTheme(theme, data) {
  if (cusdisIframe) {
    cusdisIframe.contentWindow.postMessage(JSON.stringify({ from: 'cusdis', event: theme, data: data }))
  }
}

function renderTo(element) {
  if (element) {
    element.innerHTML = ''
    createIframe(element)
    element.appendChild(cusdisIframe)
  }
}

function initialRender() {
  let element
  if (window.cusdisElementId) {
    element = document.querySelector(`#${window.cusdisElementId}`)
  } else if (document.querySelector('#cusdis_thread')) {
    element = document.querySelector('#cusdis_thread')
  } else if (document.querySelector('#cusdis')) {
    console.warn('id `cusdis` is deprecated. Please use `cusdis_thread` instead')
    element = document.querySelector('#cusdis')
  }

  if (!window.CUSDIS_PREVENT_INITIAL_RENDER && element) {
    renderTo(element)
  }
}

window.renderCusdis = renderTo
window.CUSDIS.renderTo = renderTo
window.CUSDIS.setTheme = setTheme
window.CUSDIS.initial = initialRender
initialRender()
