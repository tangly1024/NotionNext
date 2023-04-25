import Link from 'next/link'
import CONFIG_HEXO from '../config_hexo'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import TagItemMini from './TagItemMini'

/**
 * 关联推荐文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleRecommend({ recommendPosts, siteInfo }) {
  const { locale } = useGlobal()

  if (
    !CONFIG_HEXO.ARTICLE_RECOMMEND ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return <></>
  }

  return (
    <div className="pt-8">
      <div className=" mb-2 px-1 flex flex-nowrap justify-between">
        <div className='dark:text-gray-300'>
          <i className="mr-2 fas fa-thumbs-up" />
          {locale.COMMON.RELATE_POSTS}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendPosts.map(post => {
          const headerImage = post?.page_cover
            ? `url("${post.page_cover}&w=240")`
            : `url("${siteInfo?.pageCover}&w=240")`

          return (
            (<Link
              key={post.id}
              title={post.title}
              href={`${BLOG.SUB_PATH}/${post.slug}`}
              passHref
              className="flex h-40 cursor-pointer overflow-hidden">

              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat hover:scale-110 transform duration-200"
                style={{ backgroundImage: headerImage }}
              >
                <div className="flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-10 w-full h-full duration-300 ">
                  <div className=" text-md text-white text-center shadow-text">
                    <div className="px-4 font-normal hover:underline">{post.title}</div>
                    <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
                        <div>
                            {' '}
                            {post.tagItems.map(tag => (
                                <div className='font-light'>{selected && <i className='mr-1 fa-tag'/>} {tag.name + (tag.count ? `(${tag.count})` : '')} </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

            </Link>)
          )
        })}
      </div>
    </div>
  )
}
