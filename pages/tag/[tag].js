import BLOG from '@/blog.config'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import StickyBar from '@/components/StickyBar'
import TagList from '@/components/TagList'
import BaseLayout from '@/layouts/BaseLayout'
import { useGlobal } from '@/lib/global'
import { getAllPosts } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'

export default function Tag ({ tags, posts, tag, categories, postCount, latestPosts }) {
  const { locale } = useGlobal()

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }

  // 将当前选中的标签置顶🔝
  if (!tags) tags = []
  const currentTag = tags?.find(r => r?.name === tag)
  const newTags = currentTag ? [currentTag].concat(tags.filter(r => r?.name !== tag)) : tags.filter(r => r?.name !== tag)

  return <BaseLayout meta={meta} tags={tags} currentTag={tag} categories={categories} postCount={postCount} latestPosts={latestPosts}>
      <StickyBar>
          <TagList tags={newTags} currentTag={tag}/>
      </StickyBar>
      <div className='md:mt-8'>
        <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
      </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const tag = params.tag
  const from = 'tag-props'
  const { allPosts, categories, tags, postCount, latestPosts } = await getGlobalNotionData({ from, includePage: true, tagsCount: 0 })
  const filteredPosts = allPosts.filter(
    post => post && post.tags && post.tags.includes(tag)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      tag,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

/**
 * 获取所有的标签
 * @param {*}} allPosts
 * @returns
 */
function getTagNames (allPosts) {
  const tags = allPosts.map(p => p.tags).flat()

  const tagObj = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })
  return tagObj
}

export async function getStaticPaths () {
  const from = 'tag-static-path'
  const posts = await getAllPosts({ from })
  const tagNames = getTagNames(posts)

  return {
    paths: Object.keys(tagNames).map(tag => ({ params: { tag } })),
    fallback: true
  }
}
