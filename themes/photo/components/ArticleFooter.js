import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'

/**
 * 文章页脚
 * @param {*} props
 * @returns
 */
export default function ArticleFooter(props) {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <>
      {/* 分类和标签部分 */}
      <div className='flex gap-3 font-semibold text-sm items-center justify-center'>
        {/* 分类标签（如果文章不是“页面”类型） */}
        {post?.type !== 'Page' && (
          <>
            <Link
              href={`/category/${post?.category}`}
              passHref
              className='cursor-pointer text-md mr-2 text-green-500'>
              {post?.category}
            </Link>
          </>
        )}

        {/* 标签部分（若文章有标签） */}
        <div className='flex py-1 space-x-3'>
          {post?.tags?.length > 0 && (
            <>
              {locale.COMMON.TAGS} <span>:</span>
            </>
          )}
          {/* 显示所有标签 */}
          {post?.tags?.map(tag => {
            return (
              <Link
                href={`/tag/${tag}`}
                key={tag}
                className='text-yellow-500 mr-2'>
                {tag}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 发布日期信息 */}
      {/* 将发布日期移至文章底部并设置样式 */}
      <div
        className='text-center mt-6'
        style={{
          fontSize: '12px', // 设置字体大小为 12px
          fontWeight: '300', // 设置字体粗细为细体
          color: 'gray' // 设置文字颜色为灰色
        }}>
        <Link
          href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
          passHref
          className='pl-1 cursor-pointer'>
          {post?.publishDay}
        </Link>
      </div>
    </>
  )
}
