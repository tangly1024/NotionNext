import { useEffect, useRef } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

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

const Header = ({ navBarTitle, fullWidth = true }) => {
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
      {BLOG.autoCollapsedNavBar === true && (
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
       <div className='observer-element h-0.5 ' ref={sentinelRef} />

      <div
        className='z-30 px-4 sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center py-6 bg-white bg-opacity-80 '
        id='sticky-nav'
        ref={navRef}
      >
        <div className='flex items-center'>

          <div className='flex cursor-pointer'>
            <div className='px-2 text-xl'>
              <FontAwesomeIcon icon={faBars} className='hover:scale-125 transform duration-200' />
            </div>
            <Image
              alt={BLOG.title}
              width={28}
              height={28}
              src='/avatar.svg'
              className='rounded-full'
            />
            <div
              className='mx-1 text-center cursor-pointer text-xl p-1
              dark:bg-gray-900 dark:text-gray-300 font-semibold
              dark:hover:bg-gray-600 text-black hover:scale-105
              hover:shadow-2xl duration-200 transform'>{BLOG.title}</div>

          </div>
          {navBarTitle
            ? (
              <p className='ml-1 font-medium text-gray-500 dark:text-night header-name'>
                {navBarTitle}
              </p>
              )
            : (
              <p className='ml-1 font-medium dark:text-night header-name'>
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
