// import Image from 'next/image'
import CONFIG from '../config'
import LazyImage from '@/components/LazyImage'

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const { siteInfo } = props

  return (
        <header id="header" className="w-full h-auto aspect-[5/2] relative bg-black" >

            <div className="text-white absolute bottom-0 flex flex-col h-full items-center justify-center w-full "></div>

            <LazyImage id='header-cover' src={siteInfo?.pageCover}
                className={`header-cover w-full h-auto aspect-[5/2] object-cover object-center ${CONFIG.HOME_NAV_BACKGROUND_IMG_FIXED ? 'fixed' : ''}`} />

        </header>
  )
}

export default Hero
