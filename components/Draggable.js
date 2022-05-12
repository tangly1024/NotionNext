import React from 'react'
/**
 * 可拖拽组件
 */

export const Draggable = (props) => {
  const { children } = props
  let currentObj, offsetX, offsetY// 初始化变量，定义备用变量

  React.useEffect(() => {
    const draggableElements = document.getElementsByClassName('draggable')

    // 标准化鼠标事件对象
    function e(event) { // 定义事件对象标准化函数
      if (!event) { // 兼容IE浏览器
        event = window.event
        event.target = event.srcElement
        event.layerX = event.offsetX
        event.layerY = event.offsetY
      }
      event.mx = event.pageX || event.clientX + document.body.scrollLeft
      // 计算鼠标指针的x轴距离
      event.my = event.pageY || event.clientY + document.body.scrollTop
      // 计算鼠标指针的y轴距离
      return event // 返回标准化的事件对象
    }

    // 定义鼠标事件处理函数
    document.onmousedown = function (event) { // 按下鼠标时，初始化处理
      if (!draggableElements) return
      event = e(event)// 获取标准事件对象

      for (const drag of draggableElements) {
        // 判断鼠标点击的区域是否是拖拽框内
        if (inDragBox(event, drag)) {
          currentObj = drag.firstElementChild
        }
      }
      //   console.log('当前拖拽目标', currentObj)

      if (currentObj) {
        offsetX = event.mx - currentObj.offsetLeft
        offsetY = event.my - currentObj.offsetTop
        console.log(offsetX, offsetY)
        document.onmousemove = move// 注册鼠标移动事件处理函数
        document.onmouseup = stop// 注册松开鼠标事件处理函数
      }
    }

    function move(event) { // 鼠标移动处理函数
      event = e(event)
      if (currentObj) {
        currentObj.style.left = event.mx - offsetX + 'px'// 定义拖动元素的x轴距离
        currentObj.style.top = event.my - offsetY + 'px'// 定义拖动元素的y轴距离
      }
    }

    function stop(event) { // 松开鼠标处理函数
      event = e(event)
      // 释放所有操作对象
      currentObj = document.onmousemove = document.onmouseup = null
    }

    /**
     * 鼠标是否在可拖拽区域内
     * @param {*} event
     * @returns
     */
    function inDragBox(event, drag) {
      const { clientX, clientY } = event // 鼠标位置
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = drag.firstElementChild // 窗口位置

      //   console.log('遍历元素', drag)
      //   console.log('鼠标', clientX, clientY)
      //   console.log('窗口', offsetLeft, offsetWidth, offsetTop, offsetHeight)
      //   console.log('鼠标', event)
      //   console.log('窗口', dragTarget)

      const horizontal = clientX > offsetLeft && clientX < offsetLeft + offsetWidth
      const vertical = clientY > offsetTop && clientY < offsetTop + offsetHeight
      //   console.log('判断是否可拖拽 水平 ', horizontal, '垂直', vertical)

      if (horizontal && vertical) {
        return true
      }

      return false
    }

    function checkInWindow() {
      // 检查是否悬浮在窗口内
    }

    window.addEventListener('resize', checkInWindow)
  }, [])

  return <div className='draggable cursor-move'>
     {children}
  </div>
}

Draggable.defaultProps = { left: 0, top: 0 }
