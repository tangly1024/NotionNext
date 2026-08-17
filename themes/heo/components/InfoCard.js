import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

export function normalizeInfoCardGreetings(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      return normalizeInfoCardGreetings(parsed)
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
  }

  return [trimmed]
}

export function shouldUseInfoCardBlurAvatar(isSlugPage, avatarBlurEnabled) {
  return Boolean(isSlugPage && avatarBlurEnabled)
}

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
  const orcidUrl = siteConfig('CONTACT_ORCID')
  const orcidIcon = siteConfig('HEO_INFO_CARD_ICON_ORCID', 'fab fa-orcid', CONFIG)
  const avatarBlurEnabled = siteConfig(
    'HEO_INFO_CARD_AVATAR_BLUR',
    false,
    CONFIG
  )
  const useBlurAvatar = shouldUseInfoCardBlurAvatar(
    isSlugPage,
    avatarBlurEnabled
  )
  return (
    <Card className='wow fadeInUp bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)] text-[var(--heo-color-primary-text)] flex flex-col w-72 overflow-hidden relative'>
      {/* 信息卡牌第一行 */}
      <div className='flex justify-between'>
        {/* 问候语 */}
        <GreetingsWords />
        {/* 头像 */}
        <div
          className={`${
            useBlurAvatar
              ? 'absolute right-0 -mt-8 -mr-6 hover:opacity-0 hover:scale-150 blur'
              : 'cursor-pointer'
          } justify-center items-center flex dark:text-gray-100 transform transition-all duration-200`}>
          <LazyImage
            src={siteInfo?.icon}
            className='rounded-full'
            width={useBlurAvatar ? 100 : 28}
            height={useBlurAvatar ? 100 : 28}
            alt={siteConfig('AUTHOR')}
          />
        </div>
      </div>

      <h2 className='text-3xl font-extrabold mt-3'>{siteConfig('AUTHOR')}</h2>

      {/* 公告栏 */}
      <Announcement post={notice} style={{ color: 'white !important' }} />

      <div className='flex justify-between'>
        <div className='flex space-x-3'>
          {/* 社交按钮 */}
          {url1 && (
            <div className='w-10 text-center bg-[var(--heo-color-primary-hover)] p-2 rounded-full  transition-colors duration-200 dark:bg-black/25 dark:hover:bg-black hover:bg-white hover:text-black'>
              <SmartLink href={url1}>
                <i className={icon1} />
              </SmartLink>
            </div>
          )}
          {url2 && (
            <div className='bg-[var(--heo-color-primary-hover)] p-2 rounded-full w-10 items-center flex justify-center transition-colors duration-200 dark:bg-black/25 dark:hover:bg-black hover:bg-white hover:text-black'>
              <SmartLink href={url2}>
                <i className={icon2} />
              </SmartLink>
            </div>
          )}
          {orcidUrl && (
            <div className='bg-[var(--heo-color-primary-hover)] p-2 rounded-full w-10 items-center flex justify-center transition-colors duration-200 dark:bg-black/25 dark:hover:bg-black hover:bg-white hover:text-black'>
              <SmartLink href={orcidUrl} title='ORCID' aria-label='ORCID'>
                <i className={orcidIcon} />
              </SmartLink>
            </div>
          )}
        </div>
        {/* 第三个按钮 */}
        <MoreButton />
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
    <SmartLink href={url3}>
      <div
        className={
          'group bg-[var(--heo-color-primary-hover)] dark:bg-black/25 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white flex items-center transition-colors duration-200 py-2 px-3 rounded-full space-x-1'
        }>
        <ArrowRightCircle
          className={
            'group-hover:stroke-black dark:group-hover:stroke-white w-6 h-6 transition-all duration-100'
          }
        />
        <div className='font-bold'>{text3}</div>
      </div>
    </SmartLink>
  )
}

/**
 * 欢迎语
 */
function GreetingsWords() {
  const greetings = normalizeInfoCardGreetings(
    siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  )
  const [greeting, setGreeting] = useState(greetings[0])
  if (greetings.length === 0) {
    return null
  }
  // 每次点击，随机获取greetings中的一个
  const handleChangeGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    setGreeting(greetings[randomIndex])
  }

  return (
    <div
      onClick={handleChangeGreeting}
      className=' select-none cursor-pointer py-1 px-2 bg-[var(--heo-color-primary-hover)] hover:bg-[var(--heo-color-card-muted)]  hover:text-[var(--heo-color-text)] dark:bg-black/25 dark:hover:text-white dark:hover:bg-black text-sm rounded-lg  duration-200 transition-colors'>
      {greeting}
    </div>
  )
}
