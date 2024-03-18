import Image from 'next/image'
import Logo from './Logo'
import { useGlobal } from '@/lib/global'

/**
 * 顶栏
 * @returns
 */
export default function Header() {
  const { setSideBarVisible } = useGlobal()
  return (
    <header className="z-20">
      <div className="w-full h-16 rounded-md bg-[#1F2030] flex justify-between items-center px-4">
        <Logo />

        <button
          className="flex xl:hidden"
          onClick={() => {
            setSideBarVisible(true)
          }}
        >
          <Image
            src="/svg/search.svg"
            className="mr-2"
            width={20}
            height={20}
          />
        </button>
      </div>
    </header>
  )
}
