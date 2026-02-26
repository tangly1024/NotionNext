import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export default function ProductCategories(props) {
  const { categoryOptions } = props

  return (
    <div className='hidden md:block w-72 mx-2'>
      {/* 分类菜单  */}
      <div className='bg-white  p-4'>
        <div className='font-bold text-lg mb-4 border-b-2 py-2 border-[#D2232A]'>
          {siteConfig(
            'COMMERCE_TEXT_CENTER_CATEGORY_TITLE',
            'Product Categories',
            CONFIG
          )}
        </div>
        <nav
          id='home-nav-button'
          className={'flex flex-col space-y-2 text-start'}>
          {categoryOptions?.map(category => {
            return (
              <SmartLink
                key={`${category.name}`}
                title={`${category.name}`}
                href={`/category/${category.name}`}
                className='hover:text-[#D2232A]'
                passHref>
                {category.name}
              </SmartLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
