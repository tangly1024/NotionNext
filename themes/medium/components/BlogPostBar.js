import { useGlobal } from '@/lib/global'

/**
 * 文章列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogPostBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return <div className='flex items-center  py-8'><div className='text-xl'><i className='mr-2 fas fa-tag' />{locale.COMMON.TAGS}:</div>{tag}</div>
  } else if (category) {
        <div className='flex items-center  py-8'><div className='text-xl'><i className='mr-2 fas fa-th' />{locale.COMMON.CATEGORY}:</div>{category}</div>
  } else {
    return <></>
  }
}
