import { useEffect, useState } from 'react'

/**
 * 会员
 * @returns
 */
export default function DashboardItemMembership() {
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [amount, setAmount] = useState(0)

  const memberships = [
    {
      title: '年度会员',
      points: 98,
      duration: '365天',
      benefits: [
        '日更5到20个热门项目',
        '全站资源免费获取',
        '内部会员专属交流群',
        '可补差价升级',
        '推广佣金高达40％'
      ]
    },
    {
      title: '永久会员',
      points: 138,
      duration: '永久',
      benefits: [
        '日更5到20个热门项目',
        '全站资源免费获取',
        '内部会员专属交流群',
        '可补差价升级',
        '推广佣金高达70％'
      ]
    },
    {
      title: '站长训练营',
      points: 1998,
      duration: '永久',
      benefits: [
        '站长学员请联系助理对接',
        '一对一扶持搭建网站',
        '提供独家引流技术照做就能成功',
        '全站素材直接复刻到学员新站',
        '软件一键同步更新',
        '学员专属社群及交流群',
        '设立高额福利的打卡机制（增强学员执行力）'
      ]
    }
  ]

  const handleMembershipSelect = index => {
    setSelectedMembership(index)
    setAmount(memberships[index].points)
  }

  const handleAmountChange = e => {
    const value = e.target.value
    setAmount(value)
  }

  useEffect(() => {
    if (selectedMembership !== null) {
      // 如果用户选中了会员，自动更新支付金额
      const selectedPoints = memberships[selectedMembership]?.points
      if (selectedPoints) {
        setAmount(selectedPoints)
      }
    }
  }, [selectedMembership])

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 border'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>会员注册</h2>
        <hr className='my-2' />
      </div>

      {/* 会员卡片 */}
      <div className='grid grid-cols-3 gap-4'>
        {memberships.map((membership, index) => (
          <div
            key={index}
            className={`block max-w-sm p-6 text-center border cursor-pointer rounded-lg shadow ${
              selectedMembership === index ? 'bg-blue-100' : 'bg-gray-50'
            }`}
            onClick={() => handleMembershipSelect(index)}>
            <h5 className='mb-2 text-2xl font-bold tracking-tight'>
              {membership.title}
            </h5>
            <p className='font-normal'>所需积分：{membership.points} 积分</p>
            <p className='font-normal'>会员时长：{membership.duration}</p>
            <ul className='text-gray-600 mt-2'>
              {membership.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <form className='mt-6'>
        <div className='flex justify-between w-full mb-4'>
          <div>
            支付金额：<span className='text-red-500'>￥{amount}</span>
          </div>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            立即开通
          </button>
        </div>

        <ul className='text-gray-600 list-disc pl-6'>
          <li>开通会员说明：</li>
          <li className='font-bold'>这只是一个演示页面，不存在真实功能！</li>
          <li>本站会员账号权限为虚拟数字资源，开通后不可退款</li>
          <li>开通会员后可享有对应会员特权的商品折扣，免费权限</li>
          <li>会员特权到期后不享受特权</li>
          <li>重复购买特权到期时间累计增加</li>
        </ul>
      </form>
    </div>
  )
}
