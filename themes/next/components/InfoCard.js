import LazyImage from '@/components/LazyImage'
import Router from 'next/router'
import SocialButton from './SocialButton'
import { siteConfig } from '@/lib/config'
import { isMobile } from 'react-device-detect'
import { useState, useEffect } from 'react'

const InfoCard = (props) => {
  const { siteInfo } = props
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile)
  }, [])
      console.log("isMobileDevice",isMobileDevice);
      
  return <>
    <div className='flex flex-col items-center justify-center '>
        {!isMobileDevice && (
          <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/') }}>
            <LazyImage src={siteInfo?.icon} className='rounded-full'  alt={siteConfig('AUTHOR')}/>
          </div>
        )}
        <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{siteConfig('AUTHOR')}</div>
        <div className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center'>{siteConfig('BIO')}</div>
        <SocialButton/>
    </div>
  </>
}

export default InfoCard
