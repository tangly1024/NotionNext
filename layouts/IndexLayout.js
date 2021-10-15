import PropTypes from 'prop-types'
import BLOG from '@/blog.config'
import TagsBar from '@/components/TagsBar'
import Footer from '@/components/Footer'
import React, { useRef } from 'react'
import Container from '@/components/Container'
import JumpToTop from '@/components/JumpToTop'
import SideBar from '@/components/SideBar'
import TopNav from '@/components/TopNav'
import BlogPostListScrollPagination from '@/components/BlogPostListScrollPagination '

const IndexLayout = ({ tags, posts, page, currentTag, ...customMeta }) => {
  const meta = {
    title: `${BLOG.title} | 首页`,
    type: 'website',
    ...customMeta
  }

  const targetRef = useRef(null)

  return (
    <Container id='wrapper' meta={meta} tags={tags}>
      <TopNav tags={tags} />

      <div ref={targetRef} className={`${BLOG.font} flex justify-between bg-gray-100 dark:bg-black min-h-screen`}>
        {/* 侧边菜单 */}
        <SideBar />
        <div className='flex-grow'>
          <TagsBar tags={tags} currentTag={currentTag} />
          <BlogPostListScrollPagination posts={posts} tags={tags} targetRef={targetRef}/>
        </div>
      </div>

      {/* 下方菜单组 */}
      <div className='right-0 space-x-2 fixed flex bottom-24 px-5 py-1 duration-500'>
        <div className='flex-wrap'>
          <JumpToTop targetRef={targetRef} showPercent={false} />
        </div>
      </div>

      <Footer />
    </Container>
  )
}
IndexLayout.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  currentTag: PropTypes.string
}
export default IndexLayout
