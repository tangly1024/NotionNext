import InfoCard from '@/components/InfoCard'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import SearchInput from '@/components/SearchInput'
import Toc from '@/components/Toc'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Analytics from './Analytics'
import Tabs from '@/components/Tabs'
import BLOG from '@/blog.config'

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
  return <aside id='left' className='hidden lg:block flex-col w-60 mr-4'>

    <section className='sticky top-8 w-60'>

      {/* 菜单 */}
      <section className='shadow hidden lg:block mb-5 py-4 bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
        <MenuButtonGroup allowCollapse={true} />
        {BLOG.menu.showSearch && <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>}
      </section>

      <Tabs>
          {showToc && (
            <div key={locale.COMMON.TABLE_OF_CONTENTS} className='dark:text-gray-400 text-gray-600 bg-white dark:bg-gray-800 duration-200'>
              <Toc toc={post.toc} targetRef={targetRef} />
            </div>
          )}

          <div key={locale.NAV.ABOUT} className='mb-5 bg-white dark:bg-gray-800 duration-200 py-6'>
            <InfoCard postCount={postCount} />
            <Analytics postCount={postCount}/>
          </div>
      </Tabs>

    </section>

 </aside>
}
export default SideAreaLeft
