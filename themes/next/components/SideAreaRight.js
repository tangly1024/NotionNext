import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import React from 'react'
import Card from './Card'
import CategoryGroup from './CategoryGroup'
import TagGroups from './TagGroups'
import CONFIG_NEXT from '../config_next'
import { useRouter } from 'next/router'
import NextRecentComments from './NextRecentComments'
import BLOG from '@/blog.config'

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
  const { tags, currentTag, slot, categories, currentCategory } = props
  const { locale } = useGlobal()
  if (!CONFIG_NEXT.RIGHT_BAR) {
    return <></>
  }
  const router = useRouter()
  return (<aside id='right' className='hidden 2xl:block flex-col w-60 ml-4'>

      {CONFIG_NEXT.RIGHT_AD && <Card className='mb-2'>
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

      <div className="sticky top-4">
        {slot}

        {/* 分类  */}
        {CONFIG_NEXT.RIGHT_CATEGORY_LIST && router.asPath !== '/category' && categories && (
          <Card>
            <div className='text-sm px-2 flex flex-nowrap justify-between font-light'>
              <div className='pb-2 text-gray-600 dark:text-gray-300'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
              <Link href={'/category'} passHref>
                <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                  {locale.COMMON.MORE} <i className='fas fa-angle-right' />
                </a>
              </Link>
            </div>
            <CategoryGroup currentCategory={currentCategory} categories={categories} />
          </Card>
        )}

         {CONFIG_NEXT.RIGHT_TAG_LIST && router.asPath !== '/tag' && tags && (
          <Card>
            <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
              <div className="text-gray-600 dark:text-gray-200">
                <i className="mr-2 fas fa-tag" />
                {locale.COMMON.TAGS}
              </div>
              <Link href={'/tag'} passHref>
                <a className="text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer">
                  {locale.COMMON.MORE}{' '}
                  <i className='fas fa-angle-double-right' />
                </a>
              </Link>
            </div>
            <div className="px-2 pt-2">
              <TagGroups tags={tags} currentTag={currentTag} />
            </div>
          </Card>
         )}

        {BLOG.COMMENT_WALINE_SERVER_URL && BLOG.COMMENT_WALINE_RECENT && <Card>
            <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
              <div className="text-gray-600 dark:text-gray-200">
                <i className="mr-2 fas fa-tag" />
                {locale.COMMON.RECENT_COMMENTS}
              </div>
            </div>
            <div className="px-2 pt-2">
                <NextRecentComments/>
            </div>
         </Card>}

      </div>
    </aside>
  )
}
export default SideAreaRight
