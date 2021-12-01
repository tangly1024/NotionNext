import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagItem from '@/components/TagItem'

export default function Tag ({ tags, posts, categories }) {
  const meta = {
    title: `${BLOG.title} | 标签`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} categories={categories} totalPosts={posts}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner p-10'>
    <div className='bg-white dark:bg-gray-700 px-10 py-5 mt-20'>
      <div className='dark:text-gray-200 my-5'>所有标签:</div>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        {
          tags.map(tag => {
            return <div key={tag.name} className='p-2'><TagItem key={tag.name} tag={tag} /></div>
          })
        }
      </div>
    </div>
    </div>
  </BaseLayout>
}

export async function getStaticProps () {
  let posts = await getAllPosts({ from: 'tag-props' })
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts, 0)
  const categories = await getAllCategories(posts)
  return {
    props: {
      tags,
      posts,
      categories
    },
    revalidate: 1
  }
}
