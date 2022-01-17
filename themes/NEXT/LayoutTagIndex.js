import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import LayoutBase from './LayoutBase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import TagItem from './components/TagItem'

export const LayoutTagIndex = ({ tags, categories, postCount, latestPosts }) => {
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return <LayoutBase meta={meta} categories={categories} postCount={postCount} latestPosts={latestPosts}>
    <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
      <div className='dark:text-gray-200 mb-5'><FontAwesomeIcon icon={faTags} className='mr-4'/>{locale.COMMON.TAGS}:</div>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        { tags.map(tag => {
          return <div key={tag.name} className='p-2'><TagItem key={tag.name} tag={tag} /></div>
        }) }
      </div>
    </div>
  </LayoutBase>
}
