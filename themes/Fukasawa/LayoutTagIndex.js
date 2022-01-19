import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TagItem from './components/TagItem'
import LayoutBase from './LayoutBase'

export const LayoutTagIndex = (props) => {
  const { locale } = useGlobal()
  const { tags } = props
  const meta = {
    title: `${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  return <LayoutBase {...props} meta={meta}>
    <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
      <div className='dark:text-gray-200 mb-5'><FontAwesomeIcon icon={faTag} className='mr-4'/>{locale.COMMON.TAGS}:</div>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        { tags.map(tag => {
          return <div key={tag.name} className='p-2'><TagItem key={tag.name} tag={tag} /></div>
        }) }
      </div>
    </div>
  </LayoutBase>
}
