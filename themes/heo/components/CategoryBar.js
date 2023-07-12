import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions } = props
  const { locale } = useGlobal()

  return <div id='category-bar' className="flex justify-between items-center h-12 mb-4 space-x-2 w-full bg-white border
         py-2 px-4 rounded-xl hover:border hover:border-indigo-600 transition-colors duration-200">

        <div id='category-bar-items' className='flex justify-start space-x-2'>
            <MenuItem href='/' name={locale.NAV.INDEX} />
            {categoryOptions?.map((c, index) => {
              return (
                    <div key={index}>
                        <MenuItem href={`/category/${c.name}`} name={c.name} />
                    </div>
              )
            })}
        </div>

        <div id='category-bar-next' className='flex'>
            <Link href='/category' className='font-bold text-gray-900 transition-colors duration-200 hover:text-indigo-600'>
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
  return <div className={`duration-200 transition-all font-bold px-2 py-0.5 rounded-md text-gray-900 hover:text-white hover:bg-indigo-600 ${selected ? 'text-white bg-indigo-600' : ''}`}>
        <Link href={href}>{name}</Link>
    </div>
}
