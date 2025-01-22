import Link from 'next/link'

/**
 * 联盟行销
 * @returns
 */
export default function DashboardItemAffliate() {
  const cards = [
    {
      title: '￥0.00',
      desc: '累计佣金',
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      title: '￥0.00',
      desc: '已提现',
      className: 'bg-cyan-600 hover:bg-cyan-700 text-white'
    },
    {
      title: '￥0.00',
      desc: '提现中',
      className: 'bg-pink-600 hover:bg-pink-700 text-white'
    },
    {
      title: '￥0.00',
      desc: '可提现',
      className: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    }
  ]

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 border'>
      <div className='grid grid-cols-4 gap-4'>
        {cards?.map((card, index) => (
          <div
            key={index}
            className={`block max-w-sm p-6 text-center border cursor-pointer rounded-lg shadow ${card.className}`}>
            <h5 className='mb-2 text-2xl font-bold tracking-tight'>
              {card.title}
            </h5>
            <p className='font-normal'>{card.desc}</p>
          </div>
        ))}
      </div>
      <form className='mt-6'>
        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div>
            <label
              for='last_name'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              推广总数
            </label>
            <input
              disabled
              type='text'
              id='last_name'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='123'
              required
            />
          </div>
          <div>
            <label
              for='company'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              推广链接
            </label>
            <input
              disabled
              type='text'
              id='company'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='https://tangly1024.com'
              required
            />
          </div>

          <div>
            <label
              for='website'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              推广佣金提成
            </label>
            <input
              disabled
              type='url'
              id='website'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='5%'
              required
            />
          </div>
        </div>

        <hr className='my-6' />

        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div>
            <label
              for='first_name'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              提现账号
            </label>
            <input
              type='text'
              id='first_name'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='John'
              required
            />
          </div>

          <div>
            <label
              for='visitors'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              提现金额
            </label>
            <input
              type='number'
              id='visitors'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder=''
              required
            />
          </div>
        </div>

        <div className='flex items-start mb-6'>
          <div className='flex items-center h-5'>
            <input
              id='remember'
              type='checkbox'
              value=''
              className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800'
              required
            />
          </div>
          <label
            for='remember'
            className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            我以阅读并同意{' '}
            <Link
              href='/terms-of-use'
              className='text-blue-600 hover:underline dark:text-blue-500'>
              服务协议
            </Link>
            .
          </label>
        </div>
        <div className='flex gap-x-2'>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            提现RMB
          </button>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            提现到余额
          </button>
        </div>

        <ul className='text-gray-600 list-disc pl-6'>
          <li>推广说明：</li>
          <li className='font-bold'>这只是一个演示页面，不存在真实功能！</li>
          <li>
            如需提现请联系网站管理员，发送您的账号信息和收款码进行人工提现
          </li>
          <li>
            如果用户是通过您的推广链接购买的资源或者开通会员，则按照推广佣金比列奖励到您的佣金中
          </li>
          <li>
            如果用户是通过您的链接新注册的用户，推荐人是您，该用户购买资都会给你佣金
          </li>
          <li>
            如果用户是你的下级，用户使用其他推荐人链接购买，以上下级关系为准，优先给注册推荐人而不是推荐链接
          </li>
          <li>推广奖励金额保留一位小数点四舍五入。0.1之类的奖励金额不计算</li>
          <li>
            前台无法查看推广订单详情，如需查看详情可联系管理员截图查看详细记录和时间
          </li>
        </ul>
      </form>
    </div>
  )
}
