import NotionIcon from '@/components/NotionIcon'
import Link from 'next/link'
import TagItem from './TagItem'

/**
 * 文章详情页说明信息
 */
export default function PostInfo(props) {
  const { post } = props

  return (
    <section className='flex-wrap flex m-2 text-gray--600 dark:text-gray-400 font-light leading-8'>
      <div>
        <div>
          {post?.type !== 'Page' && (
            <>
              <Link
                href={`/category/${post?.category}`}
                passHref
                className='cursor-pointer text-xs font-bold hover:underline mr-2'>
                {post?.category}
              </Link>
            </>
          )}
        </div>

        <h1 className='font-bold text-3xl text-black dark:text-white'>
          <NotionIcon icon={post?.pageIcon} />
          {post?.title}
        </h1>

        {post?.type !== 'Page' && (
          <>
            <nav className='flex my-2 items-start text-gray-500 dark:text-gray-400'>
              {post?.tags && (
                <div className='flex flex-wrap max-w-full overflow-x-auto article-tags'>
                  {post?.tags.map(tag => (
                    <TagItem key={tag} tag={tag} />
                  ))}
                </div>
              )}
              <span className='hidden busuanzi_container_page_pv mr-2'>
                <i className='mr-1 fas fa-fire' />
                &nbsp;
                <span className='mr-2 busuanzi_value_page_pv' />
              </span>
            </nav>
          </>
        )}
      </div>
    </section>
  )
}
