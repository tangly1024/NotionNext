import { useGlobal } from '@/lib/global'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
import Typed from 'typed.js'

/**
 *
 * @returns 头图
 */
export default function Header () {
  const [typed, changeType] = useState()
  useEffect(() => {
    if (!typed) {
      changeType(new Typed('#typed', {
        stringsElement: '#typed-strings', typeSpeed: 200, showCursor: false
      }))
    }
  })
  const scrollToCenter = () => {
    document.getElementById('wrapper').scrollIntoView({ behavior: 'smooth' })
  }

  const { theme } = useGlobal()
  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(throttle(() => {
    if (theme !== 'dark') {
      const stickyNavElement = document.getElementById('sticky-nav')
      if (window.scrollY < window.innerHeight) {
        stickyNavElement.classList.add('dark')
      } else {
        stickyNavElement.classList.remove('dark')
      }
    }
  }, 500))

  // 监听滚动
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return <div className='h-screen w-full'>
      <div className='absolute z-10 flex h-screen items-center justify-center w-full'>
          <div id="typed-strings">
        <h2 className='text-xs text-white font-serif'>唐风集里，收卷波澜。</h2>
        </div>
        <div id="typed" className='text-4xl md:text-7xl text-center text-white font-serif'></div>
      <div onClick={scrollToCenter} className='cursor-pointer w-full text-center text-2xl animate-bounce absolute bottom-10 text-white'><FontAwesomeIcon icon={faArrowDown} /></div>
    </div>
    <div className='bg-black bg-cover bg-center h-screen md:-mt-14'
        style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.4), rgba(0, 0, 0, 0.5) ),url("https://pic2.zhimg.com/v2-9dfb9bd28656a13d7d57793c853dfb52_r.jpg")' }}>
    </div>
</div>
}
