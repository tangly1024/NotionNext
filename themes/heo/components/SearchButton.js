import Link from 'next/link'

export default function SearchButton() {
  return <Link href="/search" className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all'>
    <i className="fa-solid fa-magnifying-glass"></i>
</Link>
}
