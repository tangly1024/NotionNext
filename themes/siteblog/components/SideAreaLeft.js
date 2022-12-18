import InfoCard from './InfoCard'
import MenuButtonGroup from './MenuButtonGroup'
import SearchInput from './SearchInput'
import Toc from './Toc'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Tabs from '@/components/Tabs'
import Logo from './Logo'
import Card from './Card'
import CONFIG_NEXT from '../config_next'
import TagGroups from './TagGroups'
import Link from 'next/link'
/**
 * 侧边平铺
 * @param tags
 * @param currentTag
 * @param post
 * @param currentSearch
 * @returns {JSX.Element}
 * @constructor
 */
const SideAreaLeft = props => {
  const {
    post,
    slot,
    postCount,
    showInfoCard = true,
    tags,
    currentTag,
    latestPosts,
    categories
  } = props
  const { locale } = useGlobal()
  const showToc = post && post.toc && post.toc.length > 1
  return (
    <aside id="left" className="hidden lg:block flex-col w-60 mr-4">
      <div className="sticky top-4 hidden lg:block">
        <Card>
          <Tabs>
            {showToc && (
              <div
                key={locale.COMMON.TABLE_OF_CONTENTS}
                className="dark:text-gray-400 text-gray-600 bg-white dark:bg-hexo-black-gray duration-200"
              >
                <Toc toc={post.toc} />
              </div>
            )}

            <div
              key={locale.NAV.ABOUT}
              className="mb-5 bg-white dark:bg-hexo-black-gray duration-200 py-6"
            >
              {showInfoCard && <InfoCard {...props} />}
              <aside className="rounded shadow overflow-hidden mb-6">
                <h3 className="text-sm bg-gray-100 text-gray-700 dark:bg-hexo-black-gray dark:text-gray-200 py-3 px-4 dark:border-hexo-black-gray border-b">
                  {locale.COMMON.CATEGORY}
                </h3>

                <div className="p-4">
                  <ul className="list-reset leading-normal">
                    {categories?.map(category => {
                      return (
                        <Link
                          key={category.name}
                          href={`/category/${category.name}`}
                          passHref
                        >
                          <li>
                            {' '}
                            <a href="#" className="text-gray-darkest text-sm">
                              {category.name}({category.count})
                            </a>
                          </li>
                        </Link>
                      )
                    })}
                  </ul>
                </div>
              </aside>
              <aside className="rounded shadow overflow-hidden mb-6">
                <h3 className="text-sm bg-gray-100 text-gray-700 dark:bg-hexo-black-gray dark:text-gray-200 py-3 px-4 dark:border-hexo-black-gray border-b">
                  {locale.COMMON.LATEST_POSTS}
                </h3>

                <div className="p-4">
                  <ul className="list-reset leading-normal">
                    {latestPosts?.map(p => {
                      return (
                        <Link key={p.id} href={`/${p.slug}`} passHref>
                          <li>
                            {' '}
                            <a href="#" className="text-gray-darkest text-sm">
                              {p.title}
                            </a>
                          </li>
                        </Link>
                      )
                    })}
                  </ul>
                </div>
              </aside>
              {/* {BLOG.COMMENT_WALINE_SERVER_URL && BLOG.COMMENT_WALINE_RECENT && (
        <aside className="rounded shadow overflow-hidden mb-6">
          <h3 className="text-sm bg-gray-100 text-gray-700 dark:bg-hexo-black-gray dark:text-gray-200 py-3 px-4 dark:border-hexo-black-gray border-b">
            {locale.COMMON.RECENT_COMMENTS}
          </h3>

          <div className="p-4">
            <ExampleRecentComments />
          </div>
        </aside>
      )} */}

              <aside className="rounded  overflow-hidden mb-6">
                <h3 className="text-sm bg-gray-100 text-gray-700 dark:bg-hexo-black-gray dark:text-gray-200 py-3 px-4 dark:border-hexo-black-gray border-b">
                  {locale.COMMON.TAGS}
                </h3>
                <div className="px-2 pt-2">
                  <TagGroups tags={tags} currentTag={currentTag} />
                </div>
              </aside>
            </div>
          </Tabs>
        </Card>

        {slot && <div className="flex justify-center">{slot}</div>}
      </div>
    </aside>
  )
}
export default SideAreaLeft
