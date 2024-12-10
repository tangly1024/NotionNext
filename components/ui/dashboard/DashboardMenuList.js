import Link from 'next/link'

/**
 * 仪表盘菜单
 * @returns
 */
import { useRouter } from 'next/router'

/**
 * 仪表盘菜单
 * @returns
 */
export default function DashboardMenuList() {
  const { asPath } = useRouter() // 获取当前路径
  const dashBoardMenus = [
    { title: '仪表盘', icon: 'fas fa-gauge', href: '/dashboard' },
    { title: '基础资料', icon: 'fas fa-user', href: '/dashboard/user-profile' },
    { title: '我的余额', icon: 'fas fa-coins', href: '/dashboard/balance' },
    { title: '我的会员', icon: 'fas fa-gem', href: '/dashboard/membership' },
    {
      title: '我的订单',
      icon: 'fas fa-cart-shopping',
      href: '/dashboard/order'
    },
    {
      title: '推广中心',
      icon: 'fas fa-hand-holding-usd',
      href: '/dashboard/affiliate'
    }
  ]

  return (
    <ul
      role='menu'
      className='side-tabs-list bg-white border rounded-lg shadow-lg p-2 space-y-2 mb-6'>
      {dashBoardMenus.map((item, index) => {
        // 判断当前菜单是否高亮
        const isActive = asPath === item.href
        return (
          <li
            role='menuitem'
            key={index}
            className={`rounded-lg cursor-pointer block ${
              isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}>
            <Link
              href={item.href}
              className='block py-2 px-4 w-full items-center justify-center'>
              <i className={`${item.icon} w-6 mr-2`}></i>
              <span className='whitespace-nowrap'>{item.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
