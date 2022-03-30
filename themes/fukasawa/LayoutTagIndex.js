import { useGlobal } from '@/lib/global'
import TagItem from './components/TagItem'
import LayoutBase from './LayoutBase'

export const LayoutTagIndex = (props) => {
  const { locale } = useGlobal()
  const { tags } = props
  return <LayoutBase {...props} >
    <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
      <div className='dark:text-gray-200 mb-5'><i className='mr-4 fas fa-tag'/>{locale.COMMON.TAGS}:</div>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        { tags.map(tag => {
          return <div key={tag.name} className='p-2'><TagItem key={tag.name} tag={tag} /></div>
        }) }
      </div>
    </div>
  </LayoutBase>
}
