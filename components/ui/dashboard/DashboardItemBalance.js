import { useEffect, useState } from 'react'

/**
 * 余额
 * @returns
 */
export default function DashboardItemBalance() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [amount, setAmount] = useState(0)

  const cards = [
    {
      title: '0 积分',
      desc: '当前余额',
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      title: '0 积分',
      desc: '累计消费',
      className: 'bg-cyan-600 hover:bg-cyan-700 text-white'
    },
    {
      title: '0',
      desc: '累计佣金',
      className: 'bg-pink-600 hover:bg-pink-700 text-white'
    }
  ]

  const cardData = [
    { points: '1积分', price: '￥1' },
    { points: '10积分', price: '￥10' },
    { points: '50积分', price: '￥50' },
    { points: '100积分', price: '￥100' },
    { points: '300积分', price: '￥300' },
    { points: '500积分', price: '￥500' }
  ]

  const handleCardSelect = index => {
    setSelectedCard(index)
  }

  const handleAmountChange = e => {
    const value = e.target.value
    setAmount(value)
  }

  useEffect(() => {
    if (selectedCard !== null) {
      // 如果用户选中了充值卡片，则自动更新支付金额
      const selectedPrice = cardData[selectedCard]?.price
      if (selectedPrice) {
        setAmount(selectedPrice.replace('￥', ''))
      }
    }
  }, [selectedCard])

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 border'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>余额充值中心</h2>
        <hr className='my-2' />
      </div>

      {/* 余额卡片 */}
      <div className='grid grid-cols-3 gap-4'>
        {cards?.map((card, index) => (
          <div
            key={index}
            className={`block max-w-sm p-6 text-center border cursor-pointer rounded-lg shadow  ${card.className}`}
            onClick={() => handleCardSelect(index)}>
            <h5 className='mb-2 text-2xl font-bold tracking-tight'>
              {card.title}
            </h5>
            <p className='font-normal'>{card.desc}</p>
          </div>
        ))}
      </div>

      <form className='mt-6'>
        <div className='py-2'>充值项目（充值比例：1元=1积分）</div>
        {/* 充值选项 */}
        <div className='grid gap-6 mb-6 grid-cols-4'>
          {cardData?.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg text-center bg-gray-50 py-4 cursor-pointer ${
                selectedCard === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleCardSelect(index)}>
              <h3 className='text-yellow-500 font-bold'>{item.points}</h3>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        <hr className='my-6' />

        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div>
            <label
              htmlFor='amount'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              充值其它数量
            </label>
            <input
              type='number'
              id='amount'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='输入数量'
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>
        </div>

        <div className='flex justify-between w-full'>
          <div>
            支付金额：<span className='text-red-500'>￥{amount}</span>
          </div>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            在线充值
          </button>
        </div>

        <ul className='text-gray-600 list-disc pl-6'>
          <li>充值说明：</li>
          <li className='font-bold'>这只是一个演示页面，不存在真实功能！</li>
          <li>充值最低额度为1积分</li>
          <li>充值汇率为1元=1积分，人民币和积分不能互相转换</li>
          <li>余额永久有效，无时间限制</li>
        </ul>
      </form>
    </div>
  )
}
