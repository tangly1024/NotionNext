import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = (props) => {
  const { siteInfo, customNav } = props
  const { locale } = useGlobal()
  const router = useRouter()

  const defaultLinks = [
    { icon: 'fas fa-home', name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: true },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: true }
  ]
  let links = [].concat(defaultLinks)
  if (customNav) {
    links = defaultLinks.concat(customNav)
  }

  return (
        <div id='side-bar' className=''>
            <div className="h-48 w-full bg-indigo-700">
                <div className='mx-5 pt-6'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={siteInfo?.icon} className='cursor-pointer rounded-full' width={80} alt={BLOG.AUTHOR} />
                    <div className='text-white text-xl my-1'>{siteInfo?.title}</div>
                    <div className='text-xs my-1 text-gray-300'>{siteInfo?.description}</div>
                </div>
            </div>
            <nav>
                {links.map(link => {
                  if (link && link.show) {
                    const selected = (router.pathname === link.to) || (router.asPath === link.to)
                    return <Link key={link.to} title={link.to} href={link.to} >
                            <a target={link.to.indexOf('http') === 0 ? '_blank' : '_self'}
                               className={'py-2 px-5 duration-300 text-base justify-between hover:bg-gray-700 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
                                (selected ? 'bg-indigo-500 text-white ' : ' text-black dark:text-white ')} >
                                <div className='my-auto items-center justify-between flex '>
                                    <i className={`${link.icon} w-4 ml-3 mr-6 text-center`} />
                                    <div >{link.name}</div>
                                </div>
                                {link.slot}
                            </a>
                        </Link>
                  } else {
                    return <></>
                  }
                })}
            </nav>
        </div>
  )
}

export default SideBar
