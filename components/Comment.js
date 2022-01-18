import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import 'gitalk/dist/gitalk.css'
import Tabs from '@/components/Tabs'

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
const CusdisComponent = dynamic(
  () => {
    return import('react-cusdis').then(m => m.ReactCusdis)
  },
  { ssr: false }
)

const Comment = ({ frontMatter }) => {
  const router = useRouter()
  const { theme } = useGlobal()

  return (
    <div className='comment mt-5 text-gray-800 dark:text-gray-300'>
      <Tabs>
        {BLOG.COMMENT_GITALK_CLIENT_ID && (<div className='m-10' key='gitalk'>
          <GitalkComponent
            options={{
              id: frontMatter.id,
              title: frontMatter.title,
              clientID: BLOG.COMMENT_GITALK_CLIENT_ID,
              clientSecret: BLOG.COMMENT_GITALK_CLIENT_SECRET,
              repo: BLOG.COMMENT_GITALK_REPO,
              owner: BLOG.COMMENT_GITALK_OWNER,
              admin: BLOG.COMMENT_GITALK_ADMIN.split(','),
              distractionFreeMode: BLOG.COMMENT_GITALK_DISTRACTION_FREE_MODE
            }}
          />
        </div>)}
        {BLOG.COMMENT_UTTERRANCES_REPO && (<div className='m-10' key='utterance'>
            <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
          </div>
        )}
        {BLOG.COMMENT_CUSDIS_APP_ID && (<>
          <script defer src='https://cusdis.com/js/widget/lang/zh-cn.js' />
          <div className='m-10' key='cusdis'>
            <CusdisComponent
              attrs={{
                host: BLOG.COMMENT_CUSDIS_HOST,
                appId: BLOG.COMMENT_CUSDIS_APP_ID,
                pageId: frontMatter.id,
                pageTitle: frontMatter.title,
                pageUrl: BLOG.LINK + router.asPath,
                theme: theme
              }}
              lang={BLOG.LANG.toLowerCase()}
            />
          </div>
        </>)}
      </Tabs>
    </div>
  )
}

export default Comment
