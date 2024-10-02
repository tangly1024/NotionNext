import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 用户信息卡
 * @param {*} props
 * @returns
 */
const InfoCard = props => {
  const { siteInfo } = useGlobal()
  const router = useRouter()

  return (
    <div id='info-card'>
      <div className='items-center justify-start'>
        <div
          className='hover:scale-105 transform duration-200 cursor-pointer flex justify-start'
          onClick={() => {
            router.push('/about')
          }}>
          <LazyImage
            src={siteInfo?.icon}
            width={120}
            alt={siteConfig('AUTHOR')}
          />
        </div>
        <div className='text-xl py-2 hover:scale-105 transform duration-200 flex justify-start '>
          {siteConfig('AUTHOR')}
        </div>
        <div className='text-gray-100 mb-2 hover:scale-105 transform duration-200 flex justify-start'>
          {siteConfig('BIO')}
        </div>
      </div>
    </div>
  )
}

export default InfoCard
