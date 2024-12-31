import { useMemo, useState } from 'react'

const GitHubContributionCard = ({ posts }) => {
  // 获取可用的年份列表
  const availableYears = useMemo(() => {
    if (!posts || posts.length === 0) return [new Date().getFullYear()]
    const years = new Set()
    posts.forEach(post => {
      const date = new Date(post.updateDate || post.date)
      years.add(date.getFullYear())
    })
    return Array.from(years).sort((a, b) => b - a) // 降序排列
  }, [posts])

  // 当前选中的年份
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // 日期格式化函数
  const formatDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  // 生成基于文章更新的贡献数据
  const generateContributionData = (year) => {
    const data = []
    const startDate = new Date(year, 0, 1) // 该年1月1日
    const endDate = new Date(year, 11, 31, 23, 59, 59) // 该年12月31日
    const now = new Date()

    // 如果是当前年份，使用当前日期作为结束日期
    const actualEndDate = year === now.getFullYear() ? now : endDate

    // 初始化该年的数据，默认贡献为0
    for (let d = new Date(startDate); d <= actualEndDate; d.setDate(d.getDate() + 1)) {
      data.push({
        date: new Date(d),
        count: 0,
        posts: [] // 存储当天的文章列表
      })
    }

    // 统计文章更新的贡献
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        // 使用 updateDate 或 date，并格式化为当地时间的日期（不含时间）
        const updateDate = formatDate(new Date(post.updateDate || post.date))
        const formattedStartDate = formatDate(startDate)
        const formattedEndDate = formatDate(actualEndDate)

        // 只统计选中年份的更新
        if (updateDate >= formattedStartDate && updateDate <= formattedEndDate) {
          const daysDiff = Math.floor((updateDate - formattedStartDate) / (24 * 60 * 60 * 1000))
          if (daysDiff >= 0 && daysDiff < data.length) {
            data[daysDiff].count += 1
            data[daysDiff].posts.push(post) // 记录文章信息
          }
        }
      })
    }

    return data
  }

  // 使用 useMemo 缓存贡献数据
  const contributionData = useMemo(() => generateContributionData(selectedYear), [posts, selectedYear])

  // 获取总贡献数
  const totalContributions = useMemo(() => {
    return contributionData.reduce((sum, day) => sum + day.count, 0)
  }, [contributionData])

  // 切换到上一年
  const handlePrevYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1])
    }
  }

  // 切换到下一年
  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1])
    }
  }

  // 获取贡献等级的样式
  const getContributionClass = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count === 1) return 'bg-emerald-100 dark:bg-emerald-900/60'
    if (count === 2) return 'bg-emerald-300 dark:bg-emerald-700'
    if (count === 3) return 'bg-emerald-400 dark:bg-emerald-600'
    return 'bg-emerald-500 dark:bg-emerald-500'
  }

  // 获取月份标签
  const getMonthLabels = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    return months
  }

  // 格式化提示文本
  const formatTooltip = (contribution) => {
    if (!contribution) return '没有更新'
    const date = contribution.date.toLocaleDateString('zh-CN')
    const count = contribution.count
    const postTitles = contribution.posts.map(post => post.title).join('、')
    return `${date} 更新了 ${count} 篇文章${count > 0 ? `：${postTitles}` : ''}`
  }

  return (
    <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden transform hover:scale-[1.01] transition-all duration-200">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 dark:from-emerald-500/10 dark:via-green-500/5 dark:to-teal-500/10 transition-colors duration-300"></div>

      {/* 装饰图案 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-green-500/20 blur-3xl transform rotate-45"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 blur-3xl transform -rotate-45"></div>

      {/* 标题区域 */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-history text-xl text-emerald-500 dark:text-emerald-400"></i>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">文章更新频率</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevYear}
              disabled={availableYears.indexOf(selectedYear) === availableYears.length - 1}
              className="p-1 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[4rem] text-center">
              {selectedYear} 年
            </span>
            <button
              onClick={handleNextYear}
              disabled={availableYears.indexOf(selectedYear) === 0}
              className="p-1 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <span className="px-2 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            共更新 {totalContributions} 篇
          </span>
        </div>
      </div>

      {/* 贡献图表 */}
      <div className="relative z-10">
        {/* 月份标签 */}
        <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
          {getMonthLabels().map((month, index) => (
            <span key={index} className="font-medium">{month}</span>
          ))}
        </div>

        {/* 星期标签和贡献格子 */}
        <div className="flex gap-2">
          {/* 星期标签 */}
          <div className="flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-1">
            <span>一</span>
            <span>三</span>
            <span>五</span>
          </div>

          {/* 贡献格子 */}
          <div className="grid grid-cols-52 gap-1 flex-grow">
            {Array.from({ length: 52 }).map((_, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dataIndex = weekIndex * 7 + dayIndex
                  const contribution = contributionData[dataIndex]
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${contribution ? getContributionClass(contribution.count) : 'bg-gray-100 dark:bg-gray-800'} transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-emerald-300 dark:hover:ring-emerald-600 cursor-pointer group`}
                      title={formatTooltip(contribution)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>较少</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionClass(level)} transition-transform hover:scale-110`}
              />
            ))}
          </div>
          <span>较多</span>
        </div>
      </div>

      <style jsx>{`
        .grid-cols-52 {
          grid-template-columns: repeat(52, minmax(0, 1fr));
        }
      `}</style>
    </div>
  )
}

export default GitHubContributionCard 