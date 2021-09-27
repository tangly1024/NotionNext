import BlogPost from '@/components/BlogPost'
import PropTypes from 'prop-types'
import Pagination from '@/components/Pagination'
import BLOG from '@/blog.config'
import CommonHead from '@/components/CommonHead'
import { useRouter } from 'next/router'
import { useTheme } from '@/lib/theme'
import { useEffect } from 'react'
import SideBar from '@/components/SideBar'

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

  // 首页隐藏看板娘
  useEffect(() => {
    const ref = document.getElementById('waifu')
    if (ref) {
      ref.remove()
    }
  })

  const { theme } = useTheme()

  return (
    <div id='wrapper' className={theme}>
      <CommonHead meta={meta} />
      {/* <TopNav tags={tags} currentTag={currentTag} /> */}
      {/* <Header navBarTitle={meta.title} fullWidth={true}/> */}

      <div className={`${BLOG.font} flex bg-gray-50`}>
        <SideBar tags={tags} currentTag={currentTag} />

        <main className='md:pb-10 md:px-24 p-5 flex-grow'>
          {(!page || page === 1) && (
            <div className='py-5' />
          )
          }
          {/* 标签 */}
          {currentTag && (
            <div className='pb-5 dark:text-gray-200'>
              <div className='py-1'>标签: {currentTag}</div>
              <hr />
            </div>
          )}
          {/* 当前搜索 */}
          {(currentSearch || (page && page !== 1)) && (
            <div className='pb-5'>
              <div className='dark:text-gray-200 flex justify-between py-1'>
                {currentSearch && (
                  <span>搜索关键词: {currentSearch}</span>
                )}
                {page && page !== 1 && (
                  <span>页 {page} / {totalPages}</span>
                )}
              </div>
              <hr />
            </div>
          )}

          {/* 文章列表 */}
          <div className='mx-auto animate__animated animate__fadeIn'>
            <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6'>
              {!postsToShow.length && (
                <p className='text-gray-500 dark:text-gray-300 textc'>No posts found.</p>
              )}
              {postsToShow.map(post => (
                <BlogPost key={post.id} post={post} tags={tags} />
              ))}
            </div>
          </div>

          <Pagination page={page} showNext={showNext} />

        </main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
DefaultLayout.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  currentTag: PropTypes.string
}
export default DefaultLayout
