import BlogPostCard from './BlogPostCard'
// import Collapse from '@/components/Collapse'

/**
 * 导航列表
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostItem = (props) => {
  const { group } = props
  if (group?.category) {
    return <>
            <div id={group?.category} className='category  text-lg font-normal pt-9 pb-4 first:pt-4 select-none flex justify-between  text-neutral-800 dark:text-neutral-400 p-2' key={group?.category}>
                <h3><i className={`text-base mr-2 ${group?.icon ? group?.icon : 'fas fa-hashtag'}`} />{group?.category}</h3>
            </div>
            <div id='posts-wrapper' className='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' >
            {group?.items?.map(post => (
                <BlogPostCard key={post.id} className='card' post={post} />
            ))}
            </div>
        </>
  } else {
    return <>
            <div id='uncategory' className='category text-lg pt-9 pb-4 first:pt-4 font-bold select-none flex justify-between  text-neutral-800 dark:text-neutral-400 p-2' key='uncategory'>
                <span><i className={`text-base mr-2 ${group?.icon ? group?.icon : 'fas fa-hashtag'}`} />未分类</span>
            </div>
            <div className='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {group?.items?.map(post => (
                <BlogPostCard key={post.id} className='card' post={post} />
            ))}
            </div>
        </>
  }
}

export default BlogPostItem
