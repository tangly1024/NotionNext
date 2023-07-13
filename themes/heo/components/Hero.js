// import Image from 'next/image'

import BLOG from '@/blog.config'
import { PlusSmall } from '@/components/HeroIcons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 顶部英雄区
 * 左右布局，
 * 左侧：banner组
 * 右侧：今日卡牌遮罩
 * @returns
 */
const Hero = props => {
  return (<hero id="hero" style={{ zIndex: 1 }} className="max-w-[86rem] w-full mx-auto flex relative space-x-6 px-5" >
        {/* 左侧banner组 */}
        <BannerGroup />

        {/* 右侧置顶文章组 */}
        <TopGroup {...props} />

    </hero>)
}

/**
 * 英雄区左侧banner组
 * @returns
 */
function BannerGroup() {
  return <div id='hero-left' className='flex flex-col flex-1 bg-red-200'>
        <div className="h-60 bg-white rounded-xl border my-2"></div>

        <div className="h-20 flex flex-nowrap justify-between space-x-3 my-2">
            <Link href="/tag/必看精选" className="bg-blue-500 flex justify-start items-center text-white rounded-xl hover:w-1/2 w-1/3 transition-all duration-300 ease-in-out ">
                <div className="font-bold text-lg pl-4 relative">
                    必看精选
                    <span className="absolute -bottom-0.5 left-4 w-5 h-0.5 bg-white rounded-full"></span>
                </div>
            </Link>
            <Link href="/tag/热门文章" className="bg-orange-500 flex justify-start items-center text-white rounded-xl hover:w-1/2 w-1/3 transition-all duration-300 ease-in-out">
                <div className="font-bold text-lg pl-4 relative">
                    热门文章
                    <span className="absolute -bottom-0.5 left-4 w-5 h-0.5 bg-white rounded-full"></span>
                </div>
            </Link>
            <Link href="/tag/实用教程" className="bg-emerald-500 flex justify-start items-center text-white rounded-xl hover:w-1/2 w-1/3 transition-all duration-300 ease-in-out">
                <div className="font-bold text-lg pl-4 relative">
                    实用教程
                    <span className="absolute -bottom-0.5 left-4 w-5 h-0.5 bg-white rounded-full"></span>
                </div>
            </Link>
        </div>

    </div>
}

/**
 * 置顶文章区域
 */
function TopGroup(props) {
  const { latestPosts, siteInfo } = props
  return <div id='hero-right' className='bg-green-200 flex-1 relative'>
        <div id='top-group' className='w-full h-full grid grid-cols-3 gap-3 py-2'>
            {latestPosts?.map(p => {
              return <Link href={`${BLOG.SUB_PATH}/${p?.slug}`} key={p.id}>
                    <div className='cursor-pointer group relative flex flex-col w-52 overflow-hidden shadow bg-white rounded-xl'>
                        {/* eslint-disable-next-line */}
                        <img className='h-24 object-cover' src={p?.pageCoverThumbnail || siteInfo?.pageCover} />
                        <div className='h-16 line-clamp-2 overflow-hidden p-3 font-semibold'>{p?.title}</div>
                        <div className='opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-200 transition-all absolute -top-2 -left-2 bg-indigo-600 text-white rounded-xl overflow-hidden pr-2 pb-2 pl-4 pt-4 text-xs'>荐</div>
                    </div>
                </Link>
            })}
        </div>

        <TodayCard />
    </div>
}

/**
 * 英雄区右侧，今日卡牌
 * @returns
 */
function TodayCard() {
  // 卡牌是否盖住下层
  const [isCoverUp, setIsCoverUp] = useState(true)
  const router = useRouter()
  function handleMouseLeave() {
    setIsCoverUp(true)
  }

  function handleClickMore(e) {
    e.stopPropagation()
    setIsCoverUp(false)
  }

  /**
     * 点击卡片跳转的链接
     * @param {*} e
     */
  function handleCardClick(e) {
    router.push('https://tangly1024.com')
  }

  return <div id='today-card' className={'overflow-hidden absolute flex flex-1 flex-col h-full top-0 w-full'}>
        <div id='card-body' onMouseLeave={handleMouseLeave} onClick={handleCardClick} className={`${isCoverUp ? 'opacity-100 cursor-pointer' : 'opacity-0 transform scale-110'} transition-all duration-150today-card my-2 h-full bg-[#0E57D5] rounded-xl relative overflow-hidden flex items-end`}>
            <div id='today-card-info' className='z-10 flex justify-between w-full relative text-white p-10 items-end'>
                <div className='flex flex-col'>
                    <div className='text-sm font-light'>新版上线</div>
                    <div className='text-3xl font-extrabold'>NotionNext4.0轻松定制主题</div>
                </div>
                <div onClick={handleClickMore} className={`'${isCoverUp ? '' : 'hidden pointer-events-none '} cursor-zoom-in flex items-center px-3 h-10 justify-center bg-[#425aef] hover:bg-[#4259efcb] transition-colors duration-100 rounded-3xl`}>
                    <PlusSmall className={'w-6 h-6 mr-2 bg-white rounded-full stroke-indigo-400'} />
                    <div id='more' className='select-none'>更多推荐</div>
                </div>
            </div>
            <div id='today-card-cover' className={`${isCoverUp ? '' : ' pointer-events-none'} cursor-pointer today-card-cover absolute w-full h-full top-0`}style={{ background: "url('https://bu.dusays.com/2023/03/12/640dcd3a1b146.png') no-repeat center /cover" }}></div>
        </div>
    </div>
}

export default Hero
