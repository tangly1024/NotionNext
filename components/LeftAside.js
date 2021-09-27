import Tags from '@/components/Tags'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { useState } from 'react'
import Router, { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import SocialButton from '@/components/SocialButton'
import Footer from '@/components/Footer'

const LeftAside = ({ tags, currentTag }) => {
  const locale = useLocale()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      Router.push({ pathname: '/', query: { s: searchValue } })
    }
  }
  return <aside
    style={{ width: '330px' }}
    className='px-10 hidden xl:block py-5 bg-gray-50 dark:bg-gray-800 duration-200 border-r dark:border-black'
    >

    <div className='sticky top-16'>
      <div className='my-5 flex'>
        <Link href='/'>
          <a
            className='hover:shadow-xl dark:border-gray-600 border-black border-2 bg-white dark:bg-gray-800 dark:text-gray-300 font-semibold hover:bg-gray-800 hover:text-white p-2 duration-200'>{BLOG.title}</a>
        </Link>
      </div>

      <div className='text-gray-500  dark:text-gray-300'>
        <i className='fa fa-map-marker mr-1' />
        Fuzhou, China
      </div>

      <hr className='my-5'/>

      {/* 搜索框 */}
      <div className='flex justify-center items-center py-5 '>
        <i className='fa fa-search absolute right-8 text-gray-400' />
        <input
          type='text'
          placeholder={
            currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`
          }
          className='hover:shadow-xl duration-200 px-5 bg-gray-100 rounded w-full py-2 border-black dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white'
          onKeyUp={handleKeyUp}
          onChange={e => setSearchValue(e.target.value)}
          defaultValue={router.query.s ?? ''}
        />
      </div>

      <hr className='my-5'/>

      <div>
        <span className='dark:text-gray-200'>标签</span>
        <Tags tags={tags} currentTag={currentTag} />
      </div>

      <div className='bottom-1 fixed'>
        <div className='justify-center flex '><DarkModeButton /></div>
        <Footer/>
      </div>
    </div>
  </aside>
}
export default LeftAside
