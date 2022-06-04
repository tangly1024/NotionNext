import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import Tabs from '@/components/Tabs'
import { useGlobal } from '@/lib/global'
import React from 'react'
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
  const { isDarkMode } = useGlobal()
  const router = useRouter()

  React.useEffect(() => {
    // 跳转到评论区
    setTimeout(() => {
      if (window.location.href.indexOf('target=comment') > -1) {
        const url = router.asPath.replace('?target=comment', '')
        history.replaceState({}, '', url)
        const commentNode = document.getElementById('comment')
        commentNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }, 200)
  }, [])

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
          <CusdisComponent frontMatter={frontMatter}/>
        </div>)}

        {BLOG.COMMENT_UTTERRANCES_REPO && (<div key='Utterance'>
          <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
        </div>)}

        {BLOG.COMMENT_GITALK_CLIENT_ID && (<div key='GitTalk'>
          <GitalkComponent frontMatter={frontMatter}/>
        </div>)}
      </Tabs>
    </div>
  )
}

export default Comment
