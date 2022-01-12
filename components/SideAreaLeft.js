import InfoCard from '@/components/InfoCard'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import SearchInput from '@/components/SearchInput'
import Toc from '@/components/Toc'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Analytics from './Analytics'
import Tabs from '@/components/Tabs'
import BLOG from '@/blog.config'
import Logo from './Logo'

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
const SideAreaLeft = ({ title, tags, currentTag, post, postCount, categories, currentCategory, currentSearch, targetRef }) => {
  const { locale } = useGlobal()
  const showToc = post && post.toc && post.toc.length > 1
  return <aside id='left' className='hidden lg:block flex-col w-60 mr-4'>

    <section className='w-60'>
      {/* 菜单 */}
      <section className='shadow hidden lg:block mb-5 pb-4 bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
        <Logo/>
        <div className='pt-2 font-sans'>
        <MenuButtonGroup allowCollapse={true} postCount={postCount} />
        </div>
        {BLOG.menu.showSearch && <div className='px-5 pt-2 font-sans'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>}
      </section>

    </section>

    <section className='sticky top-4'>
      <Tabs>
          {showToc && (
            <div key={locale.COMMON.TABLE_OF_CONTENTS} className='dark:text-gray-400 text-gray-600 bg-white dark:bg-gray-800 duration-200'>
              <Toc toc={post.toc}/>
            </div>
          )}

          <div key={locale.NAV.ABOUT} className='mb-5 bg-white dark:bg-gray-800 duration-200 py-6'>
            <InfoCard />
            <Analytics postCount={postCount}/>
          </div>
      </Tabs>
    </section>

 </aside>
}
export default SideAreaLeft
