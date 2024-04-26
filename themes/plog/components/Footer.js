import Vercel from '@/components/Vercel'
import { siteConfig } from '@/lib/config'

export const Footer = (props) => {
  const d = new Date()
  const currentYear = d.getFullYear()

  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return <footer className={'z-10 relative mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all' } >
     <div className="my-4 text-sm leading-6">
       <div className="flex align-baseline justify-start flex-wrap space-x-6">
         <div id="footer-bottom-right">
           {siteConfig('GA_BEI_AN') && <><img width="17px" height="17px" src="./beian.png" alt="" /> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002003110" className="mr-2">{siteConfig('GA_BEI_AN')}</a></>}
           {siteConfig('BEI_AN') && (<a href="https://beian.miit.gov.cn/" className="text-black dark:text-gray-200 no-underline hover:underline ml-4">{siteConfig('BEI_AN')} </a>)}
         </div>
         <div> © {siteConfig('AUTHOR')} {copyrightDate}  </div>
         <div>Powered By <a href="https://github.com/dear7575" className='underline'>© 非你莫属</a></div>
         <Vercel />
       </div>
     </div>
  </footer>
}
