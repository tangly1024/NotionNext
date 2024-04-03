import Card from './Card'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import Progress from './Progress'
import { AnalyticsCard } from './AnalyticsCard'
import CONFIG from '../config'
import dynamic from 'next/dynamic'
import Announcement from './Announcement'
import { useGlobal } from '@/lib/global'
import Live2D from '@/components/Live2D'
import { siteConfig } from '@/lib/config'
import { useEffect, useState, useCallback } from 'react';
import throttle from 'lodash.throttle';

const HexoRecentComments = dynamic(() => import('./HexoRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post, currentCategory, categories, latestPosts, tags,
    currentTag, showCategory, showTag, rightAreaSlot, notice, className
  } = props

  const { locale } = useGlobal()

  // 文章全屏处理
  if (post && post?.fullWidth) {
    return null
  }

  // 判断是否在文章页面，并且文章有目录
  const isArticlePage = post && post.toc && post.toc.length > 1;

  const [showFloatButton, switchShow] = useState(false)
  const scrollListener = useCallback(throttle(() => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 300

    // 直接使用状态更新函数，避免依赖外部状态变量
    switchShow(show => shouldShow !== show ? shouldShow : show)
  }, 200))

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <div id='sideRight' className={`hidden ${className} sticky top-10 overflow-y-auto overflow-x-hidden max-h-screen scroll-hidden text-hexo-front lg:block`}>
      {isArticlePage ? (
        <>     
          <div className='pt-8'>
            <Catalog toc={post.toc} props={props} />
            {rightAreaSlot}
            <FaceBookPage/>
            <Live2D />
          </div>
        </>
      ): (
      <>
        <InfoCard {...props} />
        {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) && latestPosts && latestPosts.length > 0 && <div className={`${className} pb-20`}><LatestPostsGroup {...props} /></div>}
        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && <AnalyticsCard {...props} />}

        {showCategory && (
          <Card>
            <div className='ml-2 mb-1 '>
              <i className='fas fa-th' /> {locale.COMMON.CATEGORY}
            </div>
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categories}
            />
          </Card>
        )}
        {showTag && (
          <Card>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}

        <Announcement post={notice}/>

        {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') && <HexoRecentComments/>}
        <div className='sticky top-7'>
            {rightAreaSlot}
            <FaceBookPage/>
            <Live2D />
          </div>
      </>
      )}
      {/* 进度条 */}
      <div className={(showFloatButton ? 'opacity-100 ' : 'invisible opacity-0 ') + `duration-200 transition-all fixed bottom-0 l-0 z-50 w-full max-w-[200px]`}><Progress /></div>
    </div>
  )
}
