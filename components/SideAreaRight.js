import LatestPostsGroup from '@/components/LatestPostsGroup'
import TagGroups from '@/components/TagGroups'
import { useGlobal } from '@/lib/global'
import {
  faAngleDoubleRight,
  faArchive,
  faTags,
  faThList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import CategoryGroup from './CategoryGroup'

/**
 * 侧边平铺
 * @param tags
 * @param currentTag
 * @param post
 * @param posts
 * @param categories
 * @param currentCategory
 * @param currentSearch
 * @returns {JSX.Element}
 * @constructor
 */
const SideAreaRight = ({
  title,
  tags,
  currentTag,
  post,
  posts,
  categories,
  currentCategory,
  currentSearch
}) => {
  const { locale } = useGlobal()

  return (
    <>
      <section className="rounded-xl shadow-md py-4 px-2 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
        {/* 展示广告  */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-adtest="on"
          data-ad-client="ca-pub-2708419466378217"
          data-ad-slot="8807314373"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </section>

      <div className="sticky top-10">
        {/* 最新文章 */}
        {posts && (
          <section className="rounded-xl shadow-md py-4 mt-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
            <div className="text-sm pb-2 px-5  flex flex-nowrap justify-between">
              <div className="font-light text-gray-600  dark:text-gray-200">
                <FontAwesomeIcon icon={faArchive} className="mr-2" />
                {locale.COMMON.LATEST_POSTS}
                <span className='text-red-500 text-xs ml-1'>NEW</span>
              </div>
            </div>
            <LatestPostsGroup posts={posts} />
          </section>
        )}

        {/* 标签云  */}
        {tags && (
          <section className="rounded-xl shadow-md py-4 mt-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
            <div className="text-sm pb-1 px-5 flex flex-nowrap justify-between font-light dark:text-gray-200">
              <div className="text-gray-600 dark:text-gray-200">
                <FontAwesomeIcon icon={faTags} className="mr-2" />
                {locale.COMMON.TAGS}
              </div>
              <Link href="/tag" passHref>
                <a className="text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer">
                  {locale.COMMON.MORE}{' '}
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </a>
              </Link>
            </div>
            <div className="px-5 pt-2">
              <TagGroups tags={tags} currentTag={currentTag} />
            </div>
          </section>
        )}

        {/* 分类  */}
        {post && categories && (
          <section className='rounded-xl shadow-md py-4 mt-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200'>
            <div className='text-sm px-5 mb-2 flex flex-nowrap justify-between font-light'>
              <div className='pb-1 text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div>
              <Link href='/category' passHref>
                <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                  {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} />
                </a>
              </Link>
            </div>
            <CategoryGroup currentCategory={currentCategory} categories={categories} />
          </section>
        )}
      </div>
    </>
  )
}
export default SideAreaRight
