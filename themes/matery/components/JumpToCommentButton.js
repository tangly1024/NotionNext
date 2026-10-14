import { hasEnabledComments } from '@/lib/utils/comments'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToCommentButton = ({ post }) => {
  if (post?.comment === 'Hide' || !hasEnabledComments(siteConfig) || !siteConfig('MATERY_WIDGET_TO_COMMENT', null, CONFIG)) {
    return <></>
  }

  function navToComment() {
    if (document.getElementById('comment')) {
      window.scrollTo({ top: document.getElementById('comment').offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <div
      className='flex justify-center items-center text-center select-none'
      onClick={navToComment}>
      <i
        id='jumpToCommentButton'
        className='fas fa-comments transform hover:scale-105 duration-200 text-white bg-indigo-700 w-10 h-10 rounded-full dark:bg-black cursor-pointer flex justify-center items-center'
      />
    </div>
  )
}

export default JumpToCommentButton
