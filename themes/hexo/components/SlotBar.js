import Link from 'next/link'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function SlotBar(props) {
  const { tag, category } = props

  if (tag) {
    return <div className="cursor-pointer px-3 py-2 mb-2 font-light hover:text-indigo-700 dark:hover:text-indigo-400 transform dark:text-white">
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} passHref
                  className={'cursor-pointer inline-block rounded duration-200 mr-2 py-0.5 px-1 text-xl whitespace-nowrap '}>
                  <div className='font-light dark:text-gray-400 dark:hover:text-white'> #{tag} </div>
              </Link>
          </div>
  } else if (category) {
    return <div className="cursor-pointer text-lg px-5 py-1 mb-2 font-light hover:text-indigo-700 dark:hover:text-indigo-400 transform dark:text-white">
              <i className="mr-1 far fa-folder-open" />  {category}
          </div>
  }
  return <></>
}
