import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutCategory = props => {
  const { tags, posts, category } = props
  return <LayoutBase {...props}>
        <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
            <i className="mr-1 far fa-folder" />
            {category}
        </div>
        <BlogPostListScroll posts={posts} tags={tags} currentCategory={category} />
    </LayoutBase>
}
