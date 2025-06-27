import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToCommentButton = () => {
  if (!siteConfig('MATERY_WIDGET_TO_COMMENT', null, CONFIG)) {
    return <></>
  }

  function navToComment() {
    if (document.getElementById('comment')) {
      window.scrollTo({ top: document.getElementById('comment').offsetTop, behavior: 'smooth' })
    }
  }

  return <div className={'justify-center items-center text-center'} onClick={navToComment}>
        <i id="darkModeButton" className={`fas fa-comments transform hover:scale-105 duration-200 text-white
         text-sm  bg-indigo-700 w-10 h-10 rounded-full dark:bg-black cursor-pointer py-3`} />
    </div>
}

export default JumpToCommentButton
