import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import TagList from './components/TagList'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import BLOG from '@/blog.config'

export const LayoutTag = (props) => {
  const { tagOptions, tag } = props

  return <LayoutBase currentTag={tag} {...props}>
        <StickyBar>
            <TagList tagOptions={tagOptions} currentTag={tag} />
        </StickyBar>
        <div className='md:mt-8'>
            {BLOG.POST_LIST_STYLE !== 'page'
              ? <BlogPostListScroll {...props} showSummary={true} />
              : <BlogPostListPage {...props} />
            }
        </div>
    </LayoutBase>
}

export default LayoutTag
