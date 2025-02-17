import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  if (!siteConfig('HEO_SOCIAL_CARD', null, CONFIG)) {
    return <></>
  }
  return (
    <div className={'relative h-28 text-white flex flex-col'}>
      <FlipCard
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#4f65f0] dark:bg-yellow-600 dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
            </h2>
            <h3 className='pt-2'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG)}
            </h3>
            <img
              src='/images/heo/touch-me-card.webp'
              className='absolute left-0 top-0 w-full h-full'
              loading='eager'
              fetchpriority='high'
              alt='touch-me-card'
            />
          </div>
        }
        backContent={
          <Link href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            <div className='font-[1000] text-xl h-full'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
            </div>
          </Link>
        }
      />
    </div>
  )
}
