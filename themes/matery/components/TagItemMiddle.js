import Link from 'next/link'

const TagItemMiddle = ({ tag, selected = false }) => {
  return (
      <Link
          key={tag}
          href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
          passHref
          className={`cursor-pointer inline-block rounded-xl  hover:text-white duration-200
        mr-2 py-0.5 px-2 text-md whitespace-nowrap text-white  ${selected ? 'bg-black' : 'bg-indigo-700'}`}>

          <div className='font-light'>
              {selected && <i className='mr-1 fas fa-tag' />}
              {tag.name + (tag.count ? `(${tag.count})` : '')} </div>

      </Link>
  )
}

export default TagItemMiddle
