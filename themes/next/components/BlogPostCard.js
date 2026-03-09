import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import Card from './Card'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({ post, index, showSummary }) => {
  const { locale } = useGlobal()
  const showPreview =
    siteConfig('NEXT_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  // 动画样式  首屏卡片不用，后面翻出来的加动画
  const aosProps =
    index > 2
      ? {
          'data-aos': 'fade-down',
          'data-aos-duration': '400',
          'data-aos-once': 'true',
          'data-aos-anchor-placement': 'top-bottom'
        }
      : {}

  return (
    <Card className='w-full'>
      <div
        key={post.id}
        className='flex flex-col-reverse justify-between duration-300'>
        <div className='lg:p-8 p-4 flex flex-col w-full'>
          {/* 文章标题 */}
          <SmartLink
            {...aosProps}
            href={post?.href}
            passHref
            className={`cursor-pointer text-3xl ${showPreview ? 'text-center' : ''} leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}{' '}
            <span className='menu-link'>{post.title}</span>
          </SmartLink>

          <div
            {...aosProps}
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'} flex-wrap dark:text-gray-500 text-gray-500 `}>
            <div>
              {post.category && (
                <>
                  <SmartLink
                    href={`/category/${post.category}`}
                    passHref
                    className='hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer font-light text-sm transform'>
                    <i className='mr-1 fas fa-folder' />
                    <span className='menu-link'>{post.category}</span>
                  </SmartLink>
                  <span className='mx-2'>|</span>
                </>
              )}
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                passHref
                className='hover:text-blue-500 dark:hover:text-blue-400 font-light cursor-pointer text-sm leading-4 mr-3'>
                <span className='menu-link'>{post.date?.start_date}</span>
              </SmartLink>
            </div>

            <TwikooCommentCount
              post={post}
              className='hover:text-blue-500 dark:hover:text-blue-400 hover:underline text-sm'
            />

            <div className='hover:text-blue-500 dark:hover:text-blue-400  md:flex-nowrap flex-wrap md:justify-start inline-block'>
              {post.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
            </div>
          </div>

          {(!showPreview || showSummary) && !post.results && (
            <p
              {...aosProps}
              className='mt-4 mb-12 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
              {post.summary}
            </p>
          )}

          {/* 搜索结果 */}
          {post.results && (
            <p className='line-clamp-4 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
              {post.results.map((r, index) => (
                <span key={index}>{r}</span>
              ))}
            </p>
          )}

          {showPreview && post?.blockMap && (
            <div className='overflow-ellipsis truncate'>
              <NotionPage post={post} />
            </div>
          )}

          <div className='text-right border-t pt-8 border-dashed'>
            <SmartLink
              href={post?.href}
              className='hover:bg-opacity-100 hover:underline transform duration-300 p-3 text-white bg-gray-800 cursor-pointer'>
              {locale.COMMON.ARTICLE_DETAIL}
              <i className='ml-1 fas fa-angle-right' />
            </SmartLink>
          </div>
        </div>

        {siteConfig('NEXT_POST_LIST_COVER', null, CONFIG) &&
          post?.pageCoverThumbnail && (
            <SmartLink href={post?.href} passHref legacyBehavior>
              <div className='h-72 w-full relative duration-200 cursor-pointer transform overflow-hidden'>
                <Image
                  className='hover:scale-105 transform duration-500'
                  src={post?.pageCoverThumbnail}
                  alt={post.title}
                  layout='fill'
                  objectFit='cover'
                  loading='lazy'
                />
              </div>
            </SmartLink>
          )}
      </div>
    </Card>
  )
}

export default BlogPostCard
