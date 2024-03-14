import Link from 'next/link'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <Link
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={
        'inline-block text-md font-extrabold rounded-xl text-shadow py-0.5 mr-2 text-[#2EBF8B]'
      }
    >
      <div className="font-light">
        {selected && <i className="mr-1 fa-tag" />}{' '}
        {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
      </div>
    </Link>
  )
}

export default TagItemMini
