import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import 'gitalk/dist/gitalk.css'

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
    BLOG.comment.provider !== '' && (
      <div className='comment mt-5 text-gray-800 dark:text-gray-300'>
        {BLOG.comment.provider === 'gitalk' && (<div className='m-10'>
          <GitalkComponent
            options={{
              id: frontMatter.id,
              title: frontMatter.title,
              clientID: BLOG.comment.gitalkConfig.clientID,
              clientSecret: BLOG.comment.gitalkConfig.clientSecret,
              repo: BLOG.comment.gitalkConfig.repo,
              owner: BLOG.comment.gitalkConfig.owner,
              admin: BLOG.comment.gitalkConfig.admin,
              distractionFreeMode: BLOG.comment.gitalkConfig.distractionFreeMode
            }}
          />
        </div>)}
        {BLOG.comment.provider === 'utterances' && (<div className='m-10'>
          <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
        </div>
        )}
        {BLOG.comment.provider === 'cusdis' && (<>
          <script defer src='https://cusdis.com/js/widget/lang/zh-cn.js' />
          <div className='m-10'>
            <CusdisComponent
              attrs={{
                host: BLOG.comment.cusdisConfig.host,
                appId: BLOG.comment.cusdisConfig.appId,
                pageId: frontMatter.id,
                pageTitle: frontMatter.title,
                pageUrl: BLOG.link + router.asPath,
                theme: theme
              }}
              lang={BLOG.lang.toLowerCase()}
            />
          </div>
        </>)}
      </div>
    )
  )
}

export default Comment
