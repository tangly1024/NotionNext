import { siteConfig } from '@/lib/config'

export const Footer = props => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer
      className={`z-10 dark:bg-black bg-white p-2 rounded-lg relative mt-6 flex-shrink-0 m-auto w-full dark:text-gray-200 `}>
      {/* <hr className='my-2 border-black dark:border-gray-100' /> */}
      {/* 页面底部 */}
      <div className='w-full flex justify-between p-4 '>
        <p>
          © {siteConfig('TITLE')} {copyrightDate}
        </p>
        <p>{siteConfig('DESCRIPTION')}</p>

        <span className='dark:text-gray-200 no-underline ml-4'>
          Powered by
          <a
            href='https://github.com/tangly1024/NotionNext'
            className=' hover:underline'>
            {' '}
            NotionNext {siteConfig('VERSION')}{' '}
          </a>
        </span>
      </div>
    </footer>
  )
}
