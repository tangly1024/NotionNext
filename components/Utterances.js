import BLOG from '@/blog.config'
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
      BLOG.APPEARANCE === 'auto'
        ? 'preferred-color-scheme'
        : BLOG.APPEARANCE === 'light'
          ? 'github-light'
          : 'github-dark'
    const script = document.createElement('script')
    const anchor = document.getElementById('comments')
    script.setAttribute('src', 'https://utteranc.es/client.js')
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', true)
    script.setAttribute('repo', BLOG.COMMENT_UTTERRANCES_REPO)
    script.setAttribute('issue-term', issueTerm)
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
