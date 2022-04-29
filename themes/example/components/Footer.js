import BLOG from '@/blog.config'

export const Footer = (props) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'

  //     {/* 页脚 */}
  //     <footer className="font-sans dark:bg-gray-900 flex-shrink-0  justify-center text-center m-auto w-full leading-6 text-sm p-6">
  //     <i className="fas fa-copyright" /> {`${startYear}${currentYear}`}{' '}

  //     <br />
  //     <span className="hidden busuanzi_container_site_pv">
  //       <i className="fas fa-eye" />
  //       <span className="px-1 busuanzi_value_site_pv"> </span>{' '}
  //     </span>
  //     <span className="pl-2 hidden busuanzi_container_site_uv">
  //       <i className="fas fa-users" />{' '}
  //       <span className="px-1 busuanzi_value_site_uv"> </span>{' '}
  //     </span>
  //     <br />
  //     <h1>{meta?.title || siteInfo?.title}</h1>
  //     <span className='text-xs font-serif'>
  //       Powered by{' '}
  //       <a
  //         href="https://github.com/tangly1024/NotionNext"
  //         className="underline dark:text-gray-300"
  //       >
  //         NotionNext {BLOG.VERSION}
  //       </a>
  //       .
  //     </span>
  //   </footer>

  return <footer className="w-full bg-white px-6 border-t">
        <div className="container mx-auto max-w-4xl py-6 flex flex-wrap md:flex-no-wrap justify-between items-center text-sm">
            &copy;{`${startYear}${currentYear}`} {BLOG.AUTHOR}. All rights reserved.
            <div className="pt-4 md:p-0 text-center md:text-right text-xs">
                {/* 右侧链接 */}
                {/* <a href="#" className="text-black no-underline hover:underline">Privacy Policy</a> */}
                {BLOG.BEI_AN && (<a href="https://beian.miit.gov.cn/" className="text-black no-underline hover:underline ml-4">{BLOG.BEI_AN} </a>)}
                <span className='text-black no-underline ml-4'>
                    Powered by
                    <a href="https://github.com/tangly1024/NotionNext" className=' hover:underline'> NotionNext {BLOG.VERSION}  </a>
                </span>
            </div>
        </div>
    </footer>
}
