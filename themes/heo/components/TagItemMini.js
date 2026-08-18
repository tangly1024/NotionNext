import { HashTag } from '@/components/HeroIcons'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { buildSlugMap, toSlug } from '@/lib/utils/slugMap'

const TagItemMini = ({ tag, selected = false }) => {
  const { tagOptions } = useGlobal()
  const slugMap = buildSlugMap(tagOptions?.map(t => t.name) || [])
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(toSlug(tag.name, slugMap))}`}
      passHref
      className={
        'cursor-pointer inline-block hover:text-[var(--heo-color-primary-text)] hover:bg-[var(--heo-color-primary)] dark:hover:bg-[var(--heo-color-accent)] px-2 py-1 rounded-2xl dark:text-white duration-200 text-sm whitespace-nowrap '
      }>
      <div className='font-light flex items-center'>
        <HashTag className='stroke-2 mr-0.5 w-3 h-3' />{' '}
        {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
