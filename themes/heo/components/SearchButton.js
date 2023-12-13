import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { useRef } from 'react'

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)

  function handleSearch() {
    if (BLOG.ALGOLIA_APP_ID) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return <>
        <div onClick={handleSearch} title={locale.NAV.SEARCH} alt={locale.NAV.SEARCH} className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all'>
            <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass" />
        </div>
        <AlgoliaSearchModal cRef={searchModal} {...props}/>
    </>
}
