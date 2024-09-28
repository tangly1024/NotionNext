import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'

/**
 * 侧边抽屉
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = props => {
  const { siteInfo } = props
  const router = useRouter()
  return (
    &lt;div id='side-bar'&gt;
      &lt;div className='h-52 w-full flex justify-center'&gt;
        &lt;div&gt;
          &lt;div
            onClick={() => {
              router.push('/')
            }}
            className='justify-center items-center flex hover:rotate-45 py-6 hover:scale-105 dark:text-gray-100 transform duration-200 cursor-pointer'&gt;
            {/* 头像 */}
            &lt;div className="rounded-lg"&gt;
              &lt;LazyImage
                src={siteInfo?.icon}
                className="rounded-lg"
                width={80}
                alt={siteConfig('AUTHOR')}
              /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      {/* 其他代码 ... */}
    &lt;/div&gt;
  )
}

export default SideBar
