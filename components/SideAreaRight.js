import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faAngleDoubleRight, faAngleRight, faTags, faThList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import CategoryGroup from './CategoryGroup'
import TagGroups from './TagGroups'

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
  slot,
  categories,
  currentCategory,
  currentSearch,
  targetRef
}) => {
  const { locale } = useGlobal()
  const { widget } = BLOG
  if (!widget?.showCategoryList && !widget.showTagList && !widget.showLatestPost) {
    return <></>
  }

  return (<aside id='right' className='hidden 2xl:block flex-col w-60 ml-4'>

      <section className="shadow mb-5 py-4 px-2 bg-white dark:bg-gray-800 hover:shadow-xl duration-200">
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

      <div className="sticky top-8">

        {/* 分类  */}
        {widget?.showCategoryList && categories && (
          <section className='shadow py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200'>
            <div className='text-sm px-5 mb-2 flex flex-nowrap justify-between font-light'>
              <div className='pb-1 text-gray-600 dark:text-gray-300'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div>
              <Link href='/category' passHref>
                <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                  {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleRight} />
                </a>
              </Link>
            </div>
            <CategoryGroup currentCategory={currentCategory} categories={categories} />
          </section>
        )}

        {slot}

         {widget?.showTagList && tags && (
          <section className="shadow py-4 mb-5 bg-white dark:bg-gray-800 hover:shadow-xl duration-200">
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

      </div>
    </aside>
  )
}
export default SideAreaRight
