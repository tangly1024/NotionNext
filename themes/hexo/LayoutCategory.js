import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import BLOG from '@/blog.config'

export const LayoutCategory = props => {
  const { category } = props
  return <LayoutBase {...props}>
        <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
            <i className="mr-1 far fa-folder" />
            {category}
        </div>
        {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </LayoutBase>
}
