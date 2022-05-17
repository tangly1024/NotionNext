import Card from './Card'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import { AnalyticsCard } from './AnalyticsCard'
import CONFIG_HEXO from '../config_hexo'
export default function SideRight(props) {
  const {
    post, currentCategory, categories, latestPosts, tags,
    currentTag, showCategory, showTag, slot
  } = props

  return (
    <div className={'space-y-4 lg:w-80 lg:pt-0 px-2 pt-4'}>
      <InfoCard {...props} />
      {CONFIG_HEXO.WIDGET_ANALYTICS && <AnalyticsCard {...props} />}

      {showCategory && (
        <Card>
          <div className='ml-2 mb-1 font-sans'>
            <i className='fas fa-th' /> 分类
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
      {CONFIG_HEXO.WIDGET_LATEST_POSTS && latestPosts && latestPosts.length > 0 && <Card>
        <LatestPostsGroup {...props} />
      </Card>}

      <div className='sticky top-20'>
        {post && post.toc && <Card>
          <Catalog toc={post.toc} />
        </Card>}
        {slot}
      </div>

    </div>
  )
}
