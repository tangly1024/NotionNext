import React from 'react'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListOl } from '@fortawesome/free-solid-svg-icons'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  const { locale } = useGlobal()

  return (
    <div id='toc-drawer-button' className='right-1 fixed flex bottom-52 duration-500 z-40 hidden' onClick={props.onClick}>
      <div className='transform hover:scale-105 duration-200 '>
        <div className='animate__fadeInRight animate__animated bg-white dark:bg-gray-700 px-1 py-2.5 cursor-pointer shadow-card'>
          <div className='text-center dark:text-gray-100'>
            <div className='w-10 text-xl' title={locale.COMMON.TABLE_OF_CONTENTS} ><FontAwesomeIcon icon={faListOl} /> </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TocDrawerButton
