import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

/**
 * 博客统计卡牌
 * @param {*} props
 * @returns
 */
export function AnalyticsCard(props) {
  const targetDate = new Date(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const today = new Date()
  const diffTime = today.getTime() - targetDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const postCountTitle = siteConfig('HEO_POST_COUNT_TITLE', null, CONFIG)
  const siteTimeTitle = siteConfig('HEO_SITE_TIME_TITLE', null, CONFIG)
  const siteVisitTitle = siteConfig('HEO_SITE_VISIT_TITLE', null, CONFIG)
  const siteVisitorTitle = siteConfig('HEO_SITE_VISITOR_TITLE', null, CONFIG)

  const { postCount } = props

  // 计算更详细的时间
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)
  const days = diffDays % 30
  const formattedTime = `${years ? years + '年' : ''}${months ? months + '个月' : ''}${days}天`

  // 计算平均发文频率
  const postsPerMonth = (postCount / (diffDays / 30)).toFixed(1)

  // 加载不蒜子统计脚本
  useEffect(() => {
    const loadBusuanzi = () => {
      const script = document.createElement('script')
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      // 监听脚本加载完成
      script.onload = () => {
        // 移除 hidden 类
        const elements = document.querySelectorAll('.busuanzi_container_page_pv, .busuanzi_container_site_uv')
        elements.forEach(el => {
          el.classList.remove('hidden')
        })
      }

      return () => {
        document.body.removeChild(script)
      }
    }

    loadBusuanzi()
  }, [])

  return (
    <div className='analytics-card'>
      <div className="text-lg font-bold mb-4 flex items-center group/title">
        <i className="fas fa-chart-line mr-2 text-blue-500 dark:text-yellow-500 transition-all duration-300 group-hover/title:scale-110"></i>
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-yellow-500 dark:to-yellow-600 bg-clip-text text-transparent">
          站点统计
        </span>
      </div>

      <div className='space-y-3'>
        {/* 文章数量 */}
        <div className='stat-item group'>
          <div className='flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-yellow-900/30 transition-all duration-300'>
            <div className='flex items-center'>
              <i className='fas fa-file-alt mr-2 text-blue-500 dark:text-yellow-500 group-hover:animate-bounce'></i>
              <span>{postCountTitle}</span>
            </div>
            <div className='stat-value font-medium text-blue-500 dark:text-yellow-500'>{postCount}</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            平均每月发布 {postsPerMonth} 篇文章
          </div>
        </div>

        {/* 运行时间 */}
        <div className='stat-item group'>
          <div className='flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-yellow-900/30 transition-all duration-300'>
            <div className='flex items-center'>
              <i className='fas fa-calendar-alt mr-2 text-blue-500 dark:text-yellow-500 group-hover:animate-bounce'></i>
              <span>{siteTimeTitle}</span>
            </div>
            <div className='stat-value font-medium text-blue-500 dark:text-yellow-500'>{formattedTime}</div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            始于 {targetDate.toLocaleDateString()}
          </div>
        </div>

        {/* 访问量 */}
        <div className='stat-item group busuanzi_container_page_pv'>
          <div className='flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-yellow-900/30 transition-all duration-300'>
            <div className='flex items-center'>
              <i className='fas fa-eye mr-2 text-blue-500 dark:text-yellow-500 group-hover:animate-bounce'></i>
              <span>{siteVisitTitle}</span>
            </div>
            <div className='stat-value font-medium text-blue-500 dark:text-yellow-500'>
              <span className="busuanzi_value_page_pv animate-pulse">0</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            感谢您的每次访问
          </div>
        </div>

        {/* 访客数 */}
        <div className='stat-item group busuanzi_container_site_uv'>
          <div className='flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-yellow-900/30 transition-all duration-300'>
            <div className='flex items-center'>
              <i className='fas fa-users mr-2 text-blue-500 dark:text-yellow-500 group-hover:animate-bounce'></i>
              <span>{siteVisitorTitle}</span>
            </div>
            <div className='stat-value font-medium text-blue-500 dark:text-yellow-500'>
              <span className="busuanzi_value_site_uv animate-pulse">0</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            欢迎新朋友
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-card {
          position: relative;
          overflow: hidden;
        }

        .stat-item {
          position: relative;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateX(5px);
        }

        .stat-value {
          position: relative;
          transition: all 0.3s ease;
        }

        .stat-value::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: right;
        }

        .stat-item:hover .stat-value::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        @keyframes number-increase {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-value {
          animation: number-increase 0.5s ease-out;
        }

        @keyframes shine-lines {
          0% {
            background-position: -100px;
          }
          40%, 100% {
            background-position: 200px;
          }
        }

        .stat-item:hover {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 200px 100%;
          animation: shine-lines 1.2s infinite linear;
        }
      `}</style>
    </div>
  )
}
