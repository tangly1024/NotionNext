import Card from './Card'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import { AnalyticsCard } from './AnalyticsCard'

export default function SideRight (props) {
  const {
    post,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag
  } = props

  return (
    <div className={'w-80 space-y-4'}>
      <InfoCard {...props}/>
      <AnalyticsCard {...props}/>

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
        <Card className='sticky top-20'>
          <Catalog toc={post.toc} />
        </Card>
      )}
    </div>
  )
}
