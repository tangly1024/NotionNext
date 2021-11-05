import TagItemMini from '@/components/TagItemMini'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagList = ({ tags, currentTag }) => {
  if (!tags) return <></>
  return (
    <div id='tags-list' className='duration-500 dark:border-gray-600  dark:bg-gray-800 w-66'>
        {Object.keys(tags).map(tag => {
          const selected = tag === currentTag
          return (
            <TagItemMini key={tag} tag={tag} selected={selected} count={tags[tag]}/>
          )
        })}
    </div>
  )
}

export default TagList
