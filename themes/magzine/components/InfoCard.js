import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Router from 'next/router'
import SocialButton from './SocialButton'

/**
 * 用户信息卡
 * @param {*} props
 * @returns
 */
const InfoCard = props => {
  const { siteInfo } = props
  return (
    <div id='info-card' className='py-4'>
      <div className='items-center justify-start'>
        <div
          className='hover:scale-105 transform duration-200 cursor-pointer flex justify-start'
          onClick={() => {
            Router.push('/about')
          }}>
          <LazyImage
            src={siteInfo?.icon}
            width={120}
            alt={siteConfig('AUTHOR')}
          />
        </div>
        <div className='text-xl py-2 hover:scale-105 transform duration-200 flex justify-start dark:text-gray-300'>
          {siteConfig('AUTHOR')}
        </div>
        <div className='font-light text-gray-600 mb-2 hover:scale-105 transform duration-200 flex justify-start dark:text-gray-400'>
          {siteConfig('BIO')}
        </div>
        <SocialButton />
      </div>
    </div>
  )
}

export default InfoCard
