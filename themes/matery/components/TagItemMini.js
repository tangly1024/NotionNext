import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={`cursor-pointer inline-block rounded-xl  hover:text-white duration-200
        mr-2 py-0.5 px-2 text-xs whitespace-nowrap text-white bg-indigo-700`}>

      <div className='font-light'>{selected && <i className='mr-1 fa-tag'/>} {tag.name + (tag.count ? `(${tag.count})` : '')} </div>

    </SmartLink>
  )
}

export default TagItemMini
