import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from '@/lib/theme'
import { useEffect, useState } from 'react'

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
  const { theme } = useTheme()

  return <div className='comment text-gray-800 dark:text-gray-300'>
    <div className='font-bold pt-2 pb-4 '>留下评论</div>

    {/* 评论插件 */}
    {BLOG.comment.provider === 'gitalk' && (
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
    )}
    {BLOG.comment.provider === 'utterances' && (
      <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
    )}
    {BLOG.comment.provider === 'cusdis' && (
      <>
        <script defer src='https://cusdis.com/js/widget/lang/zh-cn.js' />
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
      </>

    )}</div>
}

export default Comment
