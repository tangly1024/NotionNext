import Link from 'next/link'

/**
 * 悬浮在屏幕右下角,联系我的按钮
 * @returns {JSX.Element}
 * @constructor
 */
const ContactButton = () => {
  return (
    (<Link
      href='/about'
      className={'fixed right-10 bottom-40 animate__fadeInRight animate__animated animate__faster'}>

      <span
        className='dark:bg-black bg-white px-5 py-3 cursor-pointer shadow-card text-xl hover:bg-blue-500 transform duration-200 hover:text-white hover:shadow'>
        <i className='dark:text-gray-200 fas fa-info' title='about' />
      </span>

    </Link>)
  );
}

export default ContactButton
