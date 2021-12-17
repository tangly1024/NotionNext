import { useEffect, useState } from 'react'
import DarkModeButton from './DarkModeButton'

let windowTop = 0
export default function FloatDarkModeButton () {
  const [show, switchShow] = useState(false)
  const scrollListener = () => {
    const scrollY = window.pageYOffset
    // const shouldShow = scrollY > 100 && scrollY < windowTop
    const shouldShow = scrollY > 100
    windowTop = scrollY
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  })

  return (
      <div
        className={(show ? 'animate__fadeInRight ' : 'hidden lg:block') + ' animate__animated animate__faster shadow-card fixed right-5 bottom-36 py-1.5 px-2.5 rounded-full' +
      '  text-black shadow-card dark:border-gray-500 glassmorphism dark:bg-gray-700 dark:text-gray-200'}
      >
        <DarkModeButton />
      </div>
  )
}
