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
      // 移动端
      if (event.type === 'touchstart' || event.type === 'touchmove') {
        event.clientX = event.touches[0].clientX
        event.clientY = event.touches[0].clientY
      }

      event.mx = event.pageX || event.clientX + document.body.scrollLeft
      // 计算鼠标指针的x轴距离
      event.my = event.pageY || event.clientY + document.body.scrollTop
      // 计算鼠标指针的y轴距离

      return event // 返回标准化的事件对象
    }

    // 定义鼠标事件处理函数
    // document.pointerdown = start
    document.onmousedown = start
    document.ontouchstart = start

    function start (event) { // 按下鼠标时，初始化处理
      if (!draggableElements) return
      event = e(event)// 获取标准事件对象

      for (const drag of draggableElements) {
        // 判断鼠标点击的区域是否是拖拽框内
        if (inDragBox(event, drag)) {
          currentObj = drag.firstElementChild
        }
      }
      if (currentObj) {
        if (event.type === 'touchstart') {
          document.documentElement.style.overflow = 'hidden' // 防止页面一起滚动
        }
        offsetX = event.mx - currentObj.offsetLeft
        offsetY = event.my - currentObj.offsetTop

        document.onmousemove = move// 注册鼠标移动事件处理函数
        document.ontouchmove = move
        document.onmouseup = stop// 注册松开鼠标事件处理函数
        document.ontouchend = stop
      }
    }

    function move(event) { // 鼠标移动处理函数
      event = e(event)
      if (currentObj) {
        const left = event.mx - offsetX// 定义拖动元素的x轴距离
        const top = event.my - offsetY// 定义拖动元素的y轴距离
        currentObj.style.left = left + 'px'// 定义拖动元素的x轴距离
        currentObj.style.top = top + 'px'// 定义拖动元素的y轴距离
        checkInWindow()
      }
    }

    function stop(event) { // 松开鼠标处理函数
      event = e(event)
      //   释放所有操作对象
      document.documentElement.style.overflow = 'auto' // 解除页面滚动限制
      currentObj = document.ontouchmove = document.ontouchend = document.onmousemove = document.onmouseup = null
    }

    /**
     * 鼠标是否在可拖拽区域内
     * @param {*} event
     * @returns
     */
    function inDragBox(event, drag) {
      const { clientX, clientY } = event // 鼠标位置
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = drag.firstElementChild // 窗口位置
      const horizontal = clientX > offsetLeft && clientX < offsetLeft + offsetWidth
      const vertical = clientY > offsetTop && clientY < offsetTop + offsetHeight

      if (horizontal && vertical) {
        return true
      }

      return false
    }

    /**
     * 若超出窗口则吸附。
     */
    function checkInWindow() {
      // 检查是否悬浮在窗口内
      for (const drag of draggableElements) {
        // 判断鼠标点击的区域是否是拖拽框内
        const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = drag.firstElementChild
        const { clientHeight, clientWidth } = document.documentElement
        if (offsetTop < 0) {
          drag.firstElementChild.style.top = 0
        }
        if (offsetTop > (clientHeight - offsetHeight)) {
          drag.firstElementChild.style.top = clientHeight - offsetHeight + 'px'
        }
        if (offsetLeft < 0) {
          drag.firstElementChild.style.left = 0
        }
        if (offsetLeft > (clientWidth - offsetWidth)) {
          drag.firstElementChild.style.left = clientWidth - offsetWidth + 'px'
        }
      }
    }

    window.addEventListener('resize', checkInWindow)

    return () => {
      return () => {
        window.removeEventListener('resize', checkInWindow)
      }
    }
  }, [])

  return <div className='draggable cursor-move'>
     {children}
  </div>
}

Draggable.defaultProps = { left: 0, top: 0 }
