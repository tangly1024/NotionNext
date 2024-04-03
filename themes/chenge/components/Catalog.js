import { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import Progress from './Progress'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { InfoCard } from './InfoCard'
import LatestPostsGroup from './LatestPostsGroup'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { MenuListSide } from './MenuListSide'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc, props }) => {
  // 无目录就直接返回菜单目录
  if (!toc || toc.length < 1) {
    return <div className={`opacity-100 translate-y-0 transition-all duration-500 ease-out transform}`}>
      <InfoCard {...props} />
      <div className = "pt-4">
        <MenuListSide {...props} />
      </div>
    </div>
  }

  const { locale } = useGlobal()
  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  const [activeTab, setActiveTab] = useState('catalog'); // 默认激活文章目录Tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const { className, siteInfo } = props
  const router = useRouter()

  // 目录自动滚动
  const tRef = useRef(null)
  const tocIds = []

  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  const generateTocWithSerialNumbers = (toc) => {
    let h1Count = 0, h2Count = 0, h3Count = 0;
    const serialNumbers = {};
  
    toc.forEach((item, index) => {
      if (item.indentLevel === 0) {
        h1Count++;
        h2Count = 0; // Reset for new H1 section
        serialNumbers[item.id] = `${h1Count}.`;
      } else if (item.indentLevel === 1) {
        h2Count++;
        h3Count = 0; // Reset for new H2 section
        serialNumbers[item.id] = `${h1Count}.${h2Count}`;
      } else if (item.indentLevel === 2) {
        h3Count++;
        serialNumbers[item.id] = `${h1Count}.${h2Count}.${h3Count}`;
      }
      // Extend this logic for deeper levels if needed.
    });
  
    return toc.map(item => ({ ...item, serialNumber: serialNumbers[item.id] }));
  };

  const getSerialNumberFromId = (tocWithSerialNumbers, id) => {
    // 统一处理id格式，移除所有连字符
    if (id){
      const normalizedId = id.replace(/-/g, '');
      const tocItem = tocWithSerialNumbers.find(item => item.id.replace(/-/g, '') === normalizedId);
      return tocItem ? tocItem.serialNumber : '0';
    }else{
      return '0'
    }

  };  

  const throttleMs = 200
  const actionSectionScrollSpy = useCallback(throttle(() => {
    const sections = document.getElementsByClassName('notion-h')
    let prevBBox = null
    let currentSectionId = activeSection
    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i]
      if (!section || !(section instanceof Element)) continue
      if (!currentSectionId) {
        currentSectionId = section.getAttribute('data-id')
      }
      const bbox = section.getBoundingClientRect()
      const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
      const offset = Math.max(150, prevHeight / 4)
      // GetBoundingClientRect returns values relative to viewport
      if (bbox.top - offset < 0) {
        currentSectionId = section.getAttribute('data-id')
        prevBBox = bbox
        continue
      }
      // No need to continue loop, if last element has been detected
      break
    }
    setActiveSection(currentSectionId)
    const index = tocIds.indexOf(currentSectionId) || 0
    tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
  }, throttleMs))

  const tocWithSerialNumbers = generateTocWithSerialNumbers(toc);

  return (
    // <Card className="relative">
    <>
      <div className="flex justify-center items-center pb-6 space-x-4">
        <div
          className={`cursor-pointer px-4 py-2 text-sm rounded-lg text-gray-600 bg-gray-200 transition duration-200 ease-out ${
            activeTab === 'catalog' ? 'bg-tab text-white shadow-lg' : ''
          }`}
          onClick={() => handleTabClick('catalog')}
        >
          <i className="iconfont icon-list-ol"></i>
          {activeTab === 'catalog' && <span className="pl-1">文章目录</span>}
        </div>
        <div
          className={`cursor-pointer px-4 py-2 text-sm rounded-lg text-gray-600 bg-gray-200 transition duration-200 ease-out ${
            activeTab === 'infoCard' ? 'bg-tab text-white shadow-lg' : ''
          }`}
          onClick={() => handleTabClick('infoCard')}
        >
          <i className="iconfont icon-home" ></i>
          {activeTab === 'infoCard' && <span className="pl-1">站点概览</span>}
        </div>
      </div>
      <div className={`${activeTab === 'infoCard' ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out transform' : 'opacity-0 translate-y-10 max-h-0'}`}>
        <InfoCard {...props} />
        {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) && <div className="space-y-4 lg:w-60 pt-4 ${post ? 'lg:pt-0' : 'lg:pt-4'}"><LatestPostsGroup {...props} /></div>}
      </div>
      <div className={`${activeTab === 'catalog' ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out transform ' : 'opacity-0 translate-y-10 max-h-0'} `}>
        <div className='px-3 py-1'>
          <div className='w-full text-hexo-front mb-2'><i className='mr-1 fas fa-stream' />{locale.COMMON.TABLE_OF_CONTENTS}</div>
          <div ref={tRef} className={`overflow-y-auto ${activeTab === 'catalog' ? 'h-[70vh]' : 'h-0'} overscroll-none scroll-hidden`}>
            <nav className='h-full  text-black'>
              {tocWithSerialNumbers.map((tocItem) => {
                const activeSerialNumber = getSerialNumberFromId(tocWithSerialNumbers, activeSection);
  
                // 判断是否应该显示这个目录项
                const shouldShow = tocItem.indentLevel === 0 || tocItem.serialNumber.startsWith(activeSerialNumber.charAt(0));

                // if (!shouldShow) {
                //   return null; // 或者根据你的逻辑决定怎么处理不显示的情况
                // }

                const id = uuidToId(tocItem.id)
                tocIds.push(id)

                // 使用 Tailwind 的动画类，只有进入动画
                const animationClass = shouldShow ? 'opacity-100' : 'opacity-0 max-h-0';
                const transitionClass = 'transition-all ease-in-out duration-250';

                return (
                  <div
                    key={id}
                    className={`${animationClass} ${transitionClass} transform`}
                  >
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-200
                    notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
                    >
                      <span style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
                        className={`${(activeSection === id || (tocItem.indentLevel === 0 && tocItem.serialNumber.startsWith(activeSerialNumber.charAt(0)))) && ' font-bold text-hexo-primary'}`}
                      >
                      {tocItem.serialNumber} {tocItem.text}
                      </span>
                    </a>
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
    // </Card>    
  )
}

export default Catalog
