import React from 'react'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  return (
    <div id='jump-to-top' className='right-0 fixed flex bottom-40 mr-4 duration-500 z-30' onClick={props.onClick}>
      <div className='transform hover:scale-105 duration-200 '>
        <div style={{ boxShadow: 'rgba(41, 50, 60, 0.5) 0px 2px 16px', borderRadius: '28px' }}
          className={'animate__fadeInUp bg-gray-700 px-1 py-1 cursor-pointer animate__animated animate__faster shadow-2xl'}>
          <div className='text-center text-gray-100'>
            <div className='w-10 text-xl' title='目录' ><i className='fa fa-book'/> </div>
            <div className='text-xs'>目录</div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TocDrawerButton
