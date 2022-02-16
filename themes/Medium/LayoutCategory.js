import LayoutBase from './LayoutBase'
import BlogPostListScroll from './components/BlogPostListScroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTh } from '@fortawesome/free-solid-svg-icons'

export const LayoutCategory = (props) => {
  const { category } = props
  const slotTop = <div className='flex items-center font-sans p-8'><div className='text-xl'><FontAwesomeIcon icon={faTh} className='mr-2'/>分类：</div>{category}</div>

  return <LayoutBase {...props} slotTop={slotTop}>
    <BlogPostListScroll {...props} />
  </LayoutBase>
}
