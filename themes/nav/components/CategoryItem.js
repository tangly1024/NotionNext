import SmartLink from '@/components/SmartLink'

export default function CategoryItem ({ selected, category, categoryCount }) {
  return (
    <SmartLink
      href={`/category/${category}`}
      passHref
      className={(selected
        ? 'hover:text-white dark:hover:text-white bg-green-600 text-white '
        : 'dark:text-green-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-green-600') +
      ' flex text-sm items-center duration-300 cursor-pointer py-1 font-light px-2 whitespace-nowrap'}>

      <div><i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`} />{category} {categoryCount && `(${categoryCount})`}
      </div>

    </SmartLink>
  );
}
