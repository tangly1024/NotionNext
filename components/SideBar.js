import Tags from '@/components/Tags'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { useState } from 'react'
import Router, { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import Footer from '@/components/Footer'

const SideBar = ({ tags, currentTag }) => {
  const locale = useLocale()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      Router.push({ pathname: '/', query: { s: searchValue } })
    }
  }

  const [collapse, changeCollapse] = useState(false)

  return <aside
    className={(collapse ? '' : '') + ' z-10 bg-white dark:bg-gray-800 dark:border-black duration-500 ease-in-out'}
  >

    <div className={(collapse ? '-ml-80 ' : 'shadow-2xl xl:shadow-none') + ' sidebar h-full w-60 md:w-80 duration-500 ease-in-out'}>

      {/* 搜索框 */}
      <div className='flex justify-center items-center py-5 pr-5 pl-2 bg-gray-100 dark:bg-black'>
        <input
          type='text'
          placeholder={
            currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`
          }
          className='hover:shadow-xl duration-200 pl-2 rounded w-full py-2 border dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white'
          onKeyUp={handleKeyUp}
          onChange={e => setSearchValue(e.target.value)}
          defaultValue={router.query.s ?? ''}
        />
        <i className='fa fa-search text-gray-400 -ml-8' />
      </div>

      <section className='mx-5 py-5 flex'>
        <Link href='/'>
          <a
            className='hover:shadow-xl dark:border-gray-600 border-gray-500 border-2 bg-white dark:bg-gray-800 dark:text-gray-300 font-semibold hover:bg-gray-800 hover:text-white p-2 duration-200'>{BLOG.title}</a>
        </Link>
      </section>

      <section className='text-gray-500 px-5 dark:text-gray-300'>
        <i className='fa fa-map-marker mr-1' />
        Fuzhou, China
      </section>

      {/* <hr className='my-5' /> */}

      <div className='p-5'>
        <span className='dark:text-gray-200'>标签</span>
        <Tags tags={tags} currentTag={currentTag} />
      </div>

      <Footer />
    </div>
     <div className={(collapse ? 'left-0' : 'md:left-80 left-60') + ' space-x-2 fixed md:absolute flex top-0 px-4 py-3 duration-500 ease-in-out'}>
      <div className='my-4 text-xl p-1 rounded cursor-pointer text-center hover:scale-125 transform duration-200 bg-gray-100 bg-opacity-50 md:bg-opacity-0'>
        <i className='fa fa-bars px-1' onClick={() => changeCollapse(!collapse)} />
      </div>
      <div className='my-4 bg-gray-100 bg-opacity-50 p-1 rounded md:bg-opacity-0'>
        <DarkModeButton />
      </div>
     </div>
  </aside>
}
export default SideBar
