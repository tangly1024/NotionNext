import { useGlobal } from '@/lib/global'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function SlotBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return (
      <div className='cursor-pointer px-3 py-2 mb-2 '>
        <div className={'inline-block rounded duration-200 mr-2  px-1 text-xl whitespace-nowrap '}>
          <div className=' dark:text-white dark:hover:text-white text-5xl py-5'>
            {locale.COMMON.TAGS} : {tag}{' '}
          </div>
        </div>
        <hr className='dark:border-gray-600' />
      </div>
    )
  } else if (category) {
    return (
      <div className='cursor-pointer px-3 py-2 mb-2 '>
        <div className=' dark:text-white dark:hover:text-white text-5xl py-5'>
          {locale.COMMON.CATEGORY} : {category}
        </div>
        <hr className='dark:border-gray-600' />
      </div>
    )
  }
  return <></>
}
