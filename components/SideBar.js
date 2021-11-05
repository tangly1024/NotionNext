import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'
import LatestPosts from '@/components/LatestPosts'
import PostsCategories from '@/components/PostsCategories'
import Toc from '@/components/Toc'
import SearchInput from '@/components/SearchInput'

/**
 * 侧边栏
 * @param tags
 * @param currentTag
 * @param post
 * @param posts
 * @param categories
 * @param currentCategory
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = ({ tags, currentTag, post, posts, categories, currentCategory }) => {
  // 按时间排序
  if (posts) {
    posts = posts.sort((a, b) => {
      const dateA = new Date(a?.lastEditedTime || a.createdTime)
      const dateB = new Date(b?.lastEditedTime || b.createdTime)
      return dateB - dateA
    }).slice(0, 5)
  }

  return <aside id='sidebar' className='bg-white dark:bg-gray-800 w-72 z-10 dark:border-gray-500 border-gray-200 scroll-hidden h-full'>
    <section>
      <InfoCard />
    </section>

    <div className={(!post ? 'sticky top-0' : '') + ' bg-white dark:bg-gray-800'}>

      {/* 搜索框 */}
      <section className='p-5'>
        <SearchInput currentTag={currentTag} />
      </section>

      <section>
        <hr className='dark:border-gray-700' />
        <MenuButtonGroup allowCollapse={true} />
        <hr className='dark:border-gray-700 my-2' />
      </section>

      {/* 分类  */}
      {categories && (
        <section className='mt-2'>
          <PostsCategories currentCategory={currentCategory} categories={categories} />
        </section>
      )}

      {/* 最新文章 */}
      {posts && (
        <section className='mt-2'>
          <LatestPosts posts={posts} />
        </section>
      )}

      {/* 标签云  */}
      {tags && (
        <section className='mt-2'>
          <section
            className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 duration-100 flex flex-nowrap align-middle'>
            <div className='w-32'>标签</div>
          </section>
          <div className='px-5'>
            <TagList tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </div>

    {post && (
      <section id='left-toc' className='sticky top-0 bg-white dark:bg-gray-800'>
        <Toc toc={post.toc} />
      </section>
    )}

     <section id='blank' className='bg-white dark:bg-gray-800 py-20'/>

  </aside>
}
export default SideBar
