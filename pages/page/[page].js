import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import PageLayout from '@/layouts/PageLayout'

const Page = ({ posts, tags, page }) => {
  let filteredBlogPosts = posts
  if (posts) {
    const router = useRouter()
    if (router.query && router.query.s) {
      filteredBlogPosts = posts.filter(post => {
        const tagContent = post.tags ? post.tags.join(' ') : ''
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(router.query.s.toLowerCase())
      })
    }
  }

  return <PageLayout tags={tags} posts={filteredBlogPosts} page={page} />
}

export async function getStaticProps (context) {
  const { page } = context.params // Get Current Page No.
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  return {
    props: {
      tags,
      posts,
      page
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  if (BLOG.isProd) {
    // 预渲染
    let posts = await getAllPosts()
    posts = posts.filter(
      post => post.status[0] === 'Published' && post.type[0] === 'Post'
    )
    const totalPosts = posts.length
    const totalPages = Math.ceil(totalPosts / BLOG.postsPerPage)
    return {
      // remove first page, we 're not gonna handle that.
      paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { page: '' + (i + 2) }
      })),
      fallback: true
    }
  } else {
    return {
      paths: [],
      fallback: true
    }
  }
}

export default Page
