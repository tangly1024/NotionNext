import Link from 'next/link'
import { useRouter } from 'next/router'

export const MenuItem = ({ link }) => {
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()
  return (
    <>
      {/* MenuItem */}
      {!hasSubMenu && (
        <li className='group relative whitespace-nowrap'>
          <Link
            href={link?.to}
            target={link?.target}
            className={`ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${router.route === '/' ? 'lg:text-white lg:group-hover:text-white' : ''} lg:group-hover:opacity-70`}>
            {link?.icon && <i className={link.icon + ' mr-2 my-auto'} />}
            {link?.name}
          </Link>
        </li>
      )}

      {hasSubMenu && (
        <li className='submenu-item group relative whitespace-nowrap'>
          {/* 有子菜单的MenuItem */}
          <a
            className={`relative mx-8 flex items-center justify-between py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-8 lg:mr-0 lg:inline-flex lg:py-6 lg:pl-0 lg:pr-4 ${router.route === '/' ? 'lg:text-white lg:group-hover:text-white' : ''} lg:group-hover:opacity-70 xl:ml-10`}>
            {link?.icon && <i className={link.icon + ' mr-2 my-auto'} />}
            {link?.name}

            <svg
              className='ml-2 fill-current'
              width='16'
              height='20'
              viewBox='0 0 16 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M7.99999 14.9C7.84999 14.9 7.72499 14.85 7.59999 14.75L1.84999 9.10005C1.62499 8.87505 1.62499 8.52505 1.84999 8.30005C2.07499 8.07505 2.42499 8.07505 2.64999 8.30005L7.99999 13.525L13.35 8.25005C13.575 8.02505 13.925 8.02505 14.15 8.25005C14.375 8.47505 14.375 8.82505 14.15 9.05005L8.39999 14.7C8.27499 14.825 8.14999 14.9 7.99999 14.9Z' />
            </svg>
          </a>

          <div className='submenu relative left-0 top-full hidden w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full'>
            {link.subMenus.map((sLink, index) => {
              return (
                <Link
                  key={index}
                  href={sLink.to}
                  target={link?.target}
                  className='block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary'>
                  {/* 子菜单SubMenuItem */}
                  <span className='text-sm ml-4 whitespace-nowrap'>
                    {link?.icon && (
                      <i className={sLink.icon + ' mr-2 my-auto'} />
                    )}{' '}
                    {sLink.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </li>
      )}
    </>
  )
}
