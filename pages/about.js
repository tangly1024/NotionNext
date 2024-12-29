import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import BLOG from '@/blog.config'
import CONFIG from '@/themes/heo/config'
import { useState, useEffect, useRef } from 'react'
import { TIMELINE_CONFIG } from '@/lib/timeline.config'
import Script from 'next/script'

/**
 * 关于页面
 */
const About = props => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [visitStats, setVisitStats] = useState({
    pv: 0,
    uv: 0,
    todayPv: 0,
    todayUv: 0
  })

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [location, setLocation] = useState({
    city: '南京市',
    district: '江宁区',
    province: '江苏省',
    coords: [118.7969, 32.0603]
  })
  const [locating, setLocating] = useState(false)

  // 每2秒切换一次文字
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % CONFIG.HEO_MOTTO_WORDS.length)
        setIsAnimating(false)
      }, 500)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  // 获取地理位置信息
  const getLocation = async () => {
    if (!window.AMap) return

    try {
      setLocating(true)

      return new Promise((resolve, reject) => {
        window.AMap.plugin('AMap.Geolocation', () => {
          const geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            buttonPosition: 'RB',
            buttonOffset: new window.AMap.Pixel(10, 20),
            zoomToAccuracy: true
          })

          geolocation.getCurrentPosition((status, result) => {
            if (status === 'complete') {
              resolve({
                city: result.addressComponent.city,
                district: result.addressComponent.district,
                province: result.addressComponent.province,
                coords: [result.position.lng, result.position.lat]
              })
            } else {
              reject(new Error('定位失败'))
            }
          })
        })
      })
    } catch (error) {
      console.error('Location error:', error)
      return null
    } finally {
      setLocating(false)
    }
  }

  // 地图初始化函数
  const initMap = async () => {
    if (!window.AMap || !mapRef.current || mapInstance.current) return

    try {
      // 尝试获取位置
      const locationInfo = await getLocation()
      if (locationInfo) {
        setLocation(locationInfo)
      }

      // 创建地图实例
      mapInstance.current = new window.AMap.Map(mapRef.current, {
        zoom: 11,
        center: locationInfo?.coords || location.coords,
        mapStyle: 'amap://styles/dark',
        viewMode: '3D',
        pitch: 35,
        skyColor: '#1c1c1c',
        resizeEnable: true,
        preloadMode: true,
        features: ['bg', 'road', 'building'],
        defaultCursor: 'default'
      })

      // 使用 Promise 处理地图加载
      mapInstance.current.on('complete', () => {
        setMapLoaded(true)

        // 添加标记和动画
        const marker = new window.AMap.Marker({
          position: locationInfo?.coords || location.coords,
          anchor: 'bottom-center',
          offset: new window.AMap.Pixel(0, 0)
        })

        const circle = new window.AMap.Circle({
          center: locationInfo?.coords || location.coords,
          radius: 500,
          fillColor: '#1890ff',
          fillOpacity: 0.3,
          strokeWeight: 0
        })

        mapInstance.current.add([marker, circle])

        // 添加动画效果
        let scale = 1
        const animate = setInterval(() => {
          scale = scale === 1 ? 1.5 : 1
          circle.setOptions({
            radius: 500 * scale
          })
        }, 1000)

        mapInstance.current.animateTimer = animate
      })

    } catch (error) {
      console.error('Map initialization error:', error)
    }
  }

  // 客户端渲染检测
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 地图初始化和清理
  useEffect(() => {
    if (!isClient) return

    // 如果已经加载了 AMap，直接初始化
    if (window.AMap) {
      initMap()
    }

    return () => {
      if (mapInstance.current) {
        // 清理动画
        clearInterval(mapInstance.current.animateTimer)
        // 销毁地图实例
        mapInstance.current.destroy()
        mapInstance.current = null
      }
    }
  }, [isClient])

  // 获取第2-5个技能标签
  const tags = CONFIG.HEO_INFOCARD_GREETINGS.slice(1, 5)
  // 将标签分为左右两组
  const leftTags = tags.slice(0, 2)  // 取前两个标签
  const rightTags = tags.slice(2)    // 取后两个标签

  // 标签背景色数组
  const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-indigo-500']

  // 计算时间线进度的函数 - 精确到日
  const calculateProgress = (startDate, endDate) => {
    // 获取当前日期并重置时间为00:00:00
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 重置开始和结束日期的时间为00:00:00
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // 如果还未开始，返回0
    if (now < start) return 0;
    // 如果已经结束，返回100
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.round((current / total) * 10000) / 100; // 保留两位小数
  };

  // 格式化进度显示
  const formatProgress = (progress) => {
    return `${progress.toFixed(1)}%`;
  };

  // 格式化日期显示 - 只显示到月
  const formatDate = (year, month) => {
    return `${year}.${month.toString().padStart(2, '0')}`;
  };

  // 使用 state 存储进度
  const [progresses, setProgresses] = useState({});

  // 计算下一个凌晨的时间
  const getNextMidnight = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  // 每天凌晨更新进度
  useEffect(() => {
    const updateProgresses = () => {
      const newProgresses = {};
      TIMELINE_CONFIG.timelines.forEach(timeline => {
        newProgresses[timeline.period] = calculateProgress(
          timeline.startDate,
          timeline.endDate
        );
      });
      setProgresses(newProgresses);
    };

    // 初始更新
    updateProgresses();

    // 计算到下一个凌晨的延迟时间
    const now = new Date();
    const nextMidnight = getNextMidnight();
    const delay = nextMidnight.getTime() - now.getTime();

    // 设置定时器在下一个凌晨触发
    const timeout = setTimeout(() => {
      updateProgresses();
      // 设置每24小时更新一次的间隔
      const interval = setInterval(updateProgresses, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // 获取今天的日期（格式：YYYY-MM-DD）
    const getToday = () => {
      const date = new Date()
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    // 从localStorage获取上一次的统计数据
    const getLastStats = () => {
      try {
        const saved = localStorage.getItem('visitStats')
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to parse saved stats:', e)
      }
      return null
    }

    // 保存当前统计数据到localStorage
    const saveCurrentStats = (stats) => {
      try {
        localStorage.setItem('visitStats', JSON.stringify({
          date: getToday(),
          pv: stats.pv,
          uv: stats.uv
        }))
      } catch (e) {
        console.error('Failed to save stats:', e)
      }
    }

    // 计算今日统计数据
    const calculateTodayStats = (currentStats, lastStats) => {
      if (!lastStats || lastStats.date !== getToday()) {
        // 如果没有上次数据，或者不是今天的数据，今日数据设为当前值
        return {
          todayPv: currentStats.pv,
          todayUv: currentStats.uv
        }
      }
      // 计算今日增量
      return {
        todayPv: Math.max(0, currentStats.pv - lastStats.pv),
        todayUv: Math.max(0, currentStats.uv - lastStats.uv)
      }
    }

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
          const currentStats = {
            pv: parseInt(pvElement.textContent) || 0,
            uv: parseInt(uvElement.textContent) || 0
          }

          const lastStats = getLastStats()
          const todayStats = calculateTodayStats(currentStats, lastStats)

          setVisitStats({
            ...currentStats,
            ...todayStats
          })

          // 保存当前统计数据
          saveCurrentStats(currentStats)

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
    <div className="flex justify-center w-full min-h-screen">
      <div className="max-w-[1200px] w-full px-5 relative">
        <div className="py-10">
          {/* 头像和技能标签区 */}
          <div className="flex justify-center items-center gap-6 mb-12">
            {/* 左侧标签 */}
            <div className="flex flex-col gap-3">
              {leftTags.map((tag, index) => (
                <div
                  key={`left-${index}`}
                  className={`${bgColors[index]} text-white px-4 py-2 rounded-full text-sm shadow-md hover:scale-105 transition-transform duration-200 animate-float-delay-${index + 1}`}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* 头像 */}
            <div>
              <img
                src="/images/touxiang.png"
                alt="avatar"
                className="w-[180px] h-[180px] rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* 右侧标签 */}
            <div className="flex flex-col gap-3">
              {rightTags.map((tag, index) => (
                <div
                  key={`right-${index}`}
                  className={`${bgColors[index + 2]} text-white px-4 py-2 rounded-full text-sm shadow-md hover:scale-105 transition-transform duration-200 animate-float-delay-${index + 3}`}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* 标题和描述 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">关于我</h1>
            <p className="text-gray-600 dark:text-gray-300">
              生活明朗，万物可爱✨
            </p>
          </div>

          {/* 个人介绍卡片区域 - 两列布局 */}
          <div className="grid grid-cols-2 gap-6 mb-8 w-full">
            {/* 左侧介绍卡片 */}
            <div className="bg-gradient-to-br from-[#4B6EFF] via-[#45B4FF] to-[#4B6EFF] text-white rounded-2xl p-8 shadow-lg transform hover:scale-[1.01] transition-all duration-200 hover:shadow-xl h-[200px]">
              <div className="flex items-center mb-4">
                <span className="text-xl">👋</span>
                <p className="ml-2 text-lg">你好，很高兴认识你</p>
              </div>
              <h2 className="text-3xl font-bold mb-3">我叫 {BLOG.AUTHOR}</h2>
              <p className="text-lg opacity-90">是一名 测试开发工程师、Java、独立开发者</p>
            </div>

            {/* 右侧标签卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden h-[200px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl transform rotate-45"></div>
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">追求</h3>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 block mb-0.5">源于</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">热爱而去</span>
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">感受</span>
                    </div>
                  </div>
                  <div className="h-14 flex items-center">
                    <div
                      className={`text-4xl font-bold text-[#ff6b6b] flex items-center gap-2 ${isAnimating ? 'animate-word-change' : ''
                        }`}
                    >
                      <span>{CONFIG.HEO_MOTTO_WORDS[currentWordIndex]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 技能特长和生涯进度区域 */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* 左侧技能特长卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg overflow-hidden">
              <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">技能</div>
                <div className="text-2xl font-bold dark:text-white">开启创造力</div>
              </div>

              {/* 横向滚动的技能图标流容器 */}
              <div className="relative h-[280px]">
                <div className="skill-scroll-container overflow-hidden h-full">
                  <div className="skill-scroll-wrapper flex flex-col gap-4 h-full">
                    {/* 第一排图标 */}
                    <div className="flex gap-8 animate-scroll">
                      {[...Array(3)].map((_, groupIndex) => (
                        <div key={`group-1-${groupIndex}`} className="flex gap-8">
                          {[
                            {
                              icon: '/icons/git.png',
                              name: 'Git',
                              bg: 'linear-gradient(120deg, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)'
                            },
                            {
                              icon: '/icons/python.png',
                              name: 'Python',
                              bg: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                            },
                            {
                              icon: '/icons/docker.png',
                              name: 'Docker',
                              bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            },
                            {
                              icon: '/icons/hive.png',
                              name: 'Hive',
                              bg: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
                            },
                            {
                              icon: '/icons/rabbit.png',
                              name: 'RabbitMQ',
                              bg: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)'
                            }
                          ].map((skill, index) => (
                            <div
                              key={`first-${groupIndex}-${index}`}
                              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                              style={{ background: skill.bg }}
                            >
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                title={skill.name}
                                className="w-14 h-14 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* 第二排图标 */}
                    <div className="flex gap-8 animate-scroll-reverse">
                      {[...Array(3)].map((_, groupIndex) => (
                        <div key={`group-2-${groupIndex}`} className="flex gap-8">
                          {[
                            {
                              icon: '/icons/scala.png',
                              name: 'Scala',
                              bg: 'linear-gradient(to right, #ff6e7f 0%, #bfe9ff 100%)'
                            },
                            {
                              icon: '/icons/sql.png',
                              name: 'SQL',
                              bg: 'linear-gradient(to right, #434343 0%, #000000 100%)'
                            },
                            {
                              icon: '/icons/hadoop.png',
                              name: 'Hadoop',
                              bg: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
                            },
                            {
                              icon: '/icons/markdown.png',
                              name: 'Markdown',
                              bg: 'linear-gradient(to right, #243949 0%, #517fa4 100%)'
                            },
                            {
                              icon: '/icons/redis.png',
                              name: 'Redis',
                              bg: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)'
                            }
                          ].map((skill, index) => (
                            <div
                              key={`second-${groupIndex}-${index}`}
                              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                              style={{ background: skill.bg }}
                            >
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                title={skill.name}
                                className="w-14 h-14 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧生涯进度卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">生涯</div>
                <div className="text-2xl font-bold dark:text-white">无限进步</div>
              </div>

              <div className="space-y-8">
                {TIMELINE_CONFIG.timelines.map((timeline, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {timeline.period}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {formatProgress(progresses[timeline.period] || 0)}
                      </span>
                    </div>

                    {/* 进度条 */}
                    <div className="relative w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-in-out progress-bar-animation progress-update"
                        style={{ width: `${progresses[timeline.period]}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                      </div>
                    </div>

                    {/* 时间线标记 */}
                    <div className="relative h-24 mt-2">
                      <div className="absolute w-full h-0.5 bg-gray-200 dark:bg-gray-700 top-3"></div>
                      {timeline.milestones.map((milestone, mIndex, array) => {
                        if (!milestone.date) {
                          console.error('Missing date for milestone:', milestone);
                          return null;
                        }

                        try {
                          // 处理日期格式
                          let position;
                          let displayDate;

                          if (milestone.type === 0) {
                            // 进行中的里程碑 - 使用单一日期
                            const [year, month] = milestone.date.split('-');
                            const milestoneDate = new Date(milestone.date);
                            const startDate = new Date(timeline.startDate);
                            const endDate = new Date(timeline.endDate);

                            position = ((milestoneDate - startDate) / (endDate - startDate)) * 100;
                            displayDate = formatDate(year, month);
                          } else {
                            // 已完成的里程碑 - 可能包含日期范围
                            const dates = milestone.date.split('至');
                            const startDate = new Date(timeline.startDate);
                            const endDate = new Date(timeline.endDate);
                            const milestoneDate = new Date(dates[0]); // 使用开始日期作为位置参考

                            position = ((milestoneDate - startDate) / (endDate - startDate)) * 100;
                            displayDate = milestone.date; // 保存完整日期范围用于悬浮显示
                          }

                          // 根据类型决定样式
                          const dotColorClass = milestone.type === 0
                            ? 'bg-yellow-400 ring-4 ring-yellow-100 dark:ring-yellow-900/30'
                            : 'bg-blue-500';

                          const labelColorClass = milestone.type === 0
                            ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                            : 'text-gray-500 dark:text-gray-400';

                          return (
                            <div
                              key={mIndex}
                              className="absolute transform -translate-x-1/2 top-0 group"
                              style={{
                                left: `${position}%`,
                                zIndex: milestone.type === 0 ? 10 : mIndex
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <div className="relative">
                                  <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass} mb-1 transition-all duration-300
                                    ${milestone.type === 0 ? 'animate-pulse scale-110' : ''}`}
                                  ></div>

                                  {/* 悬浮提示 - 仅对已完成的里程碑显示 */}
                                  {milestone.type === 1 && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs rounded-lg py-3 px-4 shadow-xl border border-gray-700/50 backdrop-blur-sm min-w-[240px]">
                                        {/* 日期 */}
                                        <div className="flex items-center justify-between gap-4 w-full">
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className="w-3 h-3">
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
                                              </svg>
                                            </div>
                                            <span className="font-medium text-gray-300">完成时间</span>
                                          </div>
                                          <span className="font-semibold text-sm text-white">{displayDate}</span>
                                        </div>

                                        {/* 装饰元素 */}
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>

                                        {/* 尾部箭头 */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                          <div className="w-2 h-2 bg-gray-900 rotate-45 transform origin-center"></div>
                                        </div>

                                        {/* 模糊光晕效果 */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg filter blur opacity-50"></div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* 日期和标签 */}
                                <div className="flex flex-col items-center">
                                  {/* 只为进行中的里程碑显示日期 */}
                                  {milestone.type === 0 && (
                                    <span className={`text-xs ${labelColorClass} whitespace-nowrap`}>
                                      {displayDate}
                                    </span>
                                  )}
                                  <span className={`text-xs mt-0.5 whitespace-nowrap
                                    ${milestone.type === 0 ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}
                                  >
                                    {milestone.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.error('Error processing milestone:', milestone, error);
                          return null;
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 访问统计和地理位置区域 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 访问统计卡片 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden group transition-all duration-300">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10 transition-colors duration-300"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-500/10 dark:to-purple-500/10 blur-2xl transform rotate-45 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-blue-100/50 dark:from-green-500/10 dark:to-blue-500/10 blur-2xl transform -rotate-45 transition-colors duration-300"></div>

              {/* 内容区域 */}
              <div className="relative z-10">
                {/* 标题区域 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/80 dark:bg-blue-500/10 rounded-xl">
                      <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21H7C5.89543 21 5 20.1046 5 19V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M17 7L21 3L17 7ZM21 3L17 3L21 3ZM21 3V7V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">访问统计</h3>
                  </div>

                  {/* 装饰动画 */}
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                    <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                {/* 统计数据网格 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 今日人数 */}
                  <div className="group/card bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-lg rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100/20 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none">
                          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">今日人数</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-xl font-bold text-blue-500 dark:text-blue-400">{visitStats.todayUv}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">访客</div>
                    </div>
                  </div>

                  {/* 今日访问 */}
                  <div className="group/card bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-lg rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100/20 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 dark:bg-green-500/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none">
                          <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">今日访问</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-xl font-bold text-green-500 dark:text-green-400">{visitStats.todayPv}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">次数</div>
                    </div>
                  </div>

                  {/* 总访问人数 */}
                  <div className="group/card bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-lg rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100/20 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="none">
                          <path d="M17 20H7C5.89543 20 5 19.1046 5 18V9L12 4L19 9V18C19 19.1046 18.1046 20 17 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">总访问人数</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-xl font-bold text-purple-500 dark:text-purple-400">{visitStats.uv}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">访客</div>
                    </div>
                  </div>

                  {/* 总访问量 */}
                  <div className="group/card bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-lg rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100/20 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-pink-100 dark:bg-pink-500/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">总访问量</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-xl font-bold text-pink-500 dark:text-pink-400">{visitStats.pv}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">次数</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 隐藏的不蒜子统计元素 */}
              <div style={{ display: 'none' }}>
                <span className="busuanzi_container_site_pv">
                  <span className="busuanzi_value_site_pv"></span>
                </span>
                <span className="busuanzi_container_site_uv">
                  <span className="busuanzi_value_site_uv"></span>
                </span>
              </div>
            </div>

            {/* 地理位置和个人信息区域 */}
            <div className="space-y-6">
              {/* 地理位置卡片 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10 transition-colors duration-300"></div>

                {/* 内容区域 */}
                <div className="relative z-10">
                  {/* 地图容器 */}
                  <div className="w-full h-28 rounded-xl overflow-hidden mb-3 relative bg-gray-100 dark:bg-gray-800">
                    <div
                      ref={mapRef}
                      className="w-full h-full"
                      style={{
                        background: '#1c1c1c',
                        opacity: mapLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    ></div>

                    {/* 地图控制按钮 */}
                    {mapLoaded && (
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => window.open('https://uri.amap.com/marker?position=118.7969,32.0603', '_blank')}
                        >
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* 加载状态 */}
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>

                  {/* 位置信息 */}
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-base">我现在住在中国 {location.province} {location.city} {location.district}</span>
                  </div>
                </div>
              </div>

              {/* 个人信息卡片 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/50 dark:from-green-500/10 dark:via-blue-500/5 dark:to-purple-500/10 transition-colors duration-300"></div>

                {/* 内容区域 */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    {/* 出生年份 */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">生于</div>
                      <div className="text-lg font-bold text-blue-500 dark:text-blue-400">2002-02-26</div>
                    </div>

                    {/* 毕业院校 */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">毕业于</div>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-500">
                        南京信息工程大学
                        <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          计算机科学与技术
                        </div>
                      </div>
                    </div>

                    {/* 当前职业 */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">现在职业</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        测试开发工程师
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 添加动画关键帧样式 */}
      <style jsx global>{`
        @keyframes word-change {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          20% {
            transform: translateY(-20px);
            opacity: 0;
          }
          40% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-word-change {
          animation: word-change 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.05);
          }
        }

        .animate-float-delay-0 { animation: float 3s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float 3s ease-in-out infinite 0.2s; }
        .animate-float-delay-2 { animation: float 3s ease-in-out infinite 0.4s; }
        .animate-float-delay-3 { animation: float 3s ease-in-out infinite 0.6s; }
        .animate-float-delay-4 { animation: float 3s ease-in-out infinite 0.8s; }
        .animate-float-delay-5 { animation: float 3s ease-in-out infinite 1.0s; }
        .animate-float-delay-6 { animation: float 3s ease-in-out infinite 1.2s; }
        .animate-float-delay-7 { animation: float 3s ease-in-out infinite 1.4s; }
        .animate-float-delay-8 { animation: float 3s ease-in-out infinite 1.6s; }
        .animate-float-delay-9 { animation: float 3s ease-in-out infinite 1.8s; }

        @keyframes scroll {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(calc(-200% / 3));
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(calc(-200% / 3));
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
          display: flex;
          width: fit-content;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 15s linear infinite;
          display: flex;
          width: fit-content;
        }

        .skill-scroll-container {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 15%,
            black 85%,
            transparent
          );
        }

        .skill-scroll-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @keyframes scroll {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(calc(-200% / 3));
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(calc(-200% / 3));
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
          display: flex;
          width: fit-content;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 15s linear infinite;
          display: flex;
          width: fit-content;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .progress-bar-animation {
          position: relative;
        }

        .progress-bar-animation::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: progress-animation 1.5s linear infinite;
        }

        @keyframes progress-animation {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .progress-update {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .milestone-enter {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* 悬浮框显示动画 */
        @keyframes tooltipEnter {
          0% {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        /* 光晕动画 */
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* 应用动画 */
        .group-hover\:block {
          animation: tooltipEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        /* 悬浮框阴影效果 */
        .shadow-xl {
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.2),
                      0 0 15px -3px rgba(0, 0, 0, 0.1),
                      0 0 30px -5px rgba(59, 130, 246, 0.1);
        }

        /* 背景模糊效果 */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* 装饰元素动画 */
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* 确保文本不会换行 */
        .whitespace-nowrap {
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'about-page' })
  return {
    props,
    revalidate: parseInt(siteConfig('NEXT_REVALIDATE_SECOND'))
  }
}

export default About