import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { checkContainHttp, sliceUrlFromHttp } from '@/lib/utils'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'

const BlogPost = ({ post }) => {
  const url = checkContainHttp(post.slug) ? sliceUrlFromHttp(post.slug) : `${siteConfig('SUB_PATH', '')}/${post.slug}`

  const showPreview = siteConfig('POST_LIST_PREVIEW') && post.blockMap

  return (
    (<Link href={url}>

      <article key={post.id} className="mb-6 md:mb-8">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            <NotionIcon icon={post.pageIcon} />{post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {post?.publishDay}
          </time>
        </header>
        <main>
          {!showPreview && <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>}
          {showPreview && post?.blockMap && (
            <div className="overflow-ellipsis truncate">
              <NotionPage post={post} />
              <hr className='border-dashed py-4'/>
            </div>
          )}
        </main>
      </article>

    </Link>)
  )
}

export default BlogPost
