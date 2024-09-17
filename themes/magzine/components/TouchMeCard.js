import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  // 开关
  if (!siteConfig('MAGZINE_SOCIAL_CARD', null)) {
    return <></>
  }

  return (
    <div className={'relative h-32 text-black flex flex-col'}>
      <FlipCard
        className='cursor-pointer lg:py-8 px-4 py-4 border bg-[#7BE986] dark:bg-yellow-600 dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_1')}
            </h2>
            <h3 className='pt-2'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_2')}
            </h3>
          </div>
        }
        backContent={
          <Link href={siteConfig('MAGZINE_SOCIAL_CARD_URL')}>
            <div className='font-[1000] text-xl h-full'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_3')}
            </div>
          </Link>
        }
      />
    </div>
  )
}
