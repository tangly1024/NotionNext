import Link from 'next/link'
import { useRouter } from 'next/router'

export const MenuItemNormal = props => {
  const router = useRouter()

  const { link } = props
  const selected = router.pathname === link.href || router.asPath === link.href

  return (
    <Link
      key={link.href}
      title={link.href}
      href={link.href}
      className={
        'py-2 px-5 duration-300 text-base justify-between hover:bg-gray-700 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
        (selected
          ? 'bg-indigo-500 text-white '
          : ' text-black dark:text-white ')
      }>
      <div className='my-auto items-center justify-between flex '>
        <i className={`${link.icon} w-4 ml-3 mr-6 text-center`} />
        <div>{link.name}</div>
      </div>
      {link.slot}
    </Link>
  )
}
