import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const scrollListener = () => {
      const shouldShow = window.pageYOffset > 200
      if (shouldShow !== show) {
        setShow(shouldShow)
      }
    }

    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [show])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      title={locale.POST.TOP}
      className={`fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-60 text-white shadow-lg transition-all duration-300 hover:bg-opacity-60 focus:outline-none active:outline-none dark:bg-white dark:bg-opacity-80 dark:text-gray-800 dark:hover:bg-opacity-30 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
      onClick={handleClick}
      aria-label={locale.POST.TOP}
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}

export default JumpToTopButton