import { HashTag } from '@/components/HeroIcons'
import Link from 'next/link'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <Link
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={'cursor-pointer inline-block hover:text-blue-600  duration-200 py-0.5 px-1 text-sm whitespace-nowrap ' }>
      <div className='font-light flex items-center'><HashTag className='text-gray-500 w-3 h-3'/> {tag.name + (tag.count ? `(${tag.count})` : '')} </div>

    </Link>
  )
}

export default TagItemMini
