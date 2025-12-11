// components/Logo.js
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'

const Logo = ({ className }) => {
  const { siteInfo } = useGlobal()

  return (
    <SmartLink href="/" passHref legacyBehavior>
      <a className="block">
        <div
          className={`
            flex flex-col items-center justify-center 
            bg-[#31363F]          <!-- 浅色模式：深青灰 -->
            dark:bg-[#1e2228]     <!-- 深色模式：更深 -->
            rounded-xl shadow-md p-6 pb-4
            transform transition-all duration-300 
            hover:shadow-lg hover:scale-[1.02]
            ${className || ''}
          `.replace(/\s+/g, ' ').trim()}
        >
          {/* 头像 - 悬停动画 */}
          <div className="mb-2 group">
            <LazyImage
              src={siteInfo?.icon || '/default-avatar.png'}
              width={80}
              height={80}
              alt={siteConfig('AUTHOR')}
              className="
                rounded-full border-4 border-white dark:border-gray-600
                transition-all duration-500 ease-in-out
                group-hover:rotate-12 group-hover:scale-110
              "
            />
          </div>

          {/* 标题 - 纯白 */}
          <h1 className="font-bold text-xl text-white tracking-wide logo mt-1">
            {siteConfig('TITLE')}
          </h1>

          {/* 描述 - 改为纯白，高对比 */}
          <p className="text-sm text-white font-light text-center max-w-xs px-2 leading-relaxed">
            {siteConfig('DESCRIPTION')}
          </p>
        </div>
      </a>
    </SmartLink>
  )
}

export default Logo
