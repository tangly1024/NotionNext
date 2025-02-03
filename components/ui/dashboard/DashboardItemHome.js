/**
 * 首页组件
 * @returns
 */
export default function DashboardItemHome() {
  return (
    <div className='w-full mx-auto'>
      {/* 提示消息 */}
      <div
        className='p-4 mb-4 text-xl font-bold text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400'
        role='alert'>
        <span className='font-medium'>注意!</span>{' '}
        整个后台都只是页面效果，仅供演示查看，没有对接实际功能。
      </div>

      {/* 页面说明 */}
      <div className='mb-8 text-lg text-gray-700 dark:text-gray-300'>
        <p>
          欢迎来到用户中心页面！在这里，您可以查看用户的账号信息与业务订单概况。
        </p>
      </div>

      {/* 进度条 */}
      <div className='mb-8'>
        <h3 className='text-xl text-gray-800 dark:text-white'>当前任务进度</h3>
        <div className='bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-2'>
          <div
            className='bg-green-500 h-2.5 rounded-full'
            style={{ width: '75%' }}></div>
        </div>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          任务进度：75%
        </p>
      </div>

      {/* 背景动画块 */}
      <div className='relative w-full h-64 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden'>
        <div className='absolute inset-0 w-full h-full animate-pulse bg-black opacity-50'></div>
        <div className='relative z-10 text-center text-white font-bold pt-24'>
          <h3 className='text-2xl'>实时数据分析</h3>
          <p className='text-lg'>监控您的系统数据，查看实时变化</p>
        </div>
      </div>

      {/* 数据卡片模块 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition-all transform duration-300'>
          <h3 className='text-xl text-gray-800 dark:text-white'>今日访问量</h3>
          <p className='text-3xl text-green-600'>1,245</p>
        </div>
        <div className='bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition-all transform duration-300'>
          <h3 className='text-xl text-gray-800 dark:text-white'>用户总数</h3>
          <p className='text-3xl text-blue-600'>12,300</p>
        </div>
        <div className='bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition-all transform duration-300'>
          <h3 className='text-xl text-gray-800 dark:text-white'>
            系统健康状态
          </h3>
          <p className='text-3xl text-red-600'>正常</p>
        </div>
      </div>
    </div>
  )
}
