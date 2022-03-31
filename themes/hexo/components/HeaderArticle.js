import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/formatDate'
import { useEffect } from 'react'

export default function HeaderArticle ({ post, siteInfo }) {
  const headerImage = post?.page_cover ? `url("${post.page_cover}")` : `url("${siteInfo?.pageCover}")`
  const { isDarkMode } = useGlobal()

  const { locale } = useGlobal()
  const date = formatDate(
    post?.date?.start_date || post.createdTime,
    locale.LOCALE
  )

  const scrollTrigger = () => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')

    if (scrollS < 300) {
      nav && nav.classList.replace('bg-white', 'bg-none')
      nav && nav.classList.replace('text-black', 'text-white')
    } else {
      nav && nav.classList.replace('bg-none', 'bg-white')
      nav && nav.classList.replace('text-white', 'text-black')
    }
    updateTopNav()
  }
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  const updateTopNav = () => {
    if (!isDarkMode) {
      const stickyNavElement = document.getElementById('sticky-nav')
      if (window.scrollY < window.innerHeight) {
        stickyNavElement?.classList?.add('dark')
      } else {
        stickyNavElement?.classList?.remove('dark')
      }
    }
  }

  return (
      <div
        id="header"
        className="w-full h-96 relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat animate__animated animate__fadeIn"
        style={{ backgroundImage: headerImage }}
      >
        <header className="animate__slideInDown animate__animated bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center font-sans">
          <div className='mt-24'>
            {/* 文章Title */}
            <div className="font-bold text-xl shadow-text flex justify-center text-white dark:text-white font-sans">
              {post.title}
            </div>

            <section className="flex-wrap shadow-text flex text-sm justify-center mt-2 text-white dark:text-gray-400 font-light leading-8">
              <div className='dark:text-gray-200'>
                {post.category && <>
                  <Link href={`/category/${post.category}`} passHref>
                  <a className="cursor-pointer mr-2 dark:hover:text-white border-b dark:border-gray-500 border-dashed">
                    <i className="mr-1 fas fa-folder-open" />
                    {post.category}
                  </a>
                  </Link>
                  <span className="mr-2">|</span>
                </>}

                {post.type[0] !== 'Page' && (
                  <>
                    <Link
                      href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                      passHref
                    >
                      <a className="pl-1 mr-2 cursor-pointer hover:underline border-b dark:border-gray-500 border-dashed">
                      <i className="far fa-calendar-alt mr-1"/> {date}
                      </a>
                    </Link>
                  </>
                )}

                <div className="hidden busuanzi_container_page_pv font-light mr-2">
                  <span className="mr-2">|</span>
                  <span className="mr-2 busuanzi_value_page_pv" />
                  次访问
                </div>
              </div>
            </section>
          </div>
        </header>
      </div>
  )
}
