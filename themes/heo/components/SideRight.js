import dynamic from 'next/dynamic'
import Card from './Card'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import TouchMeCard from './TouchMeCard'
import { memo, useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useMediaQuery } from 'react-responsive'
import tailwindBreakpoints from '../../../tailwind.screens'
import TagGroups from './TagGroups'

const AnalyticsCard = dynamic(() =>
  import('./AnalyticsCard').then(m => m.AnalyticsCard)
)
const Live2D = dynamic(() => import('@/components/Live2D'), { ssr: false })
const LatestPostsGroupMini = dynamic(() => import('./LatestPostsGroupMini'))
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
export default memo(function SideRight(props) {
  const { post, tagOptions, currentTag, rightAreaSlot } = props
  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE')
  const FACEBOOK_APP_ID = siteConfig('FACEBOOK_APP_ID')
  const showPet = siteConfig('WIDGET_PET')
  const [showSideRight, setShowSideRight] = useState(false)
  const isXl = useMediaQuery({
    query: `(min-width: ${tailwindBreakpoints.xl})`
  })

  useEffect(() => {
    setShowSideRight(isXl)
  }, [isXl])

  return (
    showSideRight && (
      <div id='sideRight' className='hidden xl:block w-72 space-y-4 h-full'>
        <InfoCard {...props} className='w-72 wow fadeInUp' />

        <div className='sticky top-20 space-y-4'>
          {/* 文章页显示目录 */}
          {post && post.toc && post.toc.length > 0 && (
            <Card className='bg-white dark:bg-[#1e1e1e] wow fadeInUp'>
              <Catalog toc={post.toc} />
            </Card>
          )}
          {/* 联系交流群 */}
          <div className='wow fadeInUp'>
            <TouchMeCard />
          </div>
          {/* 最新文章列表 */}
          <div
            className={
              'border wow fadeInUp  hover:border-indigo-600  dark:hover:border-yellow-600 duration-200 dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white rounded-xl lg:p-6 p-4 hidden lg:block bg-white'
            }>
            <LatestPostsGroupMini {...props} />
          </div>
          {rightAreaSlot}
          {FACEBOOK_PAGE && FACEBOOK_APP_ID && <FaceBookPage />}
          {showPet && <Live2D />}
          {/* 标签和成绩 */}
          <Card
            className={
              'bg-white dark:bg-[#1e1e1e] dark:text-white hover:border-indigo-600  dark:hover:border-yellow-600 duration-200'
            }>
            <TagGroups
              tags={tagOptions?.slice(0, 30) || []}
              currentTag={currentTag}
            />
            <hr className='mx-1 flex border-dashed relative my-4' />
            <AnalyticsCard {...props} />
          </Card>
        </div>
      </div>
    )
  )
})
