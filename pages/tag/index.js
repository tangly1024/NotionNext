import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagItem from '@/components/TagItem'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'

export default function Tag ({ tags, allPosts, categories }) {
  const meta = {
    title: `${BLOG.title} | 标签`,
    description: BLOG.description,
    type: 'website'
  }
  const { locale } = useGlobal()
  return <BaseLayout meta={meta} categories={categories} totalPosts={allPosts}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner p-10'>
    <div className='bg-white dark:bg-gray-700 px-10 py-5 mt-20'>
      <div className='dark:text-gray-200 my-5'>{locale.COMMON.TAGS}:</div>
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
  const from = 'tag-index-props'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, sliceCount: 0, tagOptions })
  return {
    props: {
      tags,
      allPosts,
      categories
    },
    revalidate: 1
  }
}
