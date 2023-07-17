import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions, border = true } = props
  const { locale } = useGlobal()

  return <div id='category-bar' className={`flex flex-nowrap justify-between items-center h-12 mb-4 space-x-2 w-full lg:bg-white dark:lg:bg-[#1e1e1e]  
  ${border ? 'lg:border lg:hover:border dark:lg:border-gray-800 hover:border-indigo-600 dark:hover:border-yellow-600 ' : ''}  py-2 lg:px-2 rounded-xl transition-colors duration-200`}>

        <div id='category-bar-items' className='rounded-lg scroll-hidden flex justify-start flex-nowrap items-center overflow-x-scroll'>
            <MenuItem href='/' name={locale.NAV.INDEX} />
            {categoryOptions?.map((c, index) => <MenuItem key={index} href={`/category/${c.name}`} name={c.name} />)}
        </div>

        <div id='category-bar-next' className='flex'>
            <Link href='/category' className='whitespace-nowrap font-bold text-gray-900 dark:text-white transition-colors duration-200 hover:text-indigo-600'>
                {locale.COMMON.MORE}
            </Link>
        </div>
    </div>
}

/**
 * 按钮
 * @param {*} param0
 * @returns
 */
const MenuItem = ({ href, name }) => {
  const router = useRouter()
  const selected = router.pathname === href
  return <div className={`whitespace-nowrap mr-2 duration-200 transition-all font-bold px-2 py-0.5 rounded-md text-gray-900 dark:text-white hover:text-white hover:bg-indigo-600 dark:hover:bg-yellow-600 ${selected ? 'text-white bg-indigo-600 dark:bg-yellow-600' : ''}`}>
        <Link href={href}>{name}</Link>
    </div>
}
