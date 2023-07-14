import Link from 'next/link'
import TagItemMini from './TagItemMini'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/formatDate'
import BLOG from '@/blog.config'
import NotionIcon from '@/components/NotionIcon'

export default function HeaderArticle({ post, siteInfo }) {
  const { locale } = useGlobal()

  if (!post) {
    return <></>
  }
  const headerImage = post?.pageCover ? `url("${post.pageCover}")` : `url("${siteInfo?.pageCover}")`

  const date = formatDate(
    post?.publishTime,
    locale.LOCALE
  )

  return (
    <div
      id="header"
      data-aos="fade-down"
      data-aos-duration="300"
      data-aos-once="true"
      data-aos-anchor-placement="top-bottom"
      className="w-full h-96 relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat z-10"
      style={{ backgroundImage: headerImage }}
    >
      <header id='article-header-cover'
            data-aos="fade-down"
            data-aos-duration="300"
            data-aos-once="true"
            data-aos-anchor-placement="top-bottom"
            className="bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center ">

        <div className='mt-10'>
            <div className='mb-3 flex justify-center'>
              {post.category && <>
                <Link href={`/category/${post.category}`} passHref legacyBehavior>
                  <div className="cursor-pointer px-2 py-1 mb-2 border rounded-sm dark:border-white text-sm font-medium hover:underline duration-200 shadow-text-md text-white">
                    {post.category}
                  </div>
                </Link>
              </>}
            </div>

          {/* 文章Title */}
          <div className="leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white">
            <NotionIcon icon={post.pageIcon} className='text-4xl mx-1' />{post.title}
          </div>

          <section className="flex-wrap shadow-text-md flex text-sm justify-center mt-4 text-white dark:text-gray-400 font-light leading-8">

            <div className='flex justify-center dark:text-gray-200 text-opacity-70'>
              {post?.type !== 'Page' && (
                <>
                  <Link
                    href={`/archive#${post?.publishTime?.substr(0, 7)}`}
                    passHref
                    className="pl-1 mr-2 cursor-pointer hover:underline">

                    {locale.COMMON.POST_TIME}:{date}

                  </Link>
                </>
              )}
              <div className="pl-1 mr-2">
                {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedTime}
              </div>
            </div>

            {BLOG.ANALYTICS_BUSUANZI_ENABLE && <div className="busuanzi_container_page_pv font-light mr-2">
              <span className="mr-2 busuanzi_value_page_pv" />
              {locale.COMMON.VIEWS}
            </div>}
          </section>

            <div className='mt-4 mb-1'>
                {post.tagItems && (
                    <div className="flex justify-center flex-nowrap overflow-x-auto">
                        {post.tagItems.map(tag => (
                            <TagItemMini key={tag.name} tag={tag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </header>
    </div>
  )
}
