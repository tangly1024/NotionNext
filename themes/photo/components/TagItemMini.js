import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={'inline-block rounded-xl py-0.5 mr-2'}
    >
      <div className="text-md font-bold text-shadow text-[#2EBF8B]">
        {selected && <i className="mr-1 fa-tag" />}{' '}
        {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
