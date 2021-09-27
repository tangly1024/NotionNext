import ArticleLayout from '@/layouts/ArticleLayout'
import { getAllPosts, getAllTags, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { createHash } from 'crypto'
import { getPageTableOfContents } from 'notion-utils'
import Custom404 from '@/pages/404'

const BlogPost = ({ post, blockMap, emailHash, tags, prev, next }) => {
  if (!post) {
    return <Custom404/>
  }
  return (
    <ArticleLayout
      blockMap={blockMap}
      frontMatter={post}
      emailHash={emailHash}
      tags={tags}
      prev={prev}
      next={next}
    ></ArticleLayout>
  )
}

export async function getStaticPaths () {
  let posts = await getAllPosts()
  posts = posts.filter(post => post.status[0] === 'Published')
  return {
    paths: posts.map(row => `${BLOG.path}/article/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  let posts = await getAllPosts()
  posts = posts.filter(post => post.status[0] === 'Published')
  const post = posts.find(t => t.slug === slug)
  if (!post) {
    return {
      props: { },
      revalidate: 1
    }
  }

  const blockMap = await getPostBlocks(post.id)
  const emailHash = createHash('md5').update(BLOG.email).digest('hex')
  post.toc = getPageTableOfContents(post, blockMap)
  posts = posts.filter(post => post.type[0] === 'Post')
  const tags = await getAllTags(posts)
  // 获取推荐文章
  const index = posts.indexOf(post)
  const prev = posts.slice(index - 1, index)[0] ?? posts.slice(-1)[0]
  const next = posts.slice(index + 1, index + 2)[0] ?? posts[0]

  return {
    props: { post, blockMap, emailHash, tags, prev, next },
    revalidate: 1
  }
}

export default BlogPost
