import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import CONFIG from '../config'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'
import dayjs from 'dayjs'


const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = siteConfig('MEDIUM_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  const { locale } = useGlobal()

  // 计算文本实际显示长度（中文字符算2个长度，英文算1个）
  const getTextLength = (text) => {
    if (!text) return 0
    return text.split('').reduce((len, char) => {
      return len + (/[\u4e00-\u9fa5]/.test(char) ? 2 : 1)
    }, 0)
  }

  // 截取指定显示长度的文本
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    let result = ''
    let currentLength = 0
    
    for (let char of text) {
      const charLength = /[\u4e00-\u9fa5]/.test(char) ? 2 : 1
      if (currentLength + charLength > maxLength) {
        break
      }
      result += char
      currentLength += charLength
    }
    
    return result + (currentLength < getTextLength(text) ? '...' : '')
  }

  return (
    <div
      key={post.id}
      data-aos='fade-up'
      data-aos-duration='300'
      data-aos-once='false'
      data-aos-anchor-placement='top-bottom'
      className='mb-8 w-full border-b border-gray-100 pb-6 dark:border-gray-800'>

      {/* 主体：左文字右缩略图 */}
      <div className='flex px-4 flex-row justify-between items-start'>

        {/* 左边：文字区域 */}
        <div className='flex flex-col w-[72%] pr-4'>

          {/* 标题 */}
          <Link
            href={post?.href}
            passHref
            className='cursor-pointer font-bold text-base md:text-xl text-gray-800 dark:text-gray-200 hover:text-green-500'>
            <h2 className='leading-snug'>
              {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post.pageIcon} />}
              {post.title}
            </h2>
          </Link>

          {/* 摘要 */}
          {(!showPreview || showSummary) && (
         <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
              {post.summary && truncateText(post.summary, 52)}
</div>
          )}
        </div>

        {/* 右边：缩略图 */}
        {siteConfig('MEDIUM_POST_LIST_COVER', null, CONFIG) && post.pageCoverThumbnail && (
<Link
  href={post?.href}
  passHref
  className='w-[26%] md:w-[22%] lg:w-[18%] flex-shrink-0'>
  <div className='w-full aspect-[4/3] overflow-hidden rounded-[2px] md:rounded-[4px]'>
    <LazyImage
      src={post.pageCoverThumbnail}
      className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
      alt={post.title}
    />
  </div>
</Link>
        )}
      </div>

      {/* Meta信息行 - 移到底部 */}
      <div className='flex px-4 flex-wrap items-center text-sm text-gray-500 space-x-3 mt-4'>
        {post.date?.start_date && (
          <div>
            {dayjs(post.date.start_date).year() === dayjs().year()
              ? dayjs(post.date.start_date).format('MMM D')
              : dayjs(post.date.start_date).format('MMM D, YYYY')}
          </div>
        )}

        {siteConfig('MEDIUM_POST_LIST_CATEGORY', null, CONFIG) && (
          <CategoryItem category={post.category} />
        )}
        {siteConfig('MEDIUM_POST_LIST_TAG', null, CONFIG) &&
          post?.tagItems?.map(tag => (
            <TagItemMini key={tag.name} tag={tag} />
          ))}
        <TwikooCommentCount post={post} />
      </div>
    </div>
  )
}

export default BlogPostCard
