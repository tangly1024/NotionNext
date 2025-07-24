import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export const MenuItemNormal = props => {
  const { link } = props
  const router = useRouter()
  const selected = router.pathname === link.href || router.asPath === link.href
  if (!link || !link.show) {
    return null
  }
  return (
    <SmartLink
      key={`${link.href}`}
      title={link.href}
      href={link.href}
      className={
        'py-0.5 duration-500 justify-between text-gray-500 dark:text-gray-300 hover:text-black hover:underline cursor-pointer flex flex-nowrap items-center ' +
        (selected ? 'text-black' : ' ')
      }>
      <div className='my-auto items-center justify-center flex '>
        <div className={'hover:text-black'}>{link.name}</div>
      </div>
      {link.slot}
    </SmartLink>
  )
}
