// 文件路径: themes/heo/components/BottomNavBar.js
// 负责底部导航栏的显示和逻辑。这是新创建的文件，请将以下全部代码复制进去

import Link from 'next/link'
import { useRouter } from 'next/router'
// 为了显示图标，我们需要一个图标库。react-icons 是个不错的选择。
// 如果你还没安装，请在项目根目录运行: npm install react-icons
import { HiHome, HiOutlineSparkles, HiOutlineChatBubbleOvalLeftEllipsis, HiOutlineBookOpen } from 'react-icons/hi2'

// 定义导航按钮的数据
const navItems = [
  // path: 点击后跳转的链接
  // icon: 图标组件
  // text: 显示的文字
  { path: '/', icon: HiHome, text: '主页' },
  { path: '/ai-helper', icon: HiOutlineSparkles, text: 'AI助手' },
  { path: '/forum', icon: HiOutlineChatBubbleOvalLeftEllipsis, text: '论坛' },
  { path: '/books', icon: HiOutlineBookOpen, text: '书籍' }
]

/**
 * 移动端底部导航栏组件
 */
const BottomNavBar = () => {
  const router = useRouter()

  return (
    // nav-wrapper: 这是一个固定的容器，位于屏幕底部。
    // md:hidden: 这个类名的意思是，在桌面端(md及以上)自动隐藏，只在手机端显示。
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-black border-t dark:border-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map(item => {
          // 判断当前路由是否是这个按钮的路径，如果是，就高亮显示
          const isActive = router.pathname === item.path

          return (
            <Link key={item.text} href={item.path} passHref>
              <a className="flex flex-col items-center justify-center text-center w-full h-full">
                {/* 图标 */}
                <item.icon className={`text-2xl transition-all ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                {/* 文字 */}
                <span className={`text-xs mt-1 transition-all ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                  {item.text}
                </span>
              </a>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavBar
