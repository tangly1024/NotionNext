import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  const { locale } = useGlobal()

  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }

  // 多语言文本配置
  const translations = {
    'zh-CN': {
      title1: '交流频道',
      title2: '添加微信，加入微信群讨论',
      title3: '点击扫码添加微信'
    },
    'en': {
      title1: 'Contact Channel',
      title2: 'Add WeChat to join group discussion',
      title3: 'Click to scan QR code'
    },
    'en-US': {
      title1: 'Contact Channel',
      title2: 'Add WeChat to join group discussion',
      title3: 'Click to scan QR code'
    }
  }

  const currentLang = translations[locale] || translations['zh-CN']

  return (
    <div className={'relative h-28 text-white flex flex-col'}>
      <FlipCard
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#4f65f0] dark:bg-yellow-600 dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {currentLang.title1}
            </h2>
            <h3 className='pt-2'>
              {currentLang.title2}
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
              {currentLang.title3}
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}
