import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
/**
 * 响应式 折叠菜单
 */
export const MenuList = () => {
  const router = useRouter()

  useEffect(() => {
    // ===== responsive navbar
    const navbarToggler = document.querySelector('#navbarToggler');
    const navbarCollapse = document.querySelector('#navbarCollapse');

    // 点击弹出菜单
    navbarToggler?.addEventListener('click', () => {
      navbarToggler?.classList.toggle('navbarTogglerActive');
      navbarCollapse?.classList.toggle('hidden');
    });

    //= ==== close navbar-collapse when a  clicked
    document
      .querySelectorAll('#navbarCollapse ul li:not(.submenu-item) a')
      .forEach((e) =>
        e.addEventListener('click', () => {
          navbarToggler?.classList.remove('navbarTogglerActive');
          navbarCollapse?.classList.add('hidden');
        })
      );

    // ===== Sub-menu
    const submenuItems = document.querySelectorAll('.submenu-item');
    submenuItems.forEach((el) => {
      el.querySelector('a')?.addEventListener('click', () => {
        el.querySelector('.submenu')?.classList.toggle('hidden');
      });
    });
  }, [])

  return <>
            <div>
                {/* 移动端菜单切换按钮 */}
              <button id="navbarToggler" className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden">
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all" ></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all" ></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all" ></span>
              </button>

              {/* 响应式菜单 */}
              <nav id="navbarCollapse" className="absolute right-4 top-full hidden w-full max-w-[250px] rounded-lg bg-white py-5 shadow-lg dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none dark:lg:bg-transparent xl:px-6">
                <ul className="blcok lg:flex 2xl:ml-20">
                  {/* MenuItem */}
                  <li className="group relative">
                    <Link href="/"
                      className={`ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${router.route === '/' ? 'lg:text-white lg:group-hover:text-white' : ''} lg:group-hover:opacity-70`}
                    >
                      Home1
                    </Link>
                  </li>
                  {/* 有子菜单的MenuItem */}
                  <li className="submenu-item group relative">
                    <a className={`relative mx-8 flex items-center justify-between py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-8 lg:mr-0 lg:inline-flex lg:py-6 lg:pl-0 lg:pr-4 ${router.route === '/' ? 'lg:text-white lg:group-hover:text-white' : ''} lg:group-hover:opacity-70 xl:ml-10`}>
                      Pages

                      <svg
                        className="ml-2 fill-current"
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.99999 14.9C7.84999 14.9 7.72499 14.85 7.59999 14.75L1.84999 9.10005C1.62499 8.87505 1.62499 8.52505 1.84999 8.30005C2.07499 8.07505 2.42499 8.07505 2.64999 8.30005L7.99999 13.525L13.35 8.25005C13.575 8.02505 13.925 8.02505 14.15 8.25005C14.375 8.47505 14.375 8.82505 14.15 9.05005L8.39999 14.7C8.27499 14.825 8.14999 14.9 7.99999 14.9Z"
                        />
                      </svg>
                    </a>
                    <div
                      className="submenu relative left-0 top-full hidden w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full"
                    >
                        {/* 子菜单SubMenuItem */}
                      <Link
                        href="/about"
                        className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                      >
                        About Page
                      </Link>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>

          </>
}
