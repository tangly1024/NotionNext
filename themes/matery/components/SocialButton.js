import { siteConfig } from '@/lib/config'
import { useRef, useState } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组 可折叠的组件
 * @returns {JSX.Element}
 * @constructor
 *
 * 修复说明：
 * 1. 容器增加 `items-center`：原代码只有 `flex flex-col`，缺交叉轴居中，
 *    导致展开后所有图标（含 RSS）在圆形/胶囊背景里横向不居中、明显偏移。
 * 2. 容器增加 `w-10`：与 FloatDarkModeButton / JumpToTopButton 的 40px 圆形
 *    保持宽度一致；收起态变成正圆，展开态变成等宽(40px)的胶囊，图标全部居中。
 * 3. 每个图标改用 `flex justify-center items-center w-10 h-10`（iconWrapperCls）：
 *    让每个社交图标各自成为 40px 居中单元，按几何中心精确居中，彻底消除偏移。
 */
const SocialButton = () => {
  const [show, setShow] = useState(false)
  const toggleShow = () => {
    setShow(!show)
  }

  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_ORCID = siteConfig('CONTACT_ORCID')
  const CONTACT_CSDN = siteConfig('CONTACT_CSDN')
  const CONTACT_JUEJIN = siteConfig('CONTACT_JUEJIN')
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const CONTACT_LINKEDIN = siteConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = siteConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = siteConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')

  const emailIcon = useRef(null)

  // 单个图标的通用样式：40px 圆形容器 + 居中，与其它悬浮按钮一致
  const iconWrapperCls =
    'flex justify-center items-center w-10 h-10 hover:bg-indigo-600 dark:hover:bg-gray-800'

  return (
    <div className='flex flex-col items-center w-10 transform hover:scale-105 duration-200 text-white text-center bg-indigo-700 rounded-full dark:bg-black cursor-pointer overflow-hidden select-none'>
      {!show && (
        <i
          onClick={toggleShow}
          className='transform hover:scale-125 duration-150 fas fa-user flex justify-center items-center w-10 h-10'
        />
      )}
      {show && (
        <>
          {CONTACT_GITHUB && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'github'}
              href={CONTACT_GITHUB}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-github' />
            </a>
          )}
          {CONTACT_ORCID && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'ORCID'}
              href={CONTACT_ORCID}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-orcid' />
            </a>
          )}
          {CONTACT_CSDN && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'CSDN'}
              href={CONTACT_CSDN}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-csdn' />
            </a>
          )}
          {CONTACT_JUEJIN && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'稀土掘金'}
              href={CONTACT_JUEJIN}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-juejin' />
            </a>
          )}
          {CONTACT_TWITTER && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'twitter'}
              href={CONTACT_TWITTER}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-twitter' />
            </a>
          )}
          {CONTACT_TELEGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              href={CONTACT_TELEGRAM}
              title={'telegram'}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-telegram' />
            </a>
          )}
          {CONTACT_LINKEDIN && (
            <a
              target='_blank'
              rel='noreferrer'
              href={CONTACT_LINKEDIN}
              title={'linkIn'}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-linkedin' />
            </a>
          )}
          {CONTACT_WEIBO && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'weibo'}
              href={CONTACT_WEIBO}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-weibo' />
            </a>
          )}
          {CONTACT_INSTAGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'instagram'}
              href={CONTACT_INSTAGRAM}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fab fa-instagram' />
            </a>
          )}
          {CONTACT_EMAIL && (
            <a
              onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
              title='email'
              className={`cursor-pointer ${iconWrapperCls}`}
              ref={emailIcon}>
              <i className='transform hover:scale-125 duration-150 fas fa-envelope' />
            </a>
          )}
          {ENABLE_RSS && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'RSS'}
              href={'/rss/feed.xml'}
              className={iconWrapperCls}>
              <i className='transform hover:scale-125 duration-150 fas fa-rss' />
            </a>
          )}
          {CONTACT_BILIBILI && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'bilibili'}
              href={CONTACT_BILIBILI}
              className={iconWrapperCls}>
              <i className='fab fa-bilibili transform hover:scale-125 duration-150' />
            </a>
          )}
          {CONTACT_YOUTUBE && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'youtube'}
              href={CONTACT_YOUTUBE}
              className={iconWrapperCls}>
              <i className='fab fa-youtube transform hover:scale-125 duration-150' />
            </a>
          )}
          <i
            onClick={toggleShow}
            className='transform hover:scale-125 duration-150 fas fa-close flex justify-center items-center w-10 h-10'
          />
        </>
      )}
    </div>
  )
}
export default SocialButton
