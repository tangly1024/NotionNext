import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/**
 * 产品中心
 * @param {*} props
 * @returns
 */
export default function ProductCenter(props) {
  const { categoryOptions } = props

  return <div className='w-full my-4 mx-4'>
        <div className='w-full text-center text-4xl font-bold'>{siteConfig('TEXT_HOME_PRODUCT_CENTER', 'Product Center')}</div>

        <div className='flex'>

            <div className='hidden md:block w-72 bg-white p-4 mx-2'>
                {/* 分类菜单  */}
                <div>
                    <div className='font-bold mb-4 border-b-2 p-2 border-[#D2232A]'>{siteConfig('COMMERCE_TEXT_MENU_GROUP', 'Product Center')}</div>
                    <nav id='home-nav-button' className={'flex flex-col space-y-2 text-start'}>
                        {categoryOptions.map(category => {
                          return (
                                <Link
                                    key={`${category.name}`}
                                    title={`${category.name}`}
                                    href={`/category/${category.name}`}
                                    className='hover:text-[#D2232A]'
                                    passHref>
                                    {category.name}
                                </Link>
                          )
                        })}
                    </nav>
                </div>
            </div>

            <div className='w-full border'>右侧产品列表</div>
        </div>
    </div>
}
