import Link from 'next/link'
import NotionIcon from './NotionIcon'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import { checkContainHttp, sliceUrlFromHttp } from '@/lib/utils'

const BlogPostCard = ({ post, className }) => {
  const router = useRouter()
  const currentSelected = router.asPath.split('?')[0] === '/' + post.slug
  let pageIcon = post.pageIcon !== '' ? post.pageIcon : siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  pageIcon = post.pageIcon.indexOf('amazonaws.com') !== -1 ? post.pageIcon + '&width=88' : post.pageIcon
  const url = checkContainHttp(post.slug) ? sliceUrlFromHttp(post.slug) : `${siteConfig('SUB_PATH', '')}/${post.slug}`
  return (
    <Link href={`${url}`} target={(checkContainHttp(post.slug) ? '_blank' : '_self')} passHref>
        <div key={post.id} className={`${className} h-full rounded-2xl p-4 dark:bg-neutral-800 cursor-pointer bg-white hover:bg-white dark:hover:bg-gray-800 ${currentSelected ? 'bg-green-50 text-green-500' : ''}`}>
                <div className="stack-entry w-full flex space-x-3 select-none dark:text-neutral-200">
                    <NotionIcon icon={pageIcon} size='10' className='text-6xl w-11 h-11 mx-1 my-0 flex-none' />
                    <div className="stack-comment flex-auto">
                        <p className="title font-bold">{post.title}</p>
                        <p className="description font-normal">{post.summary ? post.summary : '暂无简介'}</p>
                    </div>
                </div>
        </div>
    </Link>
  )
}

export default BlogPostCard
