import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'

const ShareButtons = dynamic(() => import('@/components/ShareButtons'), {
  ssr: false
})

/**
 * 悬浮在文章右侧的分享按钮
 * @param {*} param0
 * @returns
 */
const ShareBar = ({ post }) => {
  const { locale } = useGlobal()

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const title = post?.title

  if (!siteConfig('ARTICLE_SHARE')) {
    return <></>
  }

  return (
    <div className='hidden lg:flex flex-col justify-center items-center text-gray-500 space-y-4'>
      <div className='hover:text-blue-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer'>
        <ShareButtons shareUrl={shareUrl} title={title} />
      </div>
    </div>
  )
}

export default ShareBar
