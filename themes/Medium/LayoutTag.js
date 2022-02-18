import LayoutBase from './LayoutBase'
import BlogPostListScroll from './components/BlogPostListScroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'

export const LayoutTag = (props) => {
  const { tag } = props
  const slotTop = <div className='flex items-center font-sans p-8'><div className='text-xl'><FontAwesomeIcon icon={faTag} className='mr-2'/>标签：</div>{tag}</div>

  return <LayoutBase {...props} slotTop={slotTop}>
    <BlogPostListScroll {...props} />
   </LayoutBase>
}
