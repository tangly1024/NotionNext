import CategoryGroup from '@/components/CategoryGroup'
import InfoCard from '@/components/InfoCard'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import SearchInput from '@/components/SearchInput'
import Toc from '@/components/Toc'
import { useGlobal } from '@/lib/global'
import { faAngleDoubleRight, faThList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

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
const SideArea = ({ title, tags, currentTag, post, posts, categories, currentCategory, currentSearch }) => {
  const { locale } = useGlobal()

  return <aside id='sidebar' className='scroll-hidden h-full w-72 z-10'>

    <div className={(!post ? 'sticky top-5' : '') + ' pb-4'}>

      <section className='hidden lg:block bg-white dark:bg-gray-800 rounded-xl hover:shadow-2xl duration-200 py-8 shadow-md'>
        <InfoCard />
      </section>

      {/* 菜单 */}
      <section className='hidden lg:block mt-5 py-5 rounded-xl shadow-md bg-white dark:bg-gray-800  hover:shadow-2xl duration-200'>
        <MenuButtonGroup allowCollapse={true} />
        <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>
      </section>

      {/* 分类  */}
      {!post && categories && (
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

    {post && post.toc && post.toc.length > 1 && (
      <section id='left-toc' className='sticky top-6 pb-20 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-2xl duration-200'>
        <div className='border-b text-2xl bg-white text-black rounded-t-xl dark:border-gray-700 dark:bg-gray-700 dark:text-white py-6 px-6'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <Toc toc={post.toc} />
      </section>
    )}

  </aside>
}
export default SideArea
