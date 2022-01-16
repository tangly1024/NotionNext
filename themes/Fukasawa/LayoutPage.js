import BlogListPage from './components/BlogListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  return <LayoutBase {...props}>

    <BlogListPage posts={props.posts} postCount={props.postCount}/>

  </LayoutBase>
}
