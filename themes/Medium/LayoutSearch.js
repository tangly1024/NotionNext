import LayoutBase from './LayoutBase'
import BlogPostListPage from './components/BlogPostListPage'
import SearchInput from './components/SearchInput'
import { useGlobal } from '@/lib/global'
import TagGroups from './components/TagGroups'
import CategoryGroup from './components/CategoryGroup'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutSearch = (props) => {
  const { locale } = useGlobal()
  return <LayoutBase {...props}>

    <div className='py-12'>
      <div className='pb-4 w-full'>
      {locale.NAV.SEARCH}
      </div>
      <SearchInput/>

      <TagGroups {...props}/>
      <CategoryGroup {...props}/>
    </div>

    <BlogPostListScroll {...props}/>
  </LayoutBase>
}
