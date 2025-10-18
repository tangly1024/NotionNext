import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 展示文章推荐
 */
const RecommendPosts = ({ recommendPosts }) => {
  const { locale } = useGlobal()
  if (!siteConfig('SIMPLE_ARTICLE_RECOMMEND_POSTS', null, CONFIG) || !recommendPosts || recommendPosts.length < 1) {
    return <></>
  }

  return (
    <div className="pt-2 border pl-4 py-2 my-4 dark:text-gray-300 ">
       <div className="mb-2 font-bold text-lg">{locale.COMMON.RELATE_POSTS} :</div>
        <ul className="font-light text-sm">
          {recommendPosts.map(post => (
            <li className="py-1" key={post.id}>
              <SmartLink href={`/${post.slug}`} className="cursor-pointer hover:underline">

                {post.title}

              </SmartLink>
            </li>
          ))}
        </ul>
    </div>
  )
}
export default RecommendPosts
