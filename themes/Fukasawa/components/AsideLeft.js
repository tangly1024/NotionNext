import BLOG from '@/blog.config'
import Logo from './Logo'
import GroupCategory from './GroupCategory'
import GroupMenu from './GroupMenu'
import GroupTag from './GroupTag'
import SearchInput from './SearchInput'
import SiteInfo from './SiteInfo'

function AsideLeft ({ tags, currentTag, categories, currentCategory }) {
  return <div className='w-72 bg-white min-h-screen px-10 py-14 hidden lg:block'>

    <Logo />

    <section className='flex flex-col text-gray-600'>
      <hr className='w-12 my-8' />
      <GroupMenu/>
    </section>

    <section className='flex flex-col text-gray-600'>
      <hr className='w-12 my-8' />
      <SearchInput/>
    </section>

    <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      { BLOG.DESCRIPTION }
    </section>

    <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <GroupTag tags={tags} currentTag={currentTag}/>
    </section>

    <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <GroupCategory categories={categories} currentCategory={currentCategory}/>
    </section>

    <section className='flex flex-col'>
      <hr className='w-12 my-8 ' />
      <SiteInfo/>
    </section>

  </div>
}

export default AsideLeft
