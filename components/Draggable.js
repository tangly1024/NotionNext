import { useEffect, useRef, useState } from 'react'

/**
 * 可拖拽组件
 * @param {children} 渲染的子元素
 * @param {stick} 是否要吸附
 * @returns
 */
export const Draggable = ({ children, stick }) => {
  const draggableRef = useRef(null)
  const rafRef = useRef(null)
  const [moving, setMoving] = useState(false)
  let currentObj, offsetX, offsetY

  useEffect(() => {
    const draggableElements = document.getElementsByClassName('draggable')

    function e(event) {
      if (!event) {
        event = window.event
        event.target = event.srcElement
        event.layerX = event.offsetX
        event.layerY = event.offsetY
      }
      if (event.type === 'touchstart' || event.type === 'touchmove') {
        event.clientX = event.touches[0].clientX
        event.clientY = event.touches[0].clientY
      }
      event.mx = event.pageX || event.clientX + document.body.scrollLeft
      event.my = event.pageY || event.clientY + document.body.scrollTop
      return event
    }

    document.onmousedown = start
    document.ontouchstart = start

    function start(event) {
      if (!draggableElements) return
      event = e(event)

      for (const drag of draggableElements) {
        if (inDragBox(event, drag)) {
          currentObj = drag.firstElementChild
        }
      }
      if (currentObj) {
        if (event.type === 'touchstart') {
          event.preventDefault()
          document.documentElement.style.overflow = 'hidden'
        }

        setMoving(true)
        offsetX = event.mx - currentObj.offsetLeft
        offsetY = event.my - currentObj.offsetTop

        document.onmousemove = move
        document.ontouchmove = move
        document.onmouseup = stop
        document.ontouchend = stop
      }
    }

    function move(event) {
      event = e(event)
      rafRef.current = requestAnimationFrame(() => updatePosition(event))
    }

    const stop = event => {
      event = e(event)
      document.documentElement.style.overflow = 'auto'
      cancelAnimationFrame(rafRef.current)
      setMoving(false)
      if (stick) {
        checkInWindow() // 吸附逻辑
      }
      currentObj =
        document.ontouchmove =
        document.ontouchend =
        document.onmousemove =
        document.onmouseup =
          null
    }

    const updatePosition = event => {
      if (currentObj) {
        const left = event.mx - offsetX
        const top = event.my - offsetY
        currentObj.style.left = left + 'px'
        currentObj.style.top = top + 'px'
      }
    }

    function inDragBox(event, drag) {
      const { clientX, clientY } = event
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } =
        drag.firstElementChild
      const horizontal =
        clientX > offsetLeft && clientX < offsetLeft + offsetWidth
      const vertical = clientY > offsetTop && clientY < offsetTop + offsetHeight

      return horizontal && vertical
    }

    function checkInWindow() {
      for (const drag of draggableElements) {
        const { offsetHeight, offsetWidth, offsetTop, offsetLeft } =
          drag.firstElementChild
        const { clientHeight, clientWidth } = document.documentElement
        if (offsetTop < 0) {
          drag.firstElementChild.style.top = '0px'
        }
        if (offsetTop > clientHeight - offsetHeight) {
          drag.firstElementChild.style.top = clientHeight - offsetHeight + 'px'
        }
        if (offsetLeft < 0) {
          drag.firstElementChild.style.left = '0px'
        }
        if (offsetLeft > clientWidth - offsetWidth) {
          drag.firstElementChild.style.left = clientWidth - offsetWidth + 'px'
        }
        if (stick === 'left') {
          drag.firstElementChild.style.left = '0px'
        } else if (stick === 'right') {
          drag.firstElementChild.style.left = clientWidth - offsetWidth + 'px'
        }
      }
    }

    window.addEventListener('resize', checkInWindow)

    return () => {
      window.removeEventListener('resize', checkInWindow)
      cancelAnimationFrame(rafRef.current)
    }
  }, [stick])

  return (
    <div
      className={`draggable ${moving ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      ref={draggableRef}>
      {children}
    </div>
  )
}
