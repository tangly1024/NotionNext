import Logo from './Logo'
import GroupCategory from './GroupCategory'
import GroupMenu from './GroupMenu'
import GroupTag from './GroupTag'
import SearchInput from './SearchInput'
import SiteInfo from './SiteInfo'
import Catalog from './Catalog'
import { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'

function AsideLeft (props) {
  const { tags, currentTag, categories, currentCategory, post, slot, siteInfo } = props
  const router = useRouter()
  return <div className='w-72 bg-white dark:bg-hexo-black-gray min-h-screen px-10 py-14 hidden lg:block'>
    <Logo {...props}/>

    <section className='flex flex-col text-gray-600'>
      <hr className='w-12 my-8' />
      <GroupMenu {...props}/>
    </section>

    <section className='flex flex-col text-gray-600'>
      <hr className='w-12 my-8' />
      <SearchInput {...props}/>
    </section>

    <section className='flex flex-col dark:text-gray-300'>
      <hr className='w-12 my-8' />
      { siteInfo?.description }
    </section>

    {router.asPath !== '/tag' && <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <GroupTag tags={tags} currentTag={currentTag}/>
    </section>}

    {router.asPath !== '/category' && <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <GroupCategory categories={categories} currentCategory={currentCategory}/>
    </section>}

    <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <SiteInfo/>
    </section>

    <section className='flex justify-center dark:text-gray-200'>
        <DarkModeButton/>
    </section>

    <section className='sticky top-0 pt-12'>
      <Catalog toc={post?.toc}/>
      <div className='flex justify-center'>
        <div>{slot}</div>
      </div>
    </section>

  </div>
}

export default AsideLeft
