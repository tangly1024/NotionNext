import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

/**
 * 评论插件
 * @param issueTerm
 * @param layout
 * @returns {JSX.Element}
 * @constructor
 */
const Utterances = ({ issueTerm, layout }) => {
  useEffect(() => {
    const theme =
      siteConfig('APPEARANCE') === 'auto'
        ? 'preferred-color-scheme'
        : siteConfig('APPEARANCE') === 'light'
          ? 'github-light'
          : 'github-dark'
    const script = document.createElement('script')
    const anchor = document.getElementById('comments')
    script.setAttribute('src', 'https://utteranc.es/client.js')
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', true)
    script.setAttribute('repo', siteConfig('COMMENT_UTTERRANCES_REPO'))
    script.setAttribute('issue-term', 'title')
    script.setAttribute('theme', theme)
    anchor.appendChild(script)
    return () => {
      anchor.innerHTML = ''
    }
  })
  return <div id="comments" className='utterances' >
  </div>
}

export default Utterances
