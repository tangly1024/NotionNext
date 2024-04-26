import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer (props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return <footer className="relative w-full bg-black px-6 border-t">
        <DarkModeButton className='text-center pt-4'/>

        <div className="text-yellow-300 container mx-auto max-w-4xl py-6 md:flex flex-wrap md:flex-no-wrap md:justify-between items-center text-sm">
            <div className='text-center'> &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights reserved.</div>
            <div className="md:p-0 text-center md:text-right text-xs">
                {/* 右侧链接 */}
                {/* <a href="#" className="text-black no-underline hover:underline">Privacy Policy</a> */}
                <div id="footer-bottom-right">
                  {siteConfig('GA_BEI_AN') && <><img width="17px" height="17px" src="./beian.png" alt="" /> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002003110" className="mr-2">{siteConfig('GA_BEI_AN')}</a></>}
                  {siteConfig('BEI_AN') && (<a href="https://beian.miit.gov.cn/">{siteConfig('BEI_AN')} </a>)}
                </div>
                <span className='no-underline ml-4'>
                    Powered by
                    <a href="https://github.com/dear7575" className=' hover:underline'> 非你莫属  </a>
                </span>
            </div>
        </div>
    </footer>
}
