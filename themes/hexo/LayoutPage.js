import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  return <LayoutBase {...props} className='mt-8'>
      <BlogPostListPage {...props}/>
  </LayoutBase>
}

export default LayoutPage
