// import Image from 'next/image'
import { ArrowPath, ArrowSmallRight, PlusSmall } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * 顶部英雄区
 * 左右布局，
 * 左侧：banner组
 * 右侧：今日卡牌遮罩
 * @returns
 */
const Hero = props => {
  const HEO_HERO_REVERSE = siteConfig('HEO_HERO_REVERSE', false, CONFIG)
  return (
    <div
      id='hero-wrapper'
      className='recent-top-post-group w-full overflow-hidden select-none px-5 mb-4'>
      <div
        id='hero'
        style={{ zIndex: 1 }}
        className={`${HEO_HERO_REVERSE ? 'xl:flex-row-reverse' : ''}
           recent-post-top rounded-[12px] 2xl:px-5 recent-top-post-group max-w-[86rem] overflow-x-scroll w-full mx-auto flex-row flex-nowrap flex relative`}>
        {/* 左侧banner组 */}
        <BannerGroup {...props} />

        {/* 中间留白 */}
        <div className='px-1.5 h-full'></div>

        {/* 右侧置顶文章组 */}
        <TopGroup {...props} />
      </div>
    </div>
  )
}

/**
 * 英雄区左侧banner组
 * @returns
 */
function BannerGroup(props) {
  return (
    // 左侧英雄区
    <div
      id='bannerGroup'
      className='hidden xl:flex flex-col justify-between flex-1 mr-2 max-w-[42rem]'>
      {/* 动图 */}
      <Banner {...props} />
      {/* 导航分类 */}
      <GroupMenu />
    </div>
  )
}

/**
 * 英雄区左上角banner动图
 * @returns
 */
