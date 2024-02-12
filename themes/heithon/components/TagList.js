import TagItem from './TagItem'

/**
 * 横向的标签列表
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagList = ({ tagOptions, currentTag }) => {
  if (!tagOptions) {
    return <></>
  }
  return <ul className='flex py-1 space-x-3'>
    <li className='w-20 py-2 dark:text-gray-200 whitespace-nowrap'>标签:</li>
    {tagOptions.map(tag => {
      const selected = tag.name === currentTag
      return <TagItem key={tag.name} tag={tag} selected={selected}/>
    })}
  </ul>
}

export default TagList
