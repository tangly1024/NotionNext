import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import { getLocaleConfig } from '@/lib/locale-config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  const router = useRouter()
  const { locale: routerLocale } = router

  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }

  // Get locale-aware config values
  const title1 = getLocaleConfig(siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG), routerLocale)
  const title2 = getLocaleConfig(siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG), routerLocale)
  const title3 = getLocaleConfig(siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG), routerLocale)

  return (
    <div className={'relative h-28 text-white flex flex-col'}>
      <FlipCard
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#4f65f0] dark:bg-yellow-600 dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {title1}
            </h2>
            <h3 className='pt-2'>
              {title2}
            </h3>
            <div
              className='absolute left-0 top-0 w-full h-full'
              style={{
                background:
                  'url(https://bu.dusays.com/2023/05/16/64633c4cd36a9.png) center center no-repeat'
              }}></div>
          </div>
        }
        backContent={
          <SmartLink href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            <div className='font-[1000] text-xl h-full'>
              {title3}
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}
