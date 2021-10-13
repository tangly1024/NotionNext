import BlogPost from '@/components/BlogPost'
import PropTypes from 'prop-types'
import Pagination from '@/components/Pagination'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { useTheme } from '@/lib/theme'
import CommonHead from '@/components/CommonHead'
import TopNav from '@/components/TopNav'
import Tags from '@/components/Tags'
import SideBar from '@/components/SideBar'
import Footer from '@/components/Footer'
import React from 'react'
import Container from '@/components/Container'

const DefaultLayout = ({ tags, posts, page, currentTag, ...customMeta }) => {
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

  const { theme } = useTheme()

  return (
    <Container id='wrapper' className={theme} meta={meta} tags={tags}>

      <div className={`${BLOG.font} flex justify-between bg-gray-100 dark:bg-black min-h-screen`}>
        {/* 侧边菜单 */}
        <SideBar />

        <div className='flex-grow'>

          <div id='tags-bar' className='fixed xl:mt-0 top-16 duration-500 z-10 w-full border-b dark:border-gray-600'>
            <Tags tags={tags} currentTag={currentTag} />
          </div>

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
              <Footer/>
            </div>
          </main>

        </div>

      </div>
    </Container>
  )
}
DefaultLayout.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  currentTag: PropTypes.string
}
export default DefaultLayout
