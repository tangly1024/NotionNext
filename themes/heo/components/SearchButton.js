import { useGlobal } from '@/lib/global'
import Link from 'next/link'

export default function SearchButton() {
  const { locale } = useGlobal()
  return <Link href="/search" title={locale.NAV.SEARCH} alt={locale.NAV.SEARCH} className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all'>
    <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass"/>
</Link>
}
