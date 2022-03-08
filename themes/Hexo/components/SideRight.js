import Card from './Card'
import MenuButtonGroup from './MenuButtonGroup'
import SearchInput from './SearchInput'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'

export default function SideRight (props) {
  const {
    post,
    postCount,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag
  } = props
  return (
    <div className='w-96 space-y-4 hidden lg:block'>
      <InfoCard {...props}/>
      <Card>
        <div className='ml-2 mb-3 font-sans'>
          <i className='fas fa-chart-area' /> 统计
        </div>
        <div className='text-xs font-sans font-light justify-center mx-7'>
          <div className='inline'>
            <div className='flex justify-between'>
              <div>文章数:</div>
              <div>{postCount}</div>
            </div>
          </div>
          <div className='hidden busuanzi_container_page_pv ml-2'>
            <div className='flex justify-between'>
              <div>访问量:</div>
              <div className='busuanzi_value_page_pv' />
            </div>
          </div>
          <div className='hidden busuanzi_container_site_uv ml-2'>
            <div className='flex justify-between'>
              <div>访客数:</div>
              <div className='busuanzi_value_site_uv' />
            </div>
          </div>
        </div>
      </Card>

      {showCategory && (
        <Card>
          <div className='ml-2 mb-1 font-sans'>
            <i className='fas fa-th'/> 分类
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </Card>
      )}
      {showTag && (
        <Card>
          <TagGroups tags={tags} currentTag={currentTag} />
        </Card>
      )}
      {latestPosts && <Card>
        <LatestPostsGroup posts={latestPosts} />
      </Card>}

      {post && post.toc && (
        <Card className='sticky top-12'>
          <Catalog toc={post.toc} />
        </Card>
      )}
    </div>
  )
}
