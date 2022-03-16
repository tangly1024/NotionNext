
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import SearchInput from './components/SearchInput'
export const LayoutSearch = (props) => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s
  let handleTextColor = false

  useEffect(() => {
    setTimeout(() => {
      if (currentSearch && !handleTextColor) {
        const container = document.getElementById('container')
        if (container && container.innerHTML) {
          const re = new RegExp(`${currentSearch}`, 'gim')
          container.innerHTML = container.innerHTML.replace(re, `<span class='text-red-500 border-b border-dashed'>${currentSearch}</span>`)
          handleTextColor = true
        }
      }
    },
    100)
  })
  return <LayoutBase {...props} currentSearch={currentSearch}>
    <div className='m-3'>
      <SearchInput {...props}/>
    </div>
    <div id='container'>
      <BlogPostListPage {...props}/>
    </div>
  </LayoutBase>
}
