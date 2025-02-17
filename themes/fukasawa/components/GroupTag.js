import TagItemMini from './TagItemMini'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
function GroupTag ({ tags, currentTag }) {
  if (!tags) return <></>
  return (
    <div id='tags-group' className='dark:border-gray-600 w-66 space-y-2'>
      {
        tags?.slice(0, 20)?.map(tag => {
          const selected = tag.name === currentTag
          return <TagItemMini key={tag.name} tag={tag} selected={selected} />
        })
      }
    </div>
  )
}

export default GroupTag