function Banner(props) {
  const router = useRouter()
  const { allNavPages } = props
  /**
   * 随机跳转文章
   */
  function handleClickBanner() {
    const randomIndex = Math.floor(Math.random() * allNavPages.length)
    const randomPost = allNavPages[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  // 遮罩文字
  const coverTitle = siteConfig('HEO_HERO_COVER_TITLE')

  return (
    <div
      id='banners'
      onClick={handleClickBanner}
        className='hidden xl:flex xl:flex-col group h-full bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] rounded-xl hover:border hover:border-[var(--heo-color-border)] dark:hover:border-[var(--heo-color-border-dark)] mb-3 relative overflow-hidden'>
      <div
        id='banner-title'
        className='z-10 flex flex-col absolute top-10 left-10'>
        <div className="text-4xl font-bold mb-3 text-orange-500 dark:text-orange-300"
     style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',  
     }}>
          {siteConfig('HEO_HERO_TITLE_1', null, CONFIG)}
          <br />
          {siteConfig('HEO_HERO_TITLE_2', null, CONFIG)}
        </div>
        <div className='text-xs font-bold text-gray-600  dark:text-gray-200'>
          {siteConfig('HEO_HERO_TITLE_3', null, CONFIG)}
        </div>
      </div>

      {/* 斜向滚动的图标 */}
      <TagsGroupBar />

      {/* 遮罩 */}
      <div
        id='banner-cover'
        style={{ backdropFilter: 'blur(15px)' }}
        className={
          'z-20 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 duration-300 transition-all bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)] dark:text-white cursor-pointer absolute w-full h-full top-0 flex justify-start items-center'
        }>
        <div className='ml-12 -translate-x-32 group-hover:translate-x-0 duration-300 transition-all ease-in'>
          <div className='text-7xl text-white font-extrabold'>{coverTitle}</div>
          <div className='-ml-3 text-gray-300'>
            <ArrowSmallRight className={'w-24 h-24 stroke-2'} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 图标滚动标签组
 * 英雄区左上角banner条中斜向滚动的图标
 */
function TagsGroupBar() {
  let groupIcons = siteConfig('HEO_GROUP_ICONS', null, CONFIG)
  if (groupIcons) {
    groupIcons = groupIcons.concat(groupIcons)
  }
  return (
    <div className='tags-group-all flex -rotate-[30deg] h-full'>
      <div className='tags-group-wrapper flex flex-nowrap absolute top-16'>
        {groupIcons?.map((g, index) => {
          return (
            <div key={index} className='tags-group-icon-pair ml-6 select-none'>
              <div
                style={{ background: g.color_1 }}
                className={
                  'tags-group-icon w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={true}
                  src={g.img_1}
                  title={g.title_1}
                  className='w-2/3 hidden xl:block'
                />
              </div>
              <div
                style={{ background: g.color_2 }}
                className={
                  'tags-group-icon  mt-5 w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={true}
                  src={g.img_2}
                  title={g.title_2}
                  className='w-2/3 hidden xl:block'
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 英雄区左下角3个指定分类按钮
 * @returns
 */
function GroupMenu() {
  const url_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.url || ''
  const title_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.title || ''
  const url_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.url || ''
  const title_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.title || ''
  const url_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.url || ''
  const title_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.title || ''

  return (
    <div className='h-[165px] select-none xl:h-20 flex flex-col justify-between xl:space-y-0 xl:flex-row w-28 lg:w-48 xl:w-full xl:flex-nowrap xl:space-x-3'>
      <SmartLink
        href={url_1}
        className='group relative overflow-hidden bg-[var(--heo-color-primary)] flex h-20 justify-start items-center text-[var(--heo-color-primary-text)] rounded-xl xl:hover:w-1/2 xl:w-1/3 transition-all duration-500 ease-in'>
        <div className='font-bold lg:text-lg  pl-5 relative -mt-2'>
          {title_1}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='hidden lg:block absolute right-6  duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-star text-4xl'></i>
        </div>
      </SmartLink>
      <SmartLink
        href={url_2}
        className='group relative overflow-hidden bg-gradient-to-r from-red-500 to-yellow-500 flex h-20 justify-start items-center text-white rounded-xl xl:hover:w-1/2 xl:w-1/3 transition-all duration-500 ease-in'>
        <div className='font-bold lg:text-lg pl-5 relative -mt-2'>
          {title_2}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='hidden lg:block absolute right-6  duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-fire-flame-curved text-4xl'></i>
        </div>
      </SmartLink>
      {/* 第三个标签在小屏上不显示 */}
      <SmartLink
        href={url_3}
        className='group relative overflow-hidden bg-gradient-to-r from-teal-300 to-cyan-300 hidden h-20 xl:flex justify-start items-center text-white rounded-xl xl:hover:w-1/2 xl:w-1/3 transition-all duration-500 ease-in'>
        <div className='font-bold text-lg pl-5 relative -mt-2'>
          {title_3}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='absolute right-6 duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-book-bookmark text-4xl '></i>
        </div>
      </SmartLink>
    </div>
  )
}

/**
 * 置顶文章区域
 */
function TopGroup(props) {
  const { latestPosts, allNavPages, siteInfo } = props
  const { locale } = useGlobal()
  const todayCardRef = useRef()
  function handleMouseLeave() {
    todayCardRef.current.coverUp()
  }

  // 获取置顶推荐文章
  const topPosts = getTopPosts({ latestPosts, allNavPages })

  return (
    <div
      id='hero-right-wrapper'
      onMouseLeave={handleMouseLeave}
      className='flex-1 relative w-full h-64 xl:h-[342px]'>
      {/* 置顶推荐文章 */}
      <div
        id='top-group'
        className='w-full flex space-x-3 xl:space-x-0 xl:grid xl:grid-cols-3 xl:gap-3 xl:h-[342px]'>
        {topPosts?.map((p, index) => {
          return (
            <SmartLink href={`${siteConfig('SUB_PATH', '')}/${p?.slug}`} key={index}>
              <div className='cursor-pointer h-[164px] group relative flex flex-col w-52 xl:w-full overflow-hidden shadow bg-white dark:bg-black dark:text-white rounded-xl'>
                <LazyImage
                  priority={index === 0}
                  className='h-24 object-cover'
                  alt={p?.title}
                  src={p?.pageCoverThumbnail || siteInfo?.pageCover}
                />
                <div className='group-hover:text-[var(--heo-color-primary)] dark:group-hover:text-[var(--heo-color-accent)] line-clamp-2 overflow-hidden m-2 font-semibold'>
                  {p?.title}
                </div>
                {/* hover 悬浮的 ‘荐’ 字 */}
                <div className='opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-200 transition-all absolute -top-2 -left-2 bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)] text-[var(--heo-color-primary-text)] rounded-xl overflow-hidden pr-2 pb-2 pl-4 pt-4 text-xs'>
                  {locale.COMMON.RECOMMEND_BADGES}
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
      {/* 一个大的跳转文章卡片 */}
      <TodayCard cRef={todayCardRef} />
    </div>
  )
}

/**
 * 获取推荐置顶文章
 */
function getTopPosts({ latestPosts, allNavPages }) {
  // 默认展示最近更新
  if (
    !siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) ||
    siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) === ''
  ) {
    return latestPosts.sort((a, b) => new Date(b.date) - new Date(a.date)) 
  }

  // 显示包含‘推荐’标签的文章
  let sortPosts = []

  // 排序方式
  if (
    JSON.parse(
      siteConfig('HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME', null, CONFIG)
    )
  ) {
    sortPosts = Object.create(allNavPages).sort((a, b) => {
      const dateA = new Date(a?.lastEditedDate)
      const dateB = new Date(b?.lastEditedDate)
      return dateB - dateA
    })
  } else {
    sortPosts = Object.create(allNavPages)
  }

  const topPosts = []
  for (const post of sortPosts) {
    if (topPosts.length === 6) {
      break
    }
    // 查找标签
    if (
      post?.tags?.indexOf(
        siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG)
      ) >= 0
    ) {
      topPosts.push(post)
    }
  }
  return topPosts
}

/**
 * 英雄区右侧，今日卡牌
 * @returns
 */
function normalizeHeroQuotes(value) {
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
      return normalizeHeroQuotes(parsed)
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

/**
 * 英雄区右侧，今日卡牌
 * 每日一句 + Steam 状态，保留推荐文章遮罩入口
 * @returns
 */
// 每日一句可随机切换的入场动画
const QUOTE_ANIMS = ['flip', 'glitch', 'slide', 'zoom']

function TodayCard({ cRef }) {
  const steamProfileUrl = siteConfig('HEO_STEAM_PROFILE_URL', null, CONFIG)
  const { locale } = useGlobal()
  // 获取遮罩控制配置
  const coverEnable = siteConfig('HEO_HERO_RECOMMEND_COVER_ENABLE', true, CONFIG)
  // 卡牌是否盖住下层，如果配置为false则默认不盖住
  const [isCoverUp, setIsCoverUp] = useState(coverEnable)

  // 每日一句
  const quoteList = normalizeHeroQuotes(
    siteConfig('HEO_HERO_QUOTES', null, CONFIG)
  )
  const fallbackQuote = siteConfig('HEO_HERO_TITLE_5', '', CONFIG)
  const sentences =
    quoteList.length > 0 ? quoteList : fallbackQuote ? [fallbackQuote] : []
  const [quoteIndex, setQuoteIndex] = useState(() =>
    sentences.length > 0 ? Math.floor(Math.random() * sentences.length) : -1
  )
  // 每日一句切换：5 秒冷却 + 随机入场动画
  const [cooldown, setCooldown] = useState(0)
  const [quotePhase, setQuotePhase] = useState('idle')
  const [quoteAnim, setQuoteAnim] = useState(() =>
    QUOTE_ANIMS[Math.floor(Math.random() * QUOTE_ANIMS.length)]
  )
  const prevAnimRef = useRef(null)
  const quoteTimeoutRef = useRef(null)

  /**
   * 随机挑选一种入场动画，避免连续两次相同
   */
  function pickRandomAnim() {
    const candidates = QUOTE_ANIMS.filter(a => a !== prevAnimRef.current)
    const anim = candidates[Math.floor(Math.random() * candidates.length)]
    prevAnimRef.current = anim
    return anim
  }

  /**
   * 冷却倒计时：每秒减 1
   */
  useEffect(() => {
    if (cooldown <= 0) {
      return
    }
    const timer = setTimeout(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  /**
   * 组件卸载时清理切换动画定时器
   */
  useEffect(() => {
    return () => clearTimeout(quoteTimeoutRef.current)
  }, [])

  // Steam 状态：是否显示加载占位，用公开的 SteamID 判断；API Key 只在服务端环境变量里
  const steamConfigured = Boolean(siteConfig('HEO_STEAM_ID', null, CONFIG))
  const [steam, setSteam] = useState(null)
  const [steamError, setSteamError] = useState(false)

  /**
   * 外部可以调用此方法
   */
  useImperativeHandle(cRef, () => {
    return {
      coverUp: () => {
        if (coverEnable) {
          setIsCoverUp(true)
        }
      }
    }
  })

  /**
   * 查看更多
   * @param {*} e
   */
  function handleClickShowMore(e) {
    e.stopPropagation()
    setIsCoverUp(false)
  }

  /**
   * 随机切换下一句：带 5 秒冷却与随机入场动画
   * @param {*} e
   */
  function handleNextQuote(e) {
    e.stopPropagation()
    if (sentences.length < 2 || cooldown > 0 || quotePhase === 'leave') {
      return
    }
    setCooldown(5)
    // 先快速淡出，再切换内容并按随机动画入场
    setQuoteAnim(pickRandomAnim())
    setQuotePhase('leave')
    quoteTimeoutRef.current = setTimeout(() => {
      let next = quoteIndex
      while (next === quoteIndex) {
        next = Math.floor(Math.random() * sentences.length)
      }
      setQuoteIndex(next)
      setQuotePhase('enter')
    }, 200)
  }

  /**
   * 拉取 Steam 状态
   */
  useEffect(() => {
    if (!steamConfigured) {
      return
    }
    const controller = new AbortController()
    fetch('/api/steam-status', { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then(data => {
        if (!controller.signal.aborted) {
          setSteam(data)
        }
      })
      .catch(err => {
        if (!controller.signal.aborted && err.name !== 'AbortError') {
          setSteamError(true)
        }
      })
    return () => controller.abort()
  }, [steamConfigured])

  // 如果配置为不显示遮罩，则不渲染TodayCard
  if (!coverEnable) {
    return null
  }

  const currentQuote = sentences[quoteIndex] || ''
  // 根据切换阶段生成动画 class
  const quoteAnimClass =
    quotePhase === 'leave'
      ? 'quote-switch-leave'
      : quotePhase === 'enter'
        ? `quote-switch-enter quote-switch-enter-${quoteAnim}`
        : ''
  const player = steam?.player
  const showSteamLoading = steamConfigured && !steam && !steamError

  // Steam 状态文案
  let steamStatusText = ''
  if (player?.inGame) {
    const gameName = player.gameNameCn || player.gameextrainfo
    steamStatusText =
      player.numFriendsInGame > 0
      ? `在和${player.numFriendsInGame}个朋友遨游「${gameName}」的世界`
      : `在「${gameName}」的世界中`
  } else if (player && player.personastate === 0) {
    const lastGame =
      player.lastPlayedGameNameCn ||
      player.lastPlayedGameName ||
      '某款游戏'
    steamStatusText = player.lastlogoff
      ? `${formatRelativeTime(player.lastlogoff)}玩了「${lastGame}」`
      : '离线'
  } else if (player) {
    steamStatusText = '正沉浸在自己的世界中'
  }

  return (
    <div
      id='today-card'
      className={`${
        isCoverUp ? ' ' : 'pointer-events-none'
      } overflow-hidden absolute flex flex-1 flex-col h-full top-0 w-full`}>
      <div
        id='card-body'
        className={`${
          isCoverUp
            ? 'opacity-100 cursor-pointer'
            : 'opacity-0 transform scale-110 pointer-events-none'
        } shadow transition-all duration-200 today-card h-full w-full rounded-xl relative overflow-hidden flex flex-col`}>
          {/* 背景图 + 暗色遮罩，保证文字可读 */}
          <div className='absolute inset-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/bg_image.jpg'
              alt=''
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/35 dark:bg-black/75' />
          </div>

          {/* 上半部分：按钮 + 每日一句 */}
          <div className='relative z-10 flex flex-col flex-1 p-5 pb-2 gap-3 min-h-0 text-white'>
            <div className='flex items-center justify-between gap-2'>
              {sentences.length > 1 && (
                <button
                  type='button'
                  onClick={handleNextQuote}
                  disabled={cooldown > 0}
                  className={`group flex items-center gap-1.5 px-3 h-9 rounded-full border border-white/40 text-sm whitespace-nowrap transition-all ${
                    cooldown > 0
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  }`}>
                  <ArrowPath
                    className={`w-4 h-4 transition-all duration-500 ${
                      cooldown > 0 ? 'animate-spin' : 'group-hover:rotate-180'
                    }`}
                  />
                  <span className='select-none'>换一个</span>
                  {cooldown > 0 && (
                    <span className='w-6 h-6 flex items-center justify-center rounded-full bg-white/25 text-xs tabular-nums'>
                      {cooldown}
                    </span>
                  )}
                </button>
              )}
              <button
                type='button'
                onClick={handleClickShowMore}
                className='group flex items-center gap-1.5 px-3 h-9 rounded-full border border-white/40 text-sm hover:bg-white/10 transition-colors whitespace-nowrap'>
                <PlusSmall className='group-hover:rotate-180 duration-500 transition-all w-4 h-4' />
                <span className='select-none'>{locale.COMMON.RECOMMEND_POSTS}</span>
              </button>
            </div>
            <div className='flex-1 flex items-center min-h-0'>
              <div className='min-w-0'>
                <div className='text-xs font-light mb-2 text-white/70'>
                  {siteConfig('HEO_HERO_TITLE_4', null, CONFIG)}
                </div>
                <div
                  aria-live='polite'
                  className={`quote-switch relative overflow-hidden text-xl xl:text-2xl font-bold leading-snug line-clamp-3 ${
                    quoteAnimClass
                  }`}>
                  {currentQuote}
                  <span className='quote-burst' aria-hidden='true' />
                  <span className='quote-streak' aria-hidden='true' />
                </div>
              </div>
            </div>
          </div>

          {/* 下半部分：Steam 状态 */}
          <div className='relative z-10 p-5 pt-3 border-t border-orange-700 dark:border-orange-400 flex justify-end'>
            {showSteamLoading && (
              <div className='flex items-center gap-2 text-sm text-white/70'>
                <span className='w-8 h-8 rounded-full bg-white/20 animate-pulse' />
                <span>🔁正在获取 Steam 状态…</span>
              </div>
            )}
            {player && (
              <a
                href={steamProfileUrl || player.profileurl}
                target='_blank'
                rel='noreferrer'
                className='group/steam flex items-center gap-3 hover:opacity-80 transition-opacity'>
                <div className='leading-snug min-w-0 text-right'>
                  <div className='text-sm font-medium text-white'>
                    {steamStatusText}
                  </div>
                  <div className='text-xs text-white/60 truncate'>
                    {player.personaname} · 点击查看 Steam 主页
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={player.avatarfull}
                  alt={player.personaname}
                  className='w-10 h-10 rounded-full object-cover shrink-0'
                />
              </a>
            )}
          </div>
      </div>
      <style>{`
        .quote-switch {
          transform-origin: 50% 50%;
        }
        .quote-switch-leave {
          animation: quoteLeave 0.2s ease-in both;
        }
        .quote-switch-enter {
          animation: quoteEnterFlip 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .quote-switch-enter-glitch {
          animation-name: quoteEnterGlitch;
        }
        .quote-switch-enter-slide {
          animation-name: quoteEnterSlide;
        }
        .quote-switch-enter-zoom {
          animation-name: quoteEnterZoom;
        }
        .quote-burst {
          position: absolute;
          inset: -50% -20%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(124, 231, 255, 0.16) 35%,
            transparent 70%
          );
          opacity: 0;
          pointer-events: none;
        }
        .quote-switch-enter .quote-burst {
          animation: quoteBurst 0.55s ease-out both;
        }
        .quote-streak {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 45%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 45%,
            rgba(124, 231, 255, 0.55) 55%,
            transparent 100%
          );
          transform: translateX(-160%);
          opacity: 0;
          pointer-events: none;
        }
        .quote-switch-enter .quote-streak {
          animation: quoteStreak 0.65s 0.15s ease-in-out both;
        }
        @keyframes quoteLeave {
          to {
            opacity: 0;
            transform: translateX(-14px) scale(0.9);
            filter: blur(5px);
          }
        }
        @keyframes quoteEnterFlip {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateY(-80deg) scale(0.75);
            filter: blur(6px);
          }
          55% {
            opacity: 1;
            transform: perspective(800px) rotateY(8deg) scale(1.04);
            filter: blur(0);
          }
          75% {
            transform: perspective(800px) rotateY(-3deg) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg) scale(1);
            filter: blur(0);
          }
        }
        @keyframes quoteEnterGlitch {
          0% {
            opacity: 0;
            transform: translateX(48px) scale(0.7) skewX(-10deg);
            filter: blur(8px);
            text-shadow: 6px 0 rgba(255, 0, 80, 0.9),
              -6px 0 rgba(0, 229, 255, 0.9);
          }
          30% {
            opacity: 1;
            transform: translateX(-14px) scale(1.06) skewX(7deg);
            filter: blur(0);
          }
          45% {
            transform: translateX(9px) skewX(-5deg);
            text-shadow: -4px 0 rgba(255, 0, 80, 0.7),
              4px 0 rgba(0, 229, 255, 0.7);
          }
          60% {
            transform: translateX(-5px) skewX(3deg);
          }
          75% {
            transform: translateX(2px) scale(1.02) skewX(-1deg);
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1) skewX(0);
            filter: blur(0);
            text-shadow: none;
          }
        }
        @keyframes quoteEnterSlide {
          0% {
            opacity: 0;
            transform: translateX(70px) skewX(-14deg);
            filter: blur(4px);
          }
          55% {
            opacity: 1;
            transform: translateX(-10px) skewX(4deg);
            filter: blur(0);
          }
          75% {
            transform: translateX(3px) skewX(-1deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) skewX(0);
            filter: blur(0);
          }
        }
        @keyframes quoteEnterZoom {
          0% {
            opacity: 0;
            transform: scale(0.4);
            filter: blur(12px);
          }
          55% {
            opacity: 1;
            transform: scale(1.08);
            filter: blur(0);
          }
          75% {
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
        @keyframes quoteBurst {
          0% {
            opacity: 0;
            transform: scale(0.25);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.7);
          }
        }
        @keyframes quoteStreak {
          0% {
            transform: translateX(-160%);
            opacity: 1;
          }
          100% {
            transform: translateX(320%);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .quote-switch-leave,
          .quote-switch-enter,
          .quote-switch-enter-glitch,
          .quote-switch-enter-slide,
          .quote-switch-enter-zoom {
            animation: none;
          }
          .quote-burst,
          .quote-streak {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * 将时间戳格式化为相对时间（用于离线状态）
 */
function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return '很久以'
  }
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - timestamp))
  const minute = 60
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) {
    return '刚刚'
  }
  if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  }
  if (diff < 30 * day) {
    return `${Math.floor(diff / day)}天前`
  }
  return `${Math.floor(diff / (30 * day))}个月前`
}

export default Hero
