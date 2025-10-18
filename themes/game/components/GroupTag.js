import SmartLink from '@/components/SmartLink'
import TagItemMini from './TagItemMini'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
function GroupTag({ tagOptions, currentTag }) {
  if (!tagOptions) return <></>
  return (
    <div className='flex items-center'>
      <SmartLink href='/tag'>
        <i className='fas fa-tags p-2' />
      </SmartLink>
      <div id='tags-group' className='flex flex-wrap p-1 gap-2'>
        {tagOptions?.slice(0, 20)?.map(tag => {
          const selected = tag.name === currentTag
          return <TagItemMini key={tag.name} tag={tag} selected={selected} />
        })}
      </div>
    </div>
  )
}

export default GroupTag
