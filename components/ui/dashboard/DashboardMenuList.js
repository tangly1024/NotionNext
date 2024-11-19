import Link from 'next/link'

/**
 * 仪表盘菜单
 * @returns
 */
export default function DashboardMenuList() {
  const dashBoardMenus = [
    { title: '控制台', href: '/dashboard' },
    { title: '基础资料', href: '/dashboard/user-profile' },
    { title: '我的会员', href: '/dashboard/membership' },
    { title: '我的订单', href: '/dashboard/order' },
    { title: '我的收藏', href: '/dashboard/favorite' }
  ]
  return (
    <ul
      role='menu'
      className='side-tabs-list bg-white border rounded-lg shadow-lg p-2 space-y-2'>
      {dashBoardMenus?.map((item, index) => (
        <li
          role='menuitem'
          key={index}
          className='hover:bg-gray-100 rounded-lg cursor-pointer block'>
          <Link
            href={item.href}
            className='block py-2 px-4 w-full' // 让 Link 填充整个 li
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
