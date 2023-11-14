import Link from 'next/link'
import { useRouter } from 'next/router'

export const NormalMenu = props => {
  const { link } = props
  const router = useRouter()

  if (!link || !link.show) {
    return null
  }

  const selected = (router.pathname === link.to) || (router.asPath === link.to)

  return <Link
    key={`${link.to}`}
    title={link.to}
    href={link.to}
    className={'py-0.5 duration-500 justify-between text-gray-500 dark:text-gray-300 hover:text-black hover:underline cursor-pointer flex flex-nowrap items-center ' +
        (selected ? 'text-black' : ' ')}>

    <div className='my-auto items-center justify-center flex '>
      <div className={ 'hover:text-black'}>{link.name}</div>
    </div>
    {link.slot}

  </Link>
}
