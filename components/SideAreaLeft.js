import InfoCard from '@/components/InfoCard'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import SearchInput from '@/components/SearchInput'
import Toc from '@/components/Toc'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Analytics from './Analytics'

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
const SideAreaLeft = ({ title, tags, currentTag, post, posts, categories, currentCategory, currentSearch, targetRef }) => {
  const { locale } = useGlobal()
  const showToc = post && post.toc && post.toc.length > 1
  const postCount = posts?.length || 0
  return <>

    <div className={(!post ? 'sticky top-8 ' : ' ') + ' w-60'}>
      <section className='hidden lg:block mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
        <InfoCard postCount={postCount} />
      </section>

      {/* 菜单 */}
      <section className='hidden lg:block mb-5 py-4  bg-white dark:bg-gray-800  hover:shadow-xl duration-200'>
        <MenuButtonGroup allowCollapse={true} />
        <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>
      </section>

      {/* 统计 */}
      <Analytics postCount={postCount}/>

      {/* 分类  */}
      {/* { categories && ( */}
      {/*  <section className='  py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200'> */}
      {/*    <div className='text-sm px-5 mb-2 flex flex-nowrap justify-between font-light'> */}
      {/*      <div className='pb-1 text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div> */}
      {/*      <Link href='/category' passHref> */}
      {/*        <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'> */}
      {/*          {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} /> */}
      {/*        </a> */}
      {/*      </Link> */}
      {/*    </div> */}
      {/*    <CategoryGroup currentCategory={currentCategory} categories={categories} /> */}
      {/*  </section> */}
      {/* )} */}
    </div>

    {showToc && (
      <section className='sticky top-8 pb-20  bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
        <div className='border-b text-center text-2xl bg-white text-black dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 py-6 px-6'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <Toc toc={post.toc} targetRef={targetRef} />
      </section>
    )}
 </>
}
export default SideAreaLeft
