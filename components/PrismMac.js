import {
  useEffect
  // useState
} from 'react'
import Prism from 'prismjs'
import { useGlobal } from '@/lib/global'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

const PrismMac = () => {
  const { isDarkMode } = useGlobal()
  useEffect(() => {
    const container = document?.getElementById('container')
    const existPreMac = container?.getElementsByClassName('pre-mac')
    const existCodeToolbar = container?.getElementsByClassName('code-toolbar')
    // Remove existCodeToolbar and existPreMac
    Array.from(existPreMac).forEach(item => item.remove())
    Array.from(existCodeToolbar).forEach(item => item.remove())
    const codeBlocks = container?.getElementsByTagName('pre')
    Array.from(codeBlocks).forEach(item => {
      // Add line numbers
      item.classList.add('line-numbers')
      // item.classList.add('show-language')
      item.style.whiteSpace = 'pre-wrap'
      // Add pre-mac element for Mac Style UI
      if (existPreMac.length <= codeBlocks.length) {
        const preMac = document.createElement('div')
        preMac.classList.add('pre-mac')
        preMac.innerHTML = '<span></span><span></span><span></span>'
        item.parentElement.insertBefore(preMac, item)
      }
    })
    Prism.highlightAll()
  }, [isDarkMode])
  return <></>
}

export default PrismMac
