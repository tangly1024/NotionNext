import CategoryGroup from './CategoryGroup'
import InfoCard from './InfoCard'
import TagGroups from './TagGroups'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

/**
 * 侧边栏
 * @param tags
 * @param currentTag
 * @param post
 * @param posts
 * @param categories
 * @param currentCategory
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = (props) => {
  const { tags, currentTag, post, slot, categories, currentCategory } = props
  const { locale } = useGlobal()
  return (
    <aside id='sidebar' className='bg-white dark:bg-gray-900 w-80 z-10 dark:border-gray-500 border-gray-200 scroll-hidden h-full'>

      <div className={(!post ? 'sticky top-0' : '') + ' bg-white dark:bg-gray-900 pb-4'}>

        <section className='py-5'>
          <InfoCard {...props} />
        </section>

        {/* 分类  */}
        {categories && (
          <section className='mt-8'>
            <div className='text-sm px-5 flex flex-nowrap justify-between font-light'>
              <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
              <SmartLink
                href={'/category'}
                passHref
                className='mb-3 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>

                {locale.COMMON.MORE} <i className='fas fa-angle-double-right'/>

              </SmartLink>
            </div>
            <CategoryGroup currentCategory={currentCategory} categories={categories} />
          </section>
        )}

        {/* 标签云  */}
        {tags && (
          <section className='mt-4'>
            <div className='text-sm py-2 px-5 flex flex-nowrap justify-between font-light dark:text-gray-200'>
              <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-tag'/>{locale.COMMON.TAGS}</div>
              <SmartLink
                href={'/tag'}
                passHref
                className='text-gray-500 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>

                {locale.COMMON.MORE} <i className='fas fa-angle-double-right'/>

              </SmartLink>
            </div>
            <div className='px-5 py-2'>
              <TagGroups tags={tags} currentTag={currentTag} />
            </div>
          </section>
        )}

        {slot}

      </div>

    </aside>
  )
}
export default SideBar
