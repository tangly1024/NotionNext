
import formatDate from '@/lib/formatDate'
import Image from 'next/image'
import BLOG from '@/blog.config'
import TagItem from './TagItem'
import md5 from 'js-md5'

export const ArticleInfo = (props) => {
  const { post } = props

  const emailHash = md5(BLOG.CONTACT_EMAIL)

  return <section className="flex-wrap flex mt-2 text-gray--600 dark:text-gray-400 font-light leading-8">
        <div>

            <div className="font-bold text-3xl text-black dark:text-white">
            {post.title}
            </div>

            {post?.type !== 'Page' && <>
            <nav className="flex mt-7 items-start text-gray-500 dark:text-gray-400">
            <div className="flex mb-4">
              <a href={BLOG.CONTACT_GITHUB || '#'} className="flex">
                <Image
                  alt={BLOG.author}
                  width={24}
                  height={24}
                  src={`https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F754f6517-d954-443b-8b6d-806a23234294%2Fxingqiu-3.svg?table=collection&id=cf7f7240-e7ef-4d2c-801f-2da5f4e61cb7`}
                  className="rounded-full"
                />
                <p className="ml-2 md:block">{BLOG.author}</p>
              </a>
              <span className="block">&nbsp;/&nbsp;</span>
            </div>
            <div className="mr-2 mb-4 md:ml-0">
              {formatDate(
                post?.date?.start_date || post.createdTime,
                BLOG.LANG
              )}
            </div>
            {post.tags && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {post.tags.map(tag => (
                  <TagItem key={tag} tag={tag} />
                ))}
              </div>
            )}
            <span className="hidden busuanzi_container_page_pv mr-2">
                    <i className='mr-1 fas fa-eye' />
                    &nbsp;
                    <span className="mr-2 busuanzi_value_page_pv" />
                </span>
             </nav>
            </>}

        </div>

    </section>
}
