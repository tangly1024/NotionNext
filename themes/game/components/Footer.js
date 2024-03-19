import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

export const Footer = props => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const { post } = props
  const fullWidth = post?.fullWidth ?? false
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer
      className={`z-10 relative mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'
      }`}>
      <DarkModeButton className='text-center py-4' />
      <hr className='border-gray-200 dark:border-gray-600' />
      <div className='my-4 text-sm leading-6'>
        <div className='flex align-baseline justify-between flex-wrap'>
          <span className='dark:text-gray-200 no-underline ml-4'>
            Powered by
            <a href='https://github.com/tangly1024/NotionNext' className=' hover:underline'>
              {' '}
              NotionNext {siteConfig('VERSION')}{' '}
            </a>
          </span>
          <p>
            © {siteConfig('TITLE')} {copyrightDate}
          </p>
        </div>
      </div>
    </footer>
  )
}
