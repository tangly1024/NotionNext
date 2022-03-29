import CommonHead from '@/components/CommonHead'
import Live2D from '@/components/Live2D'
import Link from 'next/link'
import React from 'react'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta, customNav } = props
  const { locale } = useGlobal()
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'

  let links = [
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search' },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive' },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category' },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag' }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  return (
    <div>
      <CommonHead meta={meta} />
      {/* 导航菜单 */}
      <div className="w-full flex justify-center my-2">
        <div className=" max-w-6xl justify-between w-full flex">
          <section>
            <Link title={BLOG.TITLE} href={'/'}>
              <a className={'cursor-pointer flex items-center hover:underline'}>
                <i className={'fas fa-home mr-1'} />
                <div className="text-center">{BLOG.TITLE} </div>
              </a>
            </Link>
          </section>
          <nav className="space-x-3 flex">
            {links.map(link => {
              if (link) {
                return (
                  <Link key={`${link.to}`} title={link.to} href={link.to}>
                    <a
                      className={
                        'cursor-pointer flex items-center hover:underline'
                      }
                    >
                      <i className={`${link.icon} mr-1`} />
                      <div className="text-center">{link.name}</div>
                    </a>
                  </Link>
                )
              } else {
                return null
              }
            })}
          </nav>
        </div>
      </div>

      {/* 内容主体 */}
      <main id="wrapper" className="flex justify-center flex-1 pb-12">
        <div className="max-w-4xl w-full px-3">{children}</div>
        <div className='hidden md:block'>
          <div className="sticky top-0 z-40">
            <Live2D />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="font-sans dark:bg-gray-900 flex-shrink-0  justify-center text-center m-auto w-full leading-6 text-sm p-6">
        <i className="fas fa-copyright" /> {`${startYear}${currentYear}`}{' '}
        <span>
          <i className="mx-1 animate-pulse fas fa-heart" />{' '}
          <a
            href={BLOG.LINK}
            className="underline font-bold dark:text-gray-300 "
          >
            {BLOG.AUTHOR}
          </a>
          .
          <br />
          <span>
            Powered by{' '}
            <a
              href="https://notion.so"
              className="underline font-bold dark:text-gray-300"
            >
              Notion
            </a>{' '}
            &{' '}
            <a
              href="https://github.com/tangly1024/NotionNext"
              className="underline font-bold  dark:text-gray-300"
            >
              NotionNext {BLOG.VERSION}
            </a>
            .
          </span>
        </span>
        {BLOG.BEI_AN && (
          <>
            <br />
            <i className="fas fa-shield-alt" />{' '}
            <a href="https://beian.miit.gov.cn/" className="mr-2">
              {BLOG.BEI_AN}
            </a>
            <br />
          </>
        )}
        <br />
        <span className="hidden busuanzi_container_site_pv">
          <i className="fas fa-eye" />
          <span className="px-1 busuanzi_value_site_pv"> </span>{' '}
        </span>
        <span className="pl-2 hidden busuanzi_container_site_uv">
          <i className="fas fa-users" />{' '}
          <span className="px-1 busuanzi_value_site_uv"> </span>{' '}
        </span>
        <br />
        <h1>{meta?.title || BLOG.TITLE}</h1>
      </footer>
    </div>
  )
}

export default LayoutBase
