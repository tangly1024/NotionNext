import Link from 'next/link'
import CONFIG_HEXO from '../config_hexo'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'

/**
 * 关联推荐文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleRecommend({ recommendPosts, siteInfo }) {
  if (
    !CONFIG_HEXO.ARTICLE_RECOMMEND ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return <></>
  }
  const { locale } = useGlobal()
  return (
    <div className="p-2">
      <div className="font-sans mb-2 px-1 flex flex-nowrap justify-between">
        <div>
          <i className="mr-2 fas fa-thumbs-up" />
          {locale.COMMON.RELATE_POSTS}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendPosts.map(post => {
          const headerImage = post?.page_cover
            ? `url("${post.page_cover}")`
            : `url("${siteInfo?.pageCover}")`

          return (
            <Link
              key={post.id}
              title={post.title}
              href={`${BLOG.SUB_PATH}/article/${post.slug}`}
              passHref
            >
              <a
                key={post.id}
                className="flex h-40 cursor-pointer overflow-hidden"
              >
                <div
                  className="h-full w-full bg-cover bg-center bg-no-repeat hover:scale-110 transform duration-200"
                  style={{ backgroundImage: headerImage }}
                >
                  <div className="flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-10 w-full h-full duration-300 ">
                    <div className="font-sans text-sm  text-white text-center shadow-text">
                      <div>
                        <i className="fas fa-calendar-alt mr-1" />
                        {post.date?.start_date}
                      </div>
                      <div className="hover:underline">{post.title}</div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
