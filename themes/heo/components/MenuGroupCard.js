import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

const MenuGroupCard = (props) => {
  const { postCount, categoryOptions, tagOptions } = props
  const { locale } = useGlobal()
  const archiveSlot = <div className='text-center'>{postCount}</div>
  const categorySlot = <div className='text-center'>{categoryOptions?.length}</div>
  const tagSlot = <div className='text-center'>{tagOptions?.length}</div>

  const links = [
    { name: locale.COMMON.ARTICLE, to: '/archive', slot: archiveSlot, show: siteConfig('HEO_MENU_ARCHIVE', null, CONFIG) },
    { name: locale.COMMON.CATEGORY, to: '/category', slot: categorySlot, show: siteConfig('HEO_MENU_CATEGORY', null, CONFIG) },
    { name: locale.COMMON.TAGS, to: '/tag', slot: tagSlot, show: siteConfig('HEO_MENU_TAG', null, CONFIG) }
  ]

  return (
        <nav id='nav' className='dark:text-gray-200 w-full px-5'>
            {links.map((link, index) => {
              if (link.show) {
                return (
                        <div key={index} className=''>
                            <Link title={link.to}
                                href={link.to}
                                target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                                className={'w-full flex items-center justify-between py-1 hover:scale-105 duration-200 transform dark:hover:text-indigo-400 hover:text-indigo-600 px-2 cursor-pointer'}>
                                <>
                                    <div>{link.name} :</div>
                                    <div className='font-semibold'>{link.slot}</div>
                                </>
                            </Link>
                        </div>

                )
              } else {
                return null
              }
            })}
        </nav>
  )
}
export default MenuGroupCard
