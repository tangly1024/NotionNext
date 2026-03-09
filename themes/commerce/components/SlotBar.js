import SmartLink from '@/components/SmartLink'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function SlotBar(props) {
  const { tag, category } = props

  if (tag) {
    return <div className="cursor-pointer px-3 py-2 mb-4 font-light hover:text-red-700 dark:hover:text-red-400 transform dark:text-white">
              <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`} passHref
                  className={'cursor-pointer inline-block rounded duration-200 mr-2 py-0.5 px-1 text-xl whitespace-nowrap '}>
                  <div className='border-b-2 border-[#D2232A] font-light dark:text-gray-400 dark:hover:text-white'> #{tag} </div>
              </SmartLink>
          </div>
  } else if (category) {
    return <div className="cursor-pointer text-lg px-5  mb-4 font-light hover:text-red-700 dark:hover:text-red-400 transform dark:text-white">
             <span className='border-b-2 pb-4 font-bold border-[#D2232A]'>{category}</span>
          </div>
  }
  return <></>
}
