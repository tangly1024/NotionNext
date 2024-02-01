import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import Card from './Card'
import CategoryGroup from './CategoryGroup'
import TagGroups from './TagGroups'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Announcement from './Announcement'
import LatestPostsGroup from './LatestPostsGroup'
import { siteConfig } from '@/lib/config'
const NextRecentComments = dynamic(() => import('./NextRecentComments'))

/**
 * 侧边平铺
 * @param tags
 * @param currentTag
 * @param post
 * @param categories
 * @param currentCategory
 * @returns {JSX.Element}
 * @constructor
 */
const SideAreaRight = (props) => {
  const { tagOptions, currentTag, slot, categoryOptions, currentCategory, notice, latestPosts } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const announcementVisible = notice && Object.keys(notice).length > 0

  return (<aside id='right' className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'mr-4' : 'ml-4') + ' space-y-4 hidden xl:block flex-col w-60 relative z-10'}>

        {siteConfig('NEXT_RIGHT_AD', null, CONFIG) && <Card className='mb-2'>
            {/* 展示广告  */}
            <ins
                className='adsbygoogle'
                style={{ display: 'block' }}
                data-adtest='on'
                data-ad-client='ca-pub-2708419466378217'
                data-ad-slot='8807314373'
                data-ad-format='auto'
                data-full-width-responsive='true'
            />
        </Card>}

        <div className="sticky top-0 space-y-4 w-full">

            {announcementVisible && <Card>
                <Announcement post={notice} />
            </Card>}

            {siteConfig('NEXT_RIGHT_LATEST_POSTS', null, CONFIG) && <Card><LatestPostsGroup latestPosts={latestPosts} /></Card>}
            {slot}

            {/* 分类  */}
            {siteConfig('NEXT_RIGHT_CATEGORY_LIST', null, CONFIG) && router.asPath !== '/category' && categoryOptions && (
                <Card>
                    <div className='text-sm px-2 flex flex-nowrap justify-between font-light'>
                        <div className='pb-2 text-gray-600 dark:text-gray-300'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
                        <Link
                            href={'/category'}
                            passHref
                            className='text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>

                            {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />

                        </Link>
                    </div>
                    <CategoryGroup currentCategory={currentCategory} categories={categoryOptions} />
                </Card>
            )}

            {siteConfig('NEXT_RIGHT_TAG_LIST', null, CONFIG) && router.asPath !== '/tag' && tagOptions && (
                <Card>
                    <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
                        <div className="text-gray-600 dark:text-gray-200">
                            <i className="mr-2 fas fa-tag" />
                            {locale.COMMON.TAGS}
                        </div>
                        <Link
                            href={'/tag'}
                            passHref
                            className="text-gray-500 hover:text-black  dark:hover:text-white hover:underline cursor-pointer">

                            {locale.COMMON.MORE}{' '}
                            <i className='fas fa-angle-double-right' />

                        </Link>
                    </div>
                    <div className="px-2 pt-2">
                        <TagGroups tags={tagOptions} currentTag={currentTag} />
                    </div>
                </Card>
            )}

            {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') && <Card>
                <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
                    <div className="text-gray-600 dark:text-gray-200">
                        <i className="mr-2 fas fa-tag" />
                        {locale.COMMON.RECENT_COMMENTS}
                    </div>
                </div>
                <div className="px-2 pt-2">
                    <NextRecentComments />
                </div>
            </Card>}

        </div>
    </aside>
  )
}
export default SideAreaRight
