import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Tabs from '@/components/Tabs'
import { ReactCusdis } from 'react-cusdis'
import { useGlobal } from '@/lib/global'
import { WalineComponent } from './WalineComponent'

const GitalkComponent = dynamic(
  () => {
    return import('@/components/Gitalk')
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

const ValineComponent = dynamic(() => import('@/components/ValineComponent'), {
  ssr: false
})

const Comment = ({ frontMatter }) => {
  if (!frontMatter) {
    return <>Loading...</>
  }
  const router = useRouter()
  const { locale, isDarkMode } = useGlobal()
  // const theme = isDarkMode ? 'dark' : 'light'

  return (
    <div id='comment' className='comment mt-5 text-gray-800 dark:text-gray-300'>
      <Tabs>

        { BLOG.COMMENT_WALINE_SERVER_URL && (<div key='Waline'>
            <WalineComponent/>
        </div>) }

        {BLOG.COMMENT_VALINE_APP_ID && (<div key='Valine' name='reply'>
            <ValineComponent path={frontMatter.id}/>
        </div>)}

        {BLOG.COMMENT_GISCUS_REPO && (
          <div key="Giscus">
            <GiscusComponent isDarkMode={isDarkMode} className="px-2" />
          </div>
        )}

        {BLOG.COMMENT_CUSDIS_APP_ID && (<div key='Cusdis'>
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
        </div>)}

        {BLOG.COMMENT_UTTERRANCES_REPO && (<div key='Utterance'>
          <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
        </div>)}

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
