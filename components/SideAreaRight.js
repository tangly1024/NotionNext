import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faAngleDoubleRight, faAngleRight, faTag, faThList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import Card from './Card'
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

      <Card>
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
      </Card>

      <div className="sticky top-4">

        {/* 分类  */}
        {widget?.showCategoryList && categories && (
          <Card>
            <div className='text-sm px-2 flex flex-nowrap justify-between font-light'>
              <div className='pb-1 text-gray-600 dark:text-gray-300'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div>
              <Link href='/category' passHref>
                <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                  {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleRight} />
                </a>
              </Link>
            </div>
            <CategoryGroup currentCategory={currentCategory} categories={categories} />
          </Card>
        )}

        {slot}

         {widget?.showTagList && tags && (
          <Card>
            <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
              <div className="text-gray-600 dark:text-gray-200">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {locale.COMMON.TAGS}
              </div>
              <Link href="/tag" passHref>
                <a className="text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer">
                  {locale.COMMON.MORE}{' '}
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </a>
              </Link>
            </div>
            <div className="px-2 pt-2">
              <TagGroups tags={tags} currentTag={currentTag} />
            </div>
          </Card>
         )}

      </div>
    </aside>
  )
}
export default SideAreaRight
