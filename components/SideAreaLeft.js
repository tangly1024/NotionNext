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

    <section className={(!post ? 'sticky top-8 ' : ' ') + ' w-60'}>
      <section className='shadow hidden lg:block mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200 py-6'>
        <InfoCard postCount={postCount} />
      </section>

      {/* 菜单 */}
      <section className='shadow hidden lg:block mb-5 py-4  bg-white dark:bg-gray-800  hover:shadow-xl duration-200'>
        <MenuButtonGroup allowCollapse={true} />
        <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>
      </section>

      {/* 统计 */}
      <section className='shadow hidden lg:block mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200 py-4'>
        <Analytics postCount={postCount}/>
      </section>

    </section>

    {showToc && (
      <section className='shadow sticky top-8 pb-20  bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
        <div className='border-b text-center text-2xl bg-white text-black dark:border-gray-700 dark:bg-gray-700 dark:text-white py-6 px-6'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <Toc toc={post.toc} targetRef={targetRef} />
      </section>
    )}

 </>
}
export default SideAreaLeft
