import LayoutBase from './LayoutBase'
import SearchInput from './components/SearchInput'
import { useGlobal } from '@/lib/global'
import TagGroups from './components/TagGroups'
import CategoryGroup from './components/CategoryGroup'
import BlogPostListScroll from './components/BlogPostListScroll'
import { useEffect } from 'react'
import { isBrowser } from '@/lib/utils'

export const LayoutSearch = (props) => {
  const { locale } = useGlobal()
  const { keyword } = props
  useEffect(() => {
    setTimeout(() => {
      const container = isBrowser() && document.getElementById('container')
      if (container && container.innerHTML) {
        const re = new RegExp(`${keyword}`, 'gim')
        container.innerHTML = container.innerHTML.replace(re, `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`)
      }
    },
    100)
  })
  return <LayoutBase {...props}>
    <div className='py-12'>
      <div className='pb-4 w-full'>{locale.NAV.SEARCH}</div>
      <SearchInput currentSearch={keyword} {...props} />
      <TagGroups {...props} />
      <CategoryGroup {...props} />
    </div>
    <div id='container'>
      <BlogPostListScroll {...props} />
    </div>
  </LayoutBase>
}
