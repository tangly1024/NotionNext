import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (
      Number.isInteger(siteConfig('SINCE')) &&
      siteConfig('SINCE') < currentYear
    ) {
      return siteConfig('SINCE') + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-indigo-700 text-gray-300 justify-center text-center m-auto w-full leading-6  dark:text-gray-100 text-sm p-6'>
      {/* <DarkModeButton/> */}
      <i className='fas fa-copyright' /> {`${copyrightDate}`}{' '}
      <span>
        <span className='w-5 mx-1 text-center'>
          <i className=' animate-pulse fas fa-heart' />
        </span>{' '}
        <a
          href={siteConfig('LINK')}
          className='underline font-bold  dark:text-gray-300 '>
          {siteConfig('AUTHOR')}
        </a>
        .<br />
        {siteConfig('BEI_AN') && (
          <>
            <i className='fas fa-shield-alt' />{' '}
            <a href={siteConfig('BEI_AN_LINK')} className='mr-2'>
              {siteConfig('BEI_AN')}
            </a>
            <br />
          </>
        )}
        <BeiAnGongAn />
        <span className='hidden busuanzi_container_site_pv'>
          <i className='fas fa-eye' />
          <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
        </span>
        <span className='pl-2 hidden busuanzi_container_site_uv'>
          <i className='fas fa-users' />{' '}
          <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
        </span>
        <br />
        <h1>{title}</h1>
        <span className='text-xs '>
          Powered by{' '}
          <a
            href='https://github.com/tangly1024/NotionNext'
            className='underline dark:text-gray-300'>
            NotionNext {siteConfig('VERSION')}
          </a>
          .
        </span>
      </span>
      <br />
    </footer>
  )
}

export default Footer
