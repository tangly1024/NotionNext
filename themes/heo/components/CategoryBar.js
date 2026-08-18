import { ChevronDoubleLeft, ChevronDoubleRight } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { buildSlugMap, fromSlug, toSlug } from '@/lib/utils/slugMap'
import { useRef, useState } from 'react'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions, border = true } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const categorySlugMap = buildSlugMap(categoryOptions?.map(c => c.name) || [])
  const currentCategory = fromSlug(router.query.category, categorySlugMap)
  const [scrollRight, setScrollRight] = useState(false)
  // 创建一个ref引用
  const categoryBarItemsRef = useRef(null)

  // 点击#right时，滚动#category-bar-items到最右边
  const handleToggleScroll = () => {
    if (categoryBarItemsRef.current) {
      const { scrollWidth, clientWidth } = categoryBarItemsRef.current
      if (scrollRight) {
        categoryBarItemsRef.current.scrollLeft = 0
      } else {
        categoryBarItemsRef.current.scrollLeft = scrollWidth - clientWidth
      }
      setScrollRight(!scrollRight)
    }
  }

  return (
    <div
      id='category-bar'
      className={`wow fadeInUp flex flex-nowrap justify-between items-center h-12 mb-4 space-x-2 w-full lg:bg-[var(--heo-color-card)] dark:lg:bg-[var(--heo-color-card-dark)]
            ${border ? 'lg:border lg:hover:border dark:lg:border-gray-800 hover:border-[var(--heo-color-border)] dark:hover:border-[var(--heo-color-border-dark)] ' : ''}  py-2 lg:px-2 rounded-xl transition-colors duration-200`}>
      <div
        id='category-bar-items'
        ref={categoryBarItemsRef}
        className='scroll-smooth max-w-4xl rounded-lg scroll-hidden flex justify-start flex-nowrap items-center overflow-x-scroll'>
        <MenuItem href='/' name={locale.NAV.INDEX} selected={false} />
        {categoryOptions?.map((c, index) => (
          <MenuItem
            key={index}
            href={`/category/${encodeURIComponent(toSlug(c.name, categorySlugMap))}`}
            name={c.name}
            selected={currentCategory === c.name}
          />
        ))}
      </div>

      <div id='category-bar-next' className='flex items-center justify-center'>
        <div
          id='right'
          className='cursor-pointer mx-2 dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)] hover:text-[var(--heo-color-primary)]'
          onClick={handleToggleScroll}>
          {scrollRight ? (
            <ChevronDoubleLeft className={'w-5 h-5'} />
          ) : (
            <ChevronDoubleRight className={'w-5 h-5'} />
          )}
        </div>
        <SmartLink
          href='/category'
          className='whitespace-nowrap font-bold text-gray-900 dark:text-white transition-colors duration-200 hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
          {locale.MENU.CATEGORY}
        </SmartLink>
      </div>
    </div>
  )
}

/**
 * 按钮
 * @param {*} param0
 * @returns
 */
const MenuItem = ({ href, name, selected = false }) => {
  return (
    <div
      className={`whitespace-nowrap mr-2 duration-200 transition-all font-bold px-2 py-0.5 rounded-md text-gray-900 dark:text-white hover:text-[var(--heo-color-primary-text)] hover:bg-[var(--heo-color-primary)] dark:hover:bg-[var(--heo-color-accent)] ${selected ? 'text-[var(--heo-color-primary-text)] bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]' : ''}`}>
      <SmartLink href={href}>{name}</SmartLink>
    </div>
  )
}
