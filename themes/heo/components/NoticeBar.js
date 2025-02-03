import { ArrowRightCircle } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Swipe from './Swipe'

/**
 * 通知横幅
 */
export function NoticeBar() {
  let notices = siteConfig('HEO_NOTICE_BAR', null, CONFIG)
  const { locale } = useGlobal()
  if (typeof notices === 'string') {
    notices = JSON.parse(notices)
  }
  if (!notices || notices?.length === 0) {
    return <></>
  }

  // 获取或生成随机种子
  let seed = localStorage.getItem('noticeBarSeed')
  if (!seed) {
    seed = generateRandomSeed()
    localStorage.setItem('noticeBarSeed', seed)
  }

  // 根据种子生成随机顺序
  notices = shuffleArray(notices, seed)

  return (
    <div className='max-w-[86rem] w-full mx-auto flex h-12 mb-4 px-5 font-bold'>
      <div className='animate__animated animate__fadeIn animate__fast group cursor-pointer bg-white dark:bg-[#1e1e1e] dark:text-white hover:border-indigo-600 dark:hover:border-yellow-600 border dark:border-gray-700  duration-200 hover:shadow-md transition-all rounded-xl w-full h-full flex items-center justify-between px-5'>
        <span className='whitespace-nowrap'>&#40;^_^&#41;</span>
        <div className='w-full h-full hover:text-indigo-600 dark:hover:text-yellow-600 flex justify-center items-center'>
          <Swipe items={notices} />
        </div>
        <div>
          <ArrowRightCircle className={'w-5 h-5'} />
        </div>
      </div>
    </div>
  )
}

/**
 * 生成随机种子
 * @returns {string} - 随机种子
 */
function generateRandomSeed() {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * 使用种子随机打乱数组
 * @param {Array} array - 需要打乱的数组
 * @param {string} seed - 随机种子
 * @returns {Array} - 打乱顺序后的新数组
 */
function shuffleArray(array, seed) {
  const shuffledArray = [...array] // 创建数组的副本，以避免修改原始数组
  const random = seedrandom(seed)
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

/**
 * 创建一个基于种子的随机数生成器
 * @param {string} seed - 随机种子
 * @returns {function} - 随机数生成器
 */
function seedrandom(seed) {
  let t = seed
  return function() {
    t = (t * 9301 + 49297) % 233280
    return t / 233280
  }
}
