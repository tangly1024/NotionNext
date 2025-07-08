import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const scrollListener = () => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 200
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return <div title={locale.POST.TOP}
        className={(show ? ' opacity-100 ' : 'invisible  opacity-0') + ' transition-all duration-300 flex items-center justify-center cursor-pointer bg-black h-10 w-10 bg-opacity-40 rounded-sm'}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    ><i className='fas fa-angle-up text-white ' />
    </div>
}

export default JumpToTopButton
