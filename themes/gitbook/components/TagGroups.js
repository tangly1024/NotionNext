import TagItemMini from './TagItemMini'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagGroups = ({ tagOptions, currentTag }) => {
  if (!tagOptions) return <></>
  return (
    <div id='tags-group' className='dark:border-gray-600 py-4'>
      <div className='mb-2'><i className='mr-2 fas fa-tag' />标签</div>
      <div className='space-y-2'>
        {
          tagOptions?.map(tag => {
            const selected = tag.name === currentTag
            return <TagItemMini key={tag.name} tag={tag} selected={selected} />
          })
        }
      </div>
    </div>
  )
}

export default TagGroups
