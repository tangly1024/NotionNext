import Link from 'next/link'

export default function CategoryItem ({ selected, category, categoryCount }) {
  return (
    <Link
      href={`/category/${category}`}
      passHref
      className={(selected
        ? 'hover:text-white dark:hover:text-white bg-green-600 text-white '
        : 'dark:text-green-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-green-600') +
      ' flex text-sm items-center duration-300 cursor-pointer py-1 font-light px-2 whitespace-nowrap'}>
      {/* <i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`} /> */} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="12" fill="rgba(213,221,222,1)"><path d="M12.9998 3L12.9996 10.267L19.294 6.63397L20.294 8.36602L14.0006 11.999L20.294 15.634L19.294 17.366L12.9996 13.732L12.9998 21H10.9998L10.9996 13.732L4.70557 17.366L3.70557 15.634L9.99857 12L3.70557 8.36602L4.70557 6.63397L10.9996 10.267L10.9998 3H12.9998Z"></path></svg>  {category} {categoryCount && `(${categoryCount})`}
      

    </Link>
  );
}
