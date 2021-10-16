/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = () => {
  return <div className='w-full h-full flex justify-center mx-auto'>
      <div className='align-middle text-center my-auto'>
        <p className='text-gray-500 dark:text-gray-300'>No posts found.</p>
      </div>
  </div>
}
export default BlogPostListEmpty
