import BLOG from '@/blog.config'
import { ArrowRightCircle, GlobeAlt } from '@/components/HeroIcons'
import Link from 'next/link'
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
  return (
        <Card className='bg-[#4f65f0] dark:bg-yellow-600 text-white flex flex-col w-72'>
            <div className='flex justify-between'>
                <GreetingsWords />
                <div className='justify-center items-center flex dark:text-gray-100 transform duration-200 cursor-pointer'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={siteInfo?.icon} className='rounded-full' width={28} alt={BLOG.AUTHOR} />
                </div>
            </div>

            <h2 className='text-3xl font-extrabold mt-3'>
                {BLOG.AUTHOR}
            </h2>

            <div>
                <Announcement post={notice} style={{ color: 'white !important' }} />
            </div>

            <div className='flex justify-between'>
                <div className='flex space-x-3 '>
                    <div className='bg-indigo-400 p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-200'><Link href='/about'><GlobeAlt className={'w-6 h-6'} /></Link></div>
                    <div className='bg-indigo-400 p-2 rounded-full w-10 items-center flex justify-center hover:bg-white hover:text-black transition-colors duration-200'><Link href='https://github.com/tangly1024/NotionNext'><i className='fab fa-github text-xl'></i></Link></div>
                </div>
                <MoreButton />
            </div>
        </Card>
  )
}

/**
 * 欢迎语
 */
function GreetingsWords() {
  const greetings = CONFIG.INFOCARD_GREETINGS
  const [greeting, setGreeting] = useState(greetings[0])
  // 每次点击，随机获取greetings中的一个
  const handleChangeGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    setGreeting(greetings[randomIndex])
  }

  return <div onClick={handleChangeGreeting} className=' select-none cursor-pointer py-1 px-2 bg-indigo-400 text-sm rounded-lg hover:bg-indigo-50 hover:text-indigo-950 duration-200 transition-colors'>
    {greeting}
  </div>
}

/**
 * 了解更多按鈕
 * @returns
 */
function MoreButton() {
  return <Link href='/about'>
        <div className={'group bg-indigo-400  hover:bg-white hover:text-black flex items-center transition-colors duration-200 py-2 px-3 rounded-full space-x-1'}>
            <ArrowRightCircle className={'group-hover:stroke-black w-6 h-6 transition-all duration-100'} />
            <div className='font-bold'>了解更多</div>
        </div>
    </Link>
}
