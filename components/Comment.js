import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import Tabs from '@/components/Tabs'
import { isBrowser } from '@/lib/utils'
import { useRouter } from 'next/router'

const WalineComponent = dynamic(
  () => {
    return import('@/components/WalineComponent')
  },
  { ssr: false }
)

const CusdisComponent = dynamic(
  () => {
    return import('@/components/CusdisComponent')
  },
  { ssr: false }
)

const TwikooCompenent = dynamic(
  () => {
    return import('@/components/Twikoo')
  },
  { ssr: false }
)

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
const WebMentionComponent = dynamic(
  () => {
    return import('@/components/WebMention')
  },
  { ssr: false }
)

const ValineComponent = dynamic(() => import('@/components/ValineComponent'), {
  ssr: false
})

/**
 * 是否有评论
 */
export const commentEnable = BLOG.COMMENT_TWIKOO_ENV_ID || BLOG.COMMENT_WALINE_SERVER_URL || BLOG.COMMENT_VALINE_APP_ID ||
BLOG.COMMENT_GISCUS_REPO || BLOG.COMMENT_CUSDIS_APP_ID || BLOG.COMMENT_UTTERRANCES_REPO ||
 BLOG.COMMENT_GITALK_CLIENT_ID || BLOG.COMMENT_WEBMENTION.ENABLE

/**
 * 评论组件
 * @param {*} param0
 * @returns
 */
const Comment = ({ frontMatter, className }) => {
  const router = useRouter()

  if (isBrowser && ('giscus' in router.query || router.query.target === 'comment')) {
    setTimeout(() => {
      const url = router.asPath.replace('?target=comment', '')
      history.replaceState({}, '', url)
      document?.getElementById('comment')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }, 1000)
  }

  if (!frontMatter) {
    return <>Loading...</>
  }

  return (
    <div key={frontMatter?.id} id='comment' className={`comment mt-5 text-gray-800 dark:text-gray-300 ${className || ''}`}>
        <Tabs>

            {BLOG.COMMENT_TWIKOO_ENV_ID && (<div key='Twikoo'>
                <TwikooCompenent />
            </div>)}

            {BLOG.COMMENT_WALINE_SERVER_URL && (<div key='Waline'>
                <WalineComponent />
            </div>)}

            {BLOG.COMMENT_VALINE_APP_ID && (<div key='Valine' name='reply'>
                <ValineComponent path={frontMatter.id} />
            </div>)}

            {BLOG.COMMENT_GISCUS_REPO && (
                <div key="Giscus">
                    <GiscusComponent className="px-2" />
                </div>
            )}

            {BLOG.COMMENT_CUSDIS_APP_ID && (<div key='Cusdis'>
                <CusdisComponent frontMatter={frontMatter} />
            </div>)}

            {BLOG.COMMENT_UTTERRANCES_REPO && (<div key='Utterance'>
                <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
            </div>)}

            {BLOG.COMMENT_GITALK_CLIENT_ID && (<div key='GitTalk'>
                <GitalkComponent frontMatter={frontMatter} />
            </div>)}

            {BLOG.COMMENT_WEBMENTION.ENABLE && (<div key='WebMention'>
                <WebMentionComponent frontMatter={frontMatter} className="px-2" />
            </div>)}
        </Tabs>
    </div>
  )
}

export default Comment
