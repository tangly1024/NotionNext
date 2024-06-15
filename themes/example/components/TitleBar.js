import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 标题栏
 */
export default function TitleBar(props) {
  const { post } = props
  const { fullWidth, siteInfo } = useGlobal()

  const title = post?.title || siteConfig('TITLE')
  const description = post?.description || siteConfig('AUTHOR')
  const headerImage = post?.pageCoverThumbnail
    ? post.pageCoverThumbnail
    : siteInfo?.pageCover

  const TITLE_BG = siteConfig('EXAMPLE_TITLE_IMAGE', false, CONFIG)

  return (
    <>
      {/* 标题栏 */}
      {!fullWidth && (
        <div className='relative overflow-hidden text-center px-6 py-12 mb-6 bg-gray-100 dark:bg-hexo-black-gray dark:border-hexo-black-gray border-b'>
          <h1 className='title-1 relative text-xl md:text-4xl pb-4 z-10'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post?.pageIcon} />
            )}
            {title}
          </h1>
          <p className='title-2 relative leading-loose text-gray-dark z-10'>
            {description}
          </p>
          {TITLE_BG && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headerImage}
                className='absolute object-cover top-0 left-0 w-full h-full select-none opacity-70 z-0'
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
