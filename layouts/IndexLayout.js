import PropTypes from 'prop-types'
import BLOG from '@/blog.config'
import TagsBar from '@/components/TagsBar'
import Footer from '@/components/Footer'
import React, { useRef } from 'react'
import Container from '@/components/Container'
import JumpToTop from '@/components/JumpToTop'
import SideBar from '@/components/SideBar'
import TopNav from '@/components/TopNav'
import BlogPostListScrollPagination from '@/components/BlogPostListScrollPagination'

const IndexLayout = ({ tags, posts, page, currentTag, meta, ...customMeta }) => {
  const targetRef = useRef(null)

  return (
    <Container id='wrapper' meta={meta} tags={tags}>
      <TopNav tags={tags} />

      {/* middle */}
      <div ref={targetRef} className={`${BLOG.font} flex justify-between bg-gray-100 dark:bg-black min-h-screen`}>
        <SideBar />
        <main className='flex-grow'>
          <TagsBar tags={tags} currentTag={currentTag} />
          <BlogPostListScrollPagination posts={posts} tags={tags} targetRef={targetRef} />
          <JumpToTop targetRef={targetRef} showPercent={false} />
        </main>
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
