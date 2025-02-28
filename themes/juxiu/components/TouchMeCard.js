import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }
  return (
    <div className={'relative h-28 text-white flex flex-col'}>
      <FlipCard
        // dark:bg-yellow-600
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#27c125]  dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
            </h2>
            <h3 className='pt-2'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG)}
            </h3>
            <div
              className='absolute left-0 top-0 w-full h-full'
              style={{
                background:
                  'url(https://bu.dusays.com/2023/03/03/6401bd0b742d8.png)  calc(100% + 10px)  -10px / 26% no-repeat'
              }}></div>
          </div>
        }
        backContent={
          <Link href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            {/* <div className='font-[1000] text-xl h-full'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
            </div> */}
            <div
              className='absolute left-0 top-0 w-full h-full'
              style={{
                background:
                  'url(/images/juxiu/gongzhonghao-biao.png)  center center / 100% no-repeat'
              }}></div>
          </Link>
        }
      />
    </div>
  )
}
