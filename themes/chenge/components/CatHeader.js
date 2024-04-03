import Link from 'next/link'
import TagItemMini from './TagItemMini'
import { useGlobal } from '@/lib/global'
import NotionIcon from '@/components/NotionIcon'
import LazyImage from '@/components/LazyImage'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router';

/**
 * 归档/近期/标签页的头部
 * @param {*} props
 * @returns
 */
export default function CatHeader({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal()
  const router = useRouter()

  const getCategoryName = () => {
    switch(router.route) {
      case '/archive':
        return (
          <div>
            <i className="fas fa-clock-rotate-left"> &nbsp; </i>
            {locale.NAV.ARCHIVE}
          </div>  )
      case '/category':
        return (
          <div>
            <i className="fas fa-th"> &nbsp; </i>
            {locale.COMMON.CATEGORY}
          </div>  ); 
      case '/tag':
        return (
          <div>
            <i className="fas fa-tag"> &nbsp; </i>
            {locale.COMMON.TAGS}
          </div>  ); 
      case '/memos':
        return (
          <div>
            <i className="fa-solid fa-wand-magic-sparkles"> &nbsp; </i>
            {locale.COMMON.MEMOS}
          </div>  ); 
      default:
        return 'UnKnown'; 
    }
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover

  return (
    <div id="header" className="w-full h-[50vh] relative md:flex-shrink-0 z-10 min-h-[25rem] min-w-[25rem] flex flex-col justify-center items-center" >
      <LazyImage priority={true} src={headerImage} className='w-full h-full object-cover object-center absolute top-0'/>
      <div id = 'article-header-cover' className='bg-black bg-opacity-70 absolute top-0 w-full h-full py-10' />
      <header className="flex flex-col justify-center items-center z-10">
        <div className="leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white">
          {getCategoryName()}
        </div>
      </header>
      {/* 波浪效果 */}
      <div id="waves" className="absolute bottom-0 w-full">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" />
              <use xlinkHref="#gentle-wave" x="48" y="3" />
              <use xlinkHref="#gentle-wave" x="48" y="5" />
              <use xlinkHref="#gentle-wave" x="48" y="7" />
            </g>
          </svg>
        </div>
    </div>
  )
}
