import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export const MenuItemPCNormal = props => {
  const { link } = props
  const router = useRouter()
  const selected = router.pathname === link.href || router.asPath === link.href
  if (!link || !link.show) {
    return null
  }

  return (
    <SmartLink
      key={`${link.id}-${link.slug}`}
      title={link.name}
      href={link.href}
      className={
        'px-2 duration-300 text-sm justify-between dark:text-gray-300 cursor-pointer flex flex-nowrap items-center ' +
        (selected
          ? 'bg-green-600 text-white hover:text-white'
          : 'hover:text-green-600')
      }>
      <div className='items-center justify-center flex '>
        <i className={link.icon} />
        <div className='ml-2 whitespace-nowrap'>{link.name}</div>
      </div>
      {link.slot}
    </SmartLink>
  )
}
