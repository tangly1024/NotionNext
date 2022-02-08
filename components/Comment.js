import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
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
    return import('@/components/Cusdis')
  },
  { ssr: false }
)

const Comment = ({ frontMatter }) => {
  const router = useRouter()
  return (
    <div className='comment mt-5 text-gray-800 dark:text-gray-300'>
      <Tabs>
        {BLOG.COMMENT_CUSDIS_APP_ID && (<div key='Cusdis'>
          <CusdisComponent id={frontMatter.id} url={BLOG.LINK + router.asPath} title={frontMatter.title} />
        </div>)}

        {BLOG.COMMENT_UTTERRANCES_REPO && (<div key='Utterance'>
          <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
        </div>
        )}

        {BLOG.COMMENT_GITALK_CLIENT_ID && (<div key='GitTalk'>
          <GitalkComponent
            options={{
              id: frontMatter.id,
              title: frontMatter.title,
              clientID: BLOG.COMMENT_GITALK_CLIENT_ID,
              clientSecret: BLOG.COMMENT_GITALK_CLIENT_SECRET,
              repo: BLOG.COMMENT_GITALK_REPO,
              owner: BLOG.COMMENT_GITALK_OWNER,
              admin: BLOG.COMMENT_GITALK_ADMIN.split(','),
              distractionFreeMode: JSON.parse(BLOG.COMMENT_GITALK_DISTRACTION_FREE_MODE)
            }}
          />
        </div>)}

      </Tabs>
    </div>
  )
}

export default Comment
