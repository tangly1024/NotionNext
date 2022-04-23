import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import 'gitalk/dist/gitalk.css'
import Tabs from '@/components/Tabs'
import { ReactCusdis } from 'react-cusdis'
import { useGlobal } from '@/lib/global'
// import Disqus from './Disqus'

const GitalkComponent = dynamic(
  () => {
    return import('gitalk/dist/gitalk-component')
  },
  { ssr: false }
)
const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Utterances')
  },
  { ssr: false }
)
const GiscusComponent = dynamic(
  () => {
    return import('@/components/Giscus')
  },
  { ssr: false }
)

const FacbookCommentComponent = dynamic(
  () => {
    return import('@/components/FacebookComment')
  },
  { ssr: false }
)

const DisqusCommentComponent = dynamic(
  () => {
    return import('@/components/Disqus')
  },
  { ssr: false }
)

const Comment = ({ frontMatter }) => {
  const router = useRouter()
  const { locale, isDarkMode } = useGlobal()
  return (
    <div id="comment" className="comment mt-5 text-gray-800 dark:text-gray-300">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>留言區</h1>
      <p>
        <br />
        如果你想使用 Facebook, Google, Twitter 帳號留言，或是匿名分享，可以使用
        Disqus 留言。
        <br /> 擁有 Facebook 帳號的朋友可以使用 Facbook 原生社群插件留言。
        <br /> 若是有 Github 帳號可以使用 Giscus 留言！
      </p>
      <br />
      <Tabs>
        {BLOG.COMMENT_DISQUS_SHORTNAME && (
          <div key="Disqus">
            <DisqusCommentComponent
              id={frontMatter.id}
              title={frontMatter.title}
              url={BLOG.LINK + router.asPath}
            />
          </div>
        )}
        {BLOG.FACEBOOK_APP_ID && (
          <div key="Facebook">
            <FacbookCommentComponent isDarkMode={isDarkMode} />
          </div>
        )}
        {BLOG.COMMENT_GISCUS_REPO && (
          <div key="Giscus">
            <GiscusComponent isDarkMode={isDarkMode} className="px-2" />
          </div>
        )}

        {BLOG.COMMENT_GITALK_CLIENT_ID && (
          <div key="GitTalk">
            <GitalkComponent
              options={{
                id: frontMatter.id,
                title: frontMatter.title,
                clientID: BLOG.COMMENT_GITALK_CLIENT_ID,
                clientSecret: BLOG.COMMENT_GITALK_CLIENT_SECRET,
                repo: BLOG.COMMENT_GITALK_REPO,
                owner: BLOG.COMMENT_GITALK_OWNER,
                admin: BLOG.COMMENT_GITALK_ADMIN.split(','),
                distractionFreeMode: JSON.parse(
                  BLOG.COMMENT_GITALK_DISTRACTION_FREE_MODE
                )
              }}
            />
          </div>
        )}

        {BLOG.COMMENT_UTTERRANCES_REPO && (
          <div key="Utterance">
            <UtterancesComponent issueTerm={frontMatter.id} className="px-2" />
          </div>
        )}

        {BLOG.COMMENT_CUSDIS_APP_ID && (
          <div key="Cusdis">
            <ReactCusdis
              lang={locale.LOCALE.toLowerCase()}
              attrs={{
                host: BLOG.COMMENT_CUSDIS_HOST,
                appId: BLOG.COMMENT_CUSDIS_APP_ID,
                pageId: frontMatter.id,
                pageTitle: frontMatter.title,
                pageUrl: BLOG.LINK + router.asPath
              }}
            />
          </div>
        )}
      </Tabs>
    </div>
  )
}

export default Comment
