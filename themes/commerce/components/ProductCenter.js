import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import ProductCard from './ProductCard'

/**
 * 产品中心
 * @param {*} props
 * @returns
 */
export default function ProductCenter(props) {
  const { categoryOptions, allNavPages } = props
  const posts = allNavPages.slice(0, parseInt(siteConfig('COMMERCE_HOME_POSTS_COUNT', 9)))

  return <div className='w-full my-4 mx-4'>
        <div className='w-full text-center text-4xl font-bold'>{siteConfig('COMMERCE_TEXT_CENTER_TITLE', 'Product Center')}</div>
        {siteConfig('COMMERCE_TEXT_CENTER_DESCRIPTION') && <div className='w-full text-center text-lg my-3 text-gray-500'>{siteConfig('COMMERCE_TEXT_CENTER_DESCRIPTION')}</div>}

        <div className='flex'>

            <div className='hidden md:block w-72 mx-2'>
                {/* 分类菜单  */}
                <div className='bg-white  p-4'>
                    <div className='font-bold text-lg mb-4 border-b-2 py-2 border-[#D2232A]'>{siteConfig('COMMERCE_TEXT_MENU_GROUP', 'Product Categories')}</div>
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

            <div className='w-full p-4 mx-2'>
                {/* 文章列表 */}
                <div className="grid md:grid-cols-3 grid-cols-2 gap-5">
                    {posts?.map(post => (
                        <ProductCard index={posts.indexOf(post)} key={post.id} post={post} />
                    ))}
                </div>

            </div>
        </div>
    </div>
}
