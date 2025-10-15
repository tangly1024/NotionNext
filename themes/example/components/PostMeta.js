import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
/**
 * 文章详情的元信息
 * 标题、作者、分类、标签、创建日期等等。
 */
export const PostMeta = props => {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <section className='flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8'>
      <div>
        {post?.type !== 'Page' && (
          <>
            <SmartLink
              href={`/category/${post?.category}`}
              passHref
              className='cursor-pointer text-md mr-2 hover:text-black dark:hover:text-white border-b dark:border-gray-500 border-dashed'>
              <i className='mr-1 fas fa-folder-open' />
              {post?.category}
            </SmartLink>
            <span className='mr-2'>|</span>
          </>
        )}

        {post?.type !== 'Page' && (
          <>
            <SmartLink
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              passHref
              className='pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed'>
              {post?.publishDay}
            </SmartLink>
            <span className='mr-2'>|</span>
            <span className='mx-2 text-gray-400 dark:text-gray-500'>
              {locale.COMMON.LAST_EDITED_TIME}: {post?.lastEditedDay}
            </span>
            <span className='mr-2'>|</span>
            <span className='hidden busuanzi_container_page_pv font-light mr-2'>
              <i className='mr-1 fas fa-eye' />
              &nbsp;
              <span className='mr-2 busuanzi_value_page_pv' />
            </span>
          </>
        )}
      </div>
    </section>
  )
}
