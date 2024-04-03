import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

const MenuGroupCard = (props) => {
  const { postCount, categoryOptions, tagOptions } = props
  const { locale } = useGlobal()
  const archiveSlot = <div className='text-center'>{postCount}</div>
  const categorySlot = <div className='text-center'>{categoryOptions?.length}</div>
  const tagSlot = <div className='text-center'>{tagOptions?.length}</div>

  const links = [
    { name: locale.COMMON.ARTICLE, to: '/archive', slot: archiveSlot, show: siteConfig('HEXO_MENU_ARCHIVE', null, CONFIG) },
    { name: locale.COMMON.CATEGORY, to: '/category', slot: categorySlot, show: siteConfig('HEXO_MENU_CATEGORY', null, CONFIG) },
    { name: locale.COMMON.TAGS, to: '/tag', slot: tagSlot, show: siteConfig('HEXO_MENU_TAG', null, CONFIG) }
  ]

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
    }
  }

  return (
    <nav id='nav' className='leading-8 flex justify-center mt-4 dark:text-gray-200 w-full divide-x divide-black dark:divide-white'>
        {links.map(link => {
          if (link.show) {
            return (
              <Link
                key={`${link.to}`}
                title={link.to}
                href={link.to}
                target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                className={'px-4 duration-300 text-base justify-center items-center cursor-pointer'}>

                <div className='w-full items-center justify-center hover:scale-105 duration-200 transform hover:text-hexo-primary'>
                  <div className='text-center text-2xl font-semibold'>{link.slot}</div>
                  <div className='text-center text-md'>{link.name}</div>
                </div>

              </Link>
            )
          } else {
            return null
          }
        })}
      </nav>
  )
}
export default MenuGroupCard
