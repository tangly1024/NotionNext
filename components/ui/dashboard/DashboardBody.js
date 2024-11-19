'use client'
import { UserProfile } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import DashboardMenuList from './DashboardMenuList'

/**
 * 仪表盘内容主体
 * 组件懒加载
 * @returns
 */
export default function DashboardBody() {
  const asPath = useRouter()?.asPath

  return (
    <div className='flex w-full container gap-x-4 min-h-96 mx-auto mt-12 mb-12 justify-center'>
      <div className='side-tabs w-72'>
        <DashboardMenuList />
      </div>
      <div className='main-content-wrapper grow'>
        {asPath === '/dashboard' && <div>控制台首页</div>}
        {(asPath === '/dashboard/user-profile' ||
          asPath === '/dashboard/user-profile/security') && (
          <UserProfile
            appearance={{
              elements: {
                cardBox: 'w-full',
                rootBox: 'w-full'
              }
            }}
            className='bg-blue-300'
            routing='path'
            path='/dashboard/user-profile'
          />
        )}
        {asPath === '/dashboard/membership' && <div>会员</div>}
        {asPath === '/dashboard/order' && <div>订单</div>}
        {asPath === '/dashboard/favorite' && <div>收藏</div>}
      </div>
    </div>
  )
}
