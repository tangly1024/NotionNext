import { useEffect, useState } from 'react'
import { isBrowser } from '@/lib/utils'

/**
 * 顶部页面阅读进度条
 * @returns {JSX.Element}
 * @constructor
 */
const Progress = ({ targetRef, showPercent = false }) => {
  const currentRef = targetRef?.current || targetRef
  const [percent, changePercent] = useState(0)
  const scrollListener = () => {
    const target = currentRef || (isBrowser && document.getElementById('container-inner'))
    if (target) {
      const viewportHeight = window.innerHeight;
      const fixedTopHeight = viewportHeight * 0.6; // 顶部固定区域高度，根据实际情况调整
      const clientHeight = target.clientHeight - fixedTopHeight; // 调整目标高度
      const scrollY = Math.max(0, window.pageYOffset - fixedTopHeight); // 调整滚动位置
      const fullHeight = clientHeight - (viewportHeight - fixedTopHeight); // 计算实际可滚动高度
      let per = (scrollY / fullHeight) * 100;
      per = Math.min(100, Math.max(0, per)); // 确保百分比在 0 到 100 之间
      changePercent(Math.round(per));
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  // 跳转到页面顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 跳转到页面底部
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  // 跳转评论区
  const scrollToComment = () => {
    const commentSection = document.getElementById('comment');
    if (commentSection) {
      const commentTop = commentSection.offsetTop; // 获取评论区距离页面顶部的距离
      window.scrollTo({
        top: commentTop,
        behavior: 'smooth' // 平滑滚动
      });
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* 按钮容器 */}
      <div className="absolute top-0 -translate-y-full flex w-full bg-hexo-background justify-center items-center z-10">
        <button onClick={scrollToTop} className="px-4 text-gray-500 hover:text-hexo-orange">
          <i className="iconfont icon-arrow-up"></i>
        </button>
        <button onClick={scrollToComment} className="px-4 text-gray-500 hover:text-hexo-orange">
          <i className="fas fa-comment"></i>
        </button>
        <button onClick={scrollToBottom} className="px-4 text-gray-500 hover:text-hexo-orange">
          <i className="iconfont icon-arrow-down"></i> 
        </button>
      </div>
      <div className="min-h-[0.25rem] w-full shadow-2xl bg-hexo-background rounded-sm relative">
        <div className="min-h-[0.25rem] left-0 bg-tab duration-200 rounded-sm w-full z-1" style={{ width: `${percent}%` , pointerEvents: 'none'}}>
          {showPercent && (
            <div className="text-right text-white text-xs">{percent}%</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Progress
