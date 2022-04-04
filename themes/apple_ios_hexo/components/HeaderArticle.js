import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/formatDate'
import TagItemMini from './TagItemMini'
import CONFIG_APPLE_IOS_HEXO from '../config_apple_ios_hexo'
import { useEffect } from 'react'

export default function HeaderArticle({ post }) {
  const headerImage = post?.page_cover
    ? `url("${post.page_cover}")`
    : `url("/${CONFIG_APPLE_IOS_HEXO.HOME_BANNER_IMAGE}")`
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
  }
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
    <>
      <div
        id="header"
        className="w-full sm:bg-local md:bg-fixed relative md:flex-shrink-0 overflow-hidden bg-contain xl:bg-cover bg-top  bg-no-repeat animate__animated animate__fadeIn"
        style={{
          height: '75vh',
          minHeight: '30vw',
          maxHeight: '56.25vw',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0,0,0,0), rgba(0, 0, 0, 0.3) ),${headerImage}`
        }}
      ></div>
      <div id="title" className="w-full relative md:-mb-20">
        <header className="animate__animated bg-opacity-70 relative top-0 w-full px-4 flex justify-center items-start font-sans">
          <div className="mt-2 w-full">
            {/* 文章Title */}
            <div className="font-bold text-3xl dark:shadow-text flex justify-center text-gray-700 dark:text-white font-sans">
              {post.title}
            </div>
            <section className="flex-wrap dark:shadow-text flex text-sm justify-center mt-2 text-gray-500 dark:text-gray-400 font-light leading-8">
              <div className="dark:text-gray-200 text-center">
                {post.category && (
                  <>
                    <Link href={`/category/${post.category}`} passHref>
                      <a className="cursor-pointer mr-2 dark:hover:text-white border-b dark:border-gray-500 border-dashed inline-block">
                        <i className="mr-1 fas fa-folder-open" />
                        {post.category}
                      </a>
                    </Link>
                    {/* <span className="mr-2">|</span> */}
                  </>
                )}

                {post.type[0] !== 'Page' && (
                  <>
                    <Link
                      href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                      passHref
                    >
                      <a className="pl-1 mr-2 cursor-pointer hover:underline border-b dark:border-gray-500 border-dashed inline-block">
                        <i className="far fa-calendar-alt mr-1" /> {date}
                      </a>
                    </Link>
                  </>
                )}
                <div className="hidden busuanzi_container_page_pv font-light mr-2 inline-block">
                  <i className="far fa-eye mr-1" />
                  <span className="mr-0"></span>
                  <span className="mr-1 busuanzi_value_page_pv" />
                  次觀看
                </div>

                {post.tagItems && (
                  <>
                    <div className="md:flex-nowrap flex-wrap md:justify-start inline-block shadow-none">
                      <div
                        style={{
                          width: '100vw',
                          overflow: 'auto',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {' '}
                        {post.tagItems.map(tag => (
                          <TagItemMini key={tag.name} tag={tag} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </header>
      </div>
    </>
  )
}
