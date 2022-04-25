import { useEffect } from 'react'
import Prism from 'prismjs'

const PrismMac = () => {
  useEffect(() => {
    const container = document?.getElementById('container')
    const codeBlocks = container?.getElementsByTagName('pre')
    const existPreMac = container?.getElementsByClassName('pre-mac')
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
    // console.log(codeBlocks)
    // $("pre").before('<div class="pre-mac"><span></span><span></span><span></span></div>');
    // }
  }, [])
  return <></>
}

export default PrismMac
