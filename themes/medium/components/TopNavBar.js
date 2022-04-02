import Link from 'next/link'
import { useRouter } from 'next/router'
import LogoBar from './LogoBar'

/**
 * 顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function TopNavBar (props) {
  const { className, customNav } = props
  const router = useRouter()

  return <div id='top-nav' className={'sticky top-0 lg:relative w-full z-40 ' + className}>
    <div className='flex w-full h-12 shadow bg-white dark:bg-hexo-black-gray px-5 items-between'>
      <LogoBar {...props}/>

      {/* 顶部菜单 */}
      <div className='flex'>
        {customNav && customNav.map(link => {
          if (link.show) {
            const selected = (router.pathname === link.to) || (router.asPath === link.to)
            return <Link key={`${link.id}-${link.to}`} title={link.to} href={link.to} >
            <a className={'px-2 duration-300 text-sm justify-between dark:text-gray-300 hover:underline cursor-pointer flex flex-nowrap items-center ' +
                (selected ? 'bg-green-600 text-white hover:text-white' : 'hover:text-green-600')} >
                <div className='items-center justify-center flex '>
                  <i className={link.icon} />
                  <div className='ml-2 whitespace-nowrap'>{link.name}</div>
                </div>
                {link.slot}
              </a>
            </Link>
          } else {
            return null
          }
        })}
      </div>
    </div>
  </div>
}
