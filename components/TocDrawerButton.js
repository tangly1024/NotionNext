import React from 'react'
import { useGlobal } from '@/lib/global'

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
    <div id='toc-drawer-button' className='right-0 fixed flex top-40 mr-4 duration-500 z-40 hidden' onClick={props.onClick}>
      <div className='transform hover:scale-105 duration-200 '>
        <div style={{ borderRadius: '28px' }}
          className={'animate__fadeInUp bg-white dark:bg-gray-700 px-1 py-1 cursor-pointer animate__animated animate__faster shadow-xl'}>
          <div className='text-center dark:text-gray-100'>
            <div className='w-10 text-xl' title={locale.COMMON.TABLE_OF_CONTENTS} ><i className='fa fa-book'/> </div>
            <div className='text-xs'>{locale.COMMON.TABLE_OF_CONTENTS}</div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TocDrawerButton
