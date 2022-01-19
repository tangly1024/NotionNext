import BlogListPage from './components/BlogListPage'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props}>

    <BlogListPage posts={props.posts} postCount={props.postCount}/>

  </LayoutBase>
}
