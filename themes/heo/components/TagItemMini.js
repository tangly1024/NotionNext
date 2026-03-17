import { HashTag } from '@/components/HeroIcons'
import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={
        'cursor-pointer inline-block hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 px-2 py-1 rounded-2xl bg-gray-50 dark:bg-indigo-900/20 dark:text-gray-300 border border-gray-200 dark:border-indigo-700/30 duration-200 text-sm whitespace-nowrap '
      }>
      <div className='font-light flex items-center'>
        <HashTag className='stroke-2 mr-0.5 w-3 h-3' />{' '}
        {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
