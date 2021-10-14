import BlogPost from '@/components/BlogPost'
import PropTypes from 'prop-types'
import Pagination from '@/components/Pagination'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import TagsBar from '@/components/TagsBar'
import Footer from '@/components/Footer'
import React, { useRef } from 'react'
import Container from '@/components/Container'
import JumpToTop from '@/components/JumpToTop'
import SideBar from '@/components/SideBar'
import TopNav from '@/components/TopNav'

const IndexLayout = ({ tags, posts, page, currentTag, ...customMeta }) => {
  const meta = {
    title: BLOG.title,
    type: 'website',
    ...customMeta
  }
  page = page ?? 1
  let postsToShow = []
  let filteredBlogPosts = posts ?? []
  let currentSearch = ''
  if (posts) {
    const router = useRouter()
    if (router.query && router.query.s) {
      currentSearch = router.query.s
      filteredBlogPosts = posts.filter(post => {
        const tagContent = post.tags ? post.tags.join(' ') : ''
        const searchContent = post.title + post.summary + tagContent + post.slug
        return searchContent.toLowerCase().includes(currentSearch.toLowerCase())
      })
    }
  }
  const totalPages = Math.ceil(filteredBlogPosts.length / BLOG.postsPerPage)

  if (posts) {
    postsToShow = filteredBlogPosts.slice(
      BLOG.postsPerPage * (page - 1),
      BLOG.postsPerPage * page
    )
  }
  let showNext = false
  if (filteredBlogPosts) {
    const totalPosts = filteredBlogPosts.length
    showNext = page * BLOG.postsPerPage < totalPosts
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

          <main id='post-list-wrapper' className='pt-16 md:pt-28 px-2 md:px-20'>
            {(!page || page === 1) && (<div className='py-5' />)}

            {/* 当前搜索 */}
            {(currentSearch || (page && page !== 1)) && (
              <div className='pb-5'>
                <div className='dark:text-gray-200 flex justify-between py-1'>
                  {page && page !== 1 && (<span>页 {page} / {totalPages}</span>)}
                </div>
              </div>
            )}

            <div className=''>
              {/* 文章列表 */}
              <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'>
                {!postsToShow.length && (
                  <p className='text-gray-500 dark:text-gray-300'>No posts found.</p>
                )}
                {postsToShow.map(post => (
                  <BlogPost key={post.id} post={post} tags={tags} />
                ))}
              </div>

              <Pagination page={page} showNext={showNext} />
            </div>
            <div className='w-full border-t '>
              <Footer />
            </div>
          </main>

        </div>

      </div>
      {/* 下方菜单组 */}
      <div
        className='right-0 space-x-2 fixed flex bottom-24 px-5 py-1 duration-500'>
        <div className='flex-wrap'>
          <JumpToTop targetRef={targetRef} showPercent={false} />
        </div>
      </div>
    </Container>
  )
}
IndexLayout.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  currentTag: PropTypes.string
}
export default IndexLayout
