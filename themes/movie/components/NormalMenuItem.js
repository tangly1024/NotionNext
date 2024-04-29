import Link from 'next/link'

/**
 * 旧的普通菜单
 * @param {*} props
 * @returns
 */
export const NormalMenuItem = (props) => {
  const { link } = props
  return link?.show && <Link href={link.to} key={link.to}
        className="px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light">
        {link.name}
    </Link>
}
