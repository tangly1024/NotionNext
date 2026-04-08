// 只保留最基础的配置引用
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = 2023 // 这里的起始年份会一直显示

  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm p-6'>
      
      {/* 这是一个Flex容器，用来垂直排列两行文字，去除所有杂乱图标 */}
      <div className="flex flex-col items-center justify-center space-y-2">
        
        {/* 第一行：显示 2023 - 2026 (加粗，黑色/白色) */}
        <span className='text-base font-bold text-black dark:text-white'>
            © {since} - {currentYear} Michael Zhang.
        </span>

        {/* 第二行：你的核心 Slogan (灰色，字号稍小，显得深邃) */}
        <span className='text-xs text-gray-500 dark:text-gray-400 font-sans tracking-wide' style={{ opacity: 0.8 }}>
           Building Order in a World of Entropy
        </span>

      </div>

    </footer>
  )
}

export default Footer
