import Link from 'next/link'
import { useGameGlobal } from '..'

export const MenuList = () => {
  const { setSideBarVisible } = useGameGlobal()
  return (
    <div>
      <ul>
        <li className='text-white py-4 px-2 font-bold hover:underline'>
          <Link href='/' passHref>
            <span className='flex items-center gap-2'>
              <i className='fas fa-home' />
              Home
            </span>
          </Link>
        </li>
        <li className='text-white py-4 px-2 font-bold hover:underline'>
          <button
            className='flex items-center gap-2'
            onClick={() => {
              setSideBarVisible(true)
            }}>
            <i className='fas fa-search' />
            <span>Search</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
