import BLOG from '@/blog.config'
import Vercel from '@/components/Vercel'

export const Footer = (props) => {
  const d = new Date()
  const currentYear = d.getFullYear()

  const copyrightDate = (function() {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return <footer className={'z-10 relative mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all' } >
     <div className="my-4 text-sm leading-6">
       <div className="flex align-baseline justify-start flex-wrap space-x-6">
         <div> © {BLOG.AUTHOR} {copyrightDate}  </div>
         <div>Powered By <a href="https://github.com/tangly1024/NotionNext" className='underline'>NotionNext {BLOG.VERSION}</a></div>
         <Vercel />
       </div>
     </div>
   </footer>
}
