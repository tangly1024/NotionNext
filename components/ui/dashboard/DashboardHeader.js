import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/utils/formatDate'
import Link from 'next/link'
import DashboardSignOutButton from './DashboardSignOutButton'

/**
 * 仪表盘页头
 * @returns
 */
export default function DashboardHeader() {
  const { user } = useGlobal()

  return (
    <>
      <div className='flex w-full container mx-auto mt-12 mb-12 justify-ends'>
        {/* 头像昵称 */}
        <div className='flex items-center gap-4 w-full'>
          <LazyImage
            className='w-10 h-10 rounded-full'
            src={user?.imageUrl}
            alt={user?.fullName}
          />

          <div class='font-medium dark:text-white'>
            <div className='flex items-center gap-x-2'>
              <span>{user?.fullName}</span>
              <Link href='/dashboard/membership'>
                <span class='bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300'>
                  普通用户
                </span>
              </Link>
            </div>
            <div className='text-sm text-gray-500 gap-x-2 flex dark:text-gray-400'>
              <span>{user?.username}</span>
              <span>{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* 登出按钮 */}
        <div className='flex items-center'>
          <DashboardSignOutButton />
        </div>
      </div>
    </>
  )
}
