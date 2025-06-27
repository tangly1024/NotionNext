import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * gitalk评论插件
 * @param {*} param0
 * @returns
 */
const Gitalk = ({ frontMatter }) => {
  const gitalkCSSCDN = siteConfig('COMMENT_GITALK_CSS_CDN_URL')
  const gitalkJSCDN = siteConfig('COMMENT_GITALK_JS_CDN_URL')
  const clientId = siteConfig('COMMENT_GITALK_CLIENT_ID')
  const clientSecret = siteConfig('COMMENT_GITALK_CLIENT_SECRET')
  const repo = siteConfig('COMMENT_GITALK_REPO')
  const owner = siteConfig('COMMENT_GITALK_OWNER')
  const admin = siteConfig('COMMENT_GITALK_ADMIN').split(',')
  const distractionFreeMode = siteConfig('COMMENT_GITALK_DISTRACTION_FREE_MODE')

  const loadGitalk = async() => {
    await loadExternalResource(gitalkCSSCDN, 'css')
    await loadExternalResource(gitalkJSCDN, 'js')
    const Gitalk = window.Gitalk
    if (!Gitalk) {
      // 可以加入延时重试
      console.warn('Gitalk 初始化失败')
      return
    }
    const gitalk = new Gitalk({
      clientID: clientId,
      clientSecret: clientSecret,
      repo: repo,
      owner: owner,
      admin: admin,
      id: frontMatter.id, // Ensure uniqueness and length less than 50
      distractionFreeMode: distractionFreeMode // Facebook-like distraction free mode
    })

    gitalk.render('gitalk-container')
  }

  useEffect(() => {
    loadGitalk()
  }, [])

  return <div id="gitalk-container"></div>
}

export default Gitalk
