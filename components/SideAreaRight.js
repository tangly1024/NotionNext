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
import Analytics from './Analytics'
import CategoryGroup from './CategoryGroup'
import InfoCard from './InfoCard'
import MenuButtonGroup from './MenuButtonGroup'
import SearchInput from './SearchInput'
import Toc from './Toc'

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
  currentSearch,
  targetRef
}) => {
  const { locale } = useGlobal()
  const postCount = posts?.length || 0
  const showToc = post && post.toc && post.toc.length > 1

  return (
    <>

<section className='hidden lg:block mb-5 bg-white dark:bg-gray-800 rounded-xl hover:shadow-2xl duration-200 py-8 shadow-md'>
        <InfoCard postCount={postCount} />
      </section>

      {/* 菜单 */}
      <section className='hidden lg:block mb-5 py-5 rounded-xl shadow-md bg-white dark:bg-gray-800  hover:shadow-2xl duration-200'>
        <MenuButtonGroup allowCollapse={true} />
        <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>
      </section>

      <section className="rounded-xl shadow-md mb-5 py-4 px-2 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
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

      <Analytics postCount={postCount}/>

      <div className="sticky top-8">
          {showToc && (
          <section className='pb-10 mb-5 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-2xl duration-200'>
            <div className='border-b text-center text-2xl bg-white text-black rounded-t-xl dark:border-gray-700 dark:bg-gray-700 dark:text-white py-6 px-6'>
              {locale.COMMON.TABLE_OF_CONTENTS}
            </div>
            <Toc toc={post.toc} targetRef={targetRef} />
          </section>
          )}

        {/* 最新文章 */}
        {posts && (
          <section className="rounded-xl shadow-md py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
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

        {/* <section className="rounded-xl shadow-md py-4 px-5 mb-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
          <SearchInput currentTag={currentTag} currentSearch={currentSearch}/>
        </section> */}

        {/* 标签云  */}
        {tags && (
          <section className="rounded-xl shadow-md py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200">
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
        {categories && (
          <section className='rounded-xl shadow-md py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-2xl duration-200'>
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
