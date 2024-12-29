import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'
import { useEffect, useState } from 'react'

/**
 * 页脚
 * @returns
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const [visitStats, setVisitStats] = useState({ pv: 0, uv: 0 })

  useEffect(() => {
    // 动态加载不蒜子脚本
    const loadBusuanzi = () => {
      const script = document.createElement('script')
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      script.async = true
      document.body.appendChild(script)

      // 监听统计数据更新
      const checkStats = setInterval(() => {
        const pvElement = document.querySelector('.busuanzi_value_site_pv')
        const uvElement = document.querySelector('.busuanzi_value_site_uv')

        if (pvElement?.textContent && uvElement?.textContent) {
          setVisitStats({
            pv: parseInt(pvElement.textContent) || 0,
            uv: parseInt(uvElement.textContent) || 0
          })
          // 显示统计容器
          document.querySelector('.busuanzi_container_site_pv').style.display = 'inline'
          document.querySelector('.busuanzi_container_site_uv').style.display = 'inline'
          clearInterval(checkStats)
        }
      }, 100)

      // 设置超时，避免无限等待
      setTimeout(() => clearInterval(checkStats), 5000)

      return () => {
        clearInterval(checkStats)
        document.body.removeChild(script)
      }
    }

    loadBusuanzi()
  }, [])

  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white  dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 社交按钮 */}
      <div className='w-full h-24'>
        <SocialButton />
      </div>

      <br />

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full h-20 flex flex-col p-3 lg:flex-row justify-between px-6 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F]'>
        <div id='footer-bottom-left'>
          <PoweredBy />
          <CopyRightDate />
        </div>

        <div id='footer-bottom-right'>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' />{' '}
              <a href='https://beian.miit.gov.cn/' className='mr-2'>
                {siteConfig('BEI_AN')}
              </a>
            </>
          )}
          <BeiAnGongAn />

          <span className='hidden busuanzi_container_site_pv' style={{ display: 'none' }}>
            <i className='fas fa-eye' />
            <span className='px-1'>{visitStats.pv}</span>{' '}
          </span>
          <span className='pl-2 hidden busuanzi_container_site_uv' style={{ display: 'none' }}>
            <i className='fas fa-users' />{' '}
            <span className='px-1'>{visitStats.uv}</span>{' '}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
