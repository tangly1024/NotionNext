import React from 'react'

/**
 * TailwindCss中自定义扩展了font-custom 这个扩展fontFamily，但页面中没有实际用到，会导致编译时被忽略。
 * 为了确保blog.config.js中配置使用 font-custom字体能生效，在此写入一个font-custom样式，页面中无实际作用，用effect勾子删除即可
 * @returns
 */
const TailwindCustomCssInit = () => {
  const cssInitRef = React.useRef(null)

  React.useEffect(() => {
    cssInitRef?.current?.remove()
  })
  return <div ref={cssInitRef} className='font-custom'></div>
}

export default TailwindCustomCssInit
