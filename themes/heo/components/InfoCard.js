import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

/**
 * 社交信息卡
 * @param {*} props
 * @returns
 */
export function InfoCard(props) {
  const { siteInfo, notice } = props
  const router = useRouter()
  // 在文章详情页特殊处理
  const isSlugPage = router.pathname.indexOf('/[prefix]') === 0
  const url1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const icon1 = siteConfig('HEO_INFO_CARD_ICON1', null, CONFIG)
  const url2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const icon2 = siteConfig('HEO_INFO_CARD_ICON2', null, CONFIG)
  return (
    <Card className='wow fadeInUp bg-[#4f65f0] dark:bg-[#f2b94bdd] text-white flex flex-col w-[283px] h-[320px] overflow-hidden relative p-5'>
      <div className='flex flex-col items-center'>
        {/* 问候语 - 可点击切换 */}
        <div className='mb-4 cursor-pointer hover:scale-105 transition-transform duration-200'>
          <GreetingsWords />
        </div>

        {/* 头像和描述容器 */}
        <div className='relative w-full flex justify-center items-center mb-10 group'>
          {/* 头像 */}
          <LazyImage
            src={siteInfo?.icon}
            className='rounded-2xl transition-opacity duration-300 group-hover:opacity-0'
            width={120}
            height={120}
            alt={siteConfig('AUTHOR')}
          />

          {/* 个人描述 - 绝对定位覆盖在头像位置 */}
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='text-center text-white'>
              测试开发工程师
            </div>
          </div>
        </div>

        {/* 底部信息组 */}
        <div className='flex justify-between items-center w-full'>
          {/* 左侧名称和描述 */}
          <Link href='/about' className='flex flex-col hover:scale-105 transition-transform duration-200'>
            <h2 className='text-xl font-bold'>{siteConfig('AUTHOR')}</h2>
            <div className='text-sm opacity-80'>无限进步</div>
          </Link>

          {/* 右侧社交图标 */}
          <div className='flex items-center'>
            {url2 && (
              <Link href={url2} className='hover:scale-110 transition-transform duration-200'>
                <div className='w-10 h-10 rounded-full bg-indigo-400 dark:bg-white dark:text-black flex items-center justify-center hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors duration-200'>
                  <i className={`${icon2} text-xl`}></i>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * 了解更多按鈕
 * @returns
 */
function MoreButton() {
  const url3 = siteConfig('HEO_INFO_CARD_URL3', null, CONFIG)
  const text3 = siteConfig('HEO_INFO_CARD_TEXT3', null, CONFIG)
  if (!url3) {
    return <></>
  }
  return (
    <Link href={url3}>
      <div
        className={
          'group bg-indigo-400 dark:bg-yellow-500 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white flex items-center transition-colors duration-200 py-2 px-3 rounded-full space-x-1'
        }>
        <ArrowRightCircle
          className={
            'group-hover:stroke-black dark:group-hover:stroke-white w-6 h-6 transition-all duration-100'
          }
        />
        <div className='font-bold'>{text3}</div>
      </div>
    </Link>
  )
}

/**
 * 欢迎语
 */
function GreetingsWords() {
  const greetings = siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  const [greeting, setGreeting] = useState(greetings[0])
  // 每次点击，随机获取greetings中的一个
  const handleChangeGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    setGreeting(greetings[randomIndex])
  }

  return (
    <div
      onClick={handleChangeGreeting}
      className=' select-none cursor-pointer py-1 px-2 bg-indigo-400 hover:bg-indigo-50  hover:text-indigo-950 dark:bg-yellow-500 dark:hover:text-white dark:hover:bg-black text-sm rounded-lg  duration-200 transition-colors'>
      {greeting}
    </div>
  )
}
