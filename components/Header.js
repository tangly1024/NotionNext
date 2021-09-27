import { useEffect, useRef } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import Image from 'next/image'

const NavBar = () => {
  const links = []
  return (
    <div className='flex-shrink-0'>
      <ul className='flex flex-row'>
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className='block ml-4 text-black dark:text-gray-50 nav'
              >
                <Link href={link.to}>
                  <a>{(link.icon && (<i className={'px-1 fa ' + link.icon} />))} {link.name}</a>
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

const Header = ({ navBarTitle, fullWidth }) => {
  const navRef = useRef(null)
  const sentinelRef = useRef([])
  // 当Header移出屏幕时改变的样式
  const handler = ([entry]) => {
    if (navRef && navRef.current) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current.classList.add('sticky-nav-full')
      } else {
        navRef.current.classList.remove('sticky-nav-full')
      }
    }
  }
  useEffect(() => {
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelRef.current)
    // Don't touch this, I have no idea how it works XD
    // return () => {
    //   if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    // }
  }, [sentinelRef])
  return (
    <>
      { BLOG.autoCollapsedNavBar === true && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
                      var windowTop=0;
                      function scrollTrigger(){
                          let scrollS = window.scrollY;
                          let nav = document.querySelector('.sticky-nav');
                          if(scrollS >= windowTop){
                              nav.style.opacity = 0;
                              windowTop = scrollS;
                          }else{
                              nav.style.opacity = 1;
                              windowTop = scrollS;
                          }
                      };
                      window.addEventListener('scroll',scrollTrigger);
                      `
          }}
        />
      )}
      <div className='observer-element h-0.5' ref={sentinelRef}/>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-5xl px-4' : 'px-4 md:px-24'
        }`}
        id='sticky-nav'
        ref={navRef}
      >
        <div className='flex items-center'>
          <Link href='/'>
            <a>
              <div className='h-6'>
                <Image
                  alt={BLOG.author}
                  width={24}
                  height={24}
                  src='/favicon.svg'
                  className='rounded-full'
                />
              </div>
            </a>
          </Link>
          {navBarTitle
            ? (
              <p className='ml-2 font-medium text-gray-500 dark:text-night header-name'>
                {navBarTitle}
              </p>
              )
            : (
              <p className='ml-2 font-medium text-500 dark:text-night header-name'>
                {BLOG.title} {' '}
                {BLOG.title},{' '}
                <span className='font-normal'>{BLOG.description}</span>
              </p>
              )}
        </div>
        <NavBar />
      </div>
    </>
  )
}

export default Header
